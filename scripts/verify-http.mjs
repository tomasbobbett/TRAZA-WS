import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_ROUTES } from './demo-routes.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../public');
const base=(process.argv[2] || 'http://127.0.0.1:4183').replace(/\/$/, '');
async function walk(path) { const all=[]; for(const entry of await readdir(path,{withFileTypes:true})) { const p=join(path,entry.name); if(entry.isDirectory()) all.push(...await walk(p));else all.push(p); }return all; }
const pages=(await walk(root)).filter(p=>p.endsWith('.html')&&!p.endsWith('404.html'));
const assets=new Set(['/favicon.ico','/apple-touch-icon.png','/robots.txt','/enlaces.txt']);
for (const { route, brand } of DEMO_ROUTES) {
  for (const path of [route, route.slice(0, -1)]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).includes(`<title>${brand} —`), path);
    assert.ok(new URL(response.url).pathname.startsWith(route), `${path}: must stay in its own industry`);
  }
}
if(await stat(join(root,'sitemap.xml')).then(()=>true,()=>false))assets.add('/sitemap.xml');
for(const file of pages) {
  const path='/'+relative(root,file).replaceAll('\\','/');
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  assert.match(response.headers.get('content-type'),/text\/html/,path);
  const html=await response.text();
  const source=await readFile(file,'utf8');
  const title=source.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(html.includes(`<title>${title}</title>`),`${path}: stale or missing page title`);
  for(const [,ref] of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|#|mailto:|tel:|data:)/.test(ref))continue;
    const url=new URL(ref,base+path);
    if(!url.pathname.endsWith('.html'))assets.add(url.pathname+url.search);
  }
}
for(const path of assets) {
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  const type=response.headers.get('content-type') || '';
  assert.ok(!type.includes('text/html'),`${path}: asset served as HTML`);
  await response.arrayBuffer();
}
const missing=await fetch(base+'/this-page-does-not-exist');
assert.equal(missing.status,404);
assert.match((await missing.text()).replace(/<[^>]+>/g,' '),/Este camino\s+no lleva a una web/);
for(const path of ['/comercial/PLAN_COMERCIAL.md','/respaldo/site-anterior/package.json','/webs/agencia/prospeccion.html','/agencia/prospeccion.html']) {
  const response=await fetch(base+path);
  assert.equal(response.status,404,`${path}: internal material is public`);
}
console.log(`HTTP verification passed: ${pages.length} pages, ${assets.size} assets, custom 404.`);

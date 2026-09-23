import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { DEMOS } from '../scripts/demo-content.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../public');
async function walk(folder) { const result=[]; for(const entry of await readdir(folder,{withFileTypes:true})) { const p=join(folder,entry.name); if(entry.isDirectory())result.push(...await walk(p));else result.push(p); }return result; }
const files=await walk(root);
const pages=files.filter(p=>p.endsWith('.html'));
const exists=p=>stat(p).then(()=>true,()=>false);
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replaceAll('&amp;','&')]));

test('every public page contains content, identity, language and share metadata without JavaScript',async()=>{
  assert.equal(pages.length,34);
  for(const file of pages) {
    const html=await readFile(file,'utf8');
    assert.match(html,/<html lang="es-AR">/,file);
    assert.match(html,/<main\b/,file);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,file);
    assert.match(html,/<meta name="description" content=".{25,}"/,file);
    assert.match(html,/<meta property="og:title"/,file);
    assert.match(html,/<meta name="twitter:description"/,file);
    for(const rel of ['icon','apple-touch-icon','manifest']) assert.match(html,new RegExp(`<link rel="${rel}"`),file);
    assert.doesNotMatch(html,/data:,|5491100000000|111234567890|hola@pulso\.club|Activá JavaScript para ver|<div id="app"><\/div>|logo-prueba/);
    const ids=[...html.matchAll(/\bid="([^"]*)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,`Duplicate IDs in ${file}`);
  }
});

test('local links, fragments, images, scripts and styles resolve across the full catalogue',async()=>{
  const errors=[];
  for(const file of pages) {
    const html=await readFile(file,'utf8');
    for(const tag of html.match(/<(?:a|link|script|img|iframe)\b[^>]*>/g)||[]) {
      const a=attrs(tag), ref=a.href||a.src;
      if(!ref||/^(https?:|mailto:|tel:|data:)/.test(ref))continue;
      const [path,fragment]=ref.split('#');
      const clean=decodeURIComponent(path.split('?')[0]);
      const target=clean ? (clean.startsWith('/')?join(root,clean):resolve(dirname(file),clean)) : file;
      if(!await exists(target)) {errors.push(`${file}: missing ${ref}`);continue;}
      if(fragment && extname(target)==='.html') {
        const targetHTML=await readFile(target,'utf8');
        if(!targetHTML.includes(`id="${fragment}"`)) errors.push(`${file}: missing anchor ${ref}`);
      }
      if(a.target==='_blank'&&!a.rel?.includes('noopener'))errors.push(`${file}: unsafe target ${ref}`);
    }
  }
  assert.deepEqual(errors,[]);
});

test('each shareable demo has its own brand and primary image',async()=>{
  for(const [key,demo] of Object.entries(DEMOS)) {
    const html=await readFile(join(root,'nichos',`${key}.html`),'utf8');
    assert.ok(html.includes(`<title>${demo.brand} —`));
    assert.ok(html.includes(`property="og:title" content="${demo.brand} —`));
    assert.ok(html.includes(`property="og:image" content="${demo.heroImage.replaceAll('&','&amp;')}"`));
    assert.doesNotMatch(html,/og-catalogo\.png/);
    assert.ok(html.includes(`assets/icons/${key}/favicon.ico`));
    assert.match(html,/no se realizan reservas/);
  }
});

test('all 13 favicon families have valid ICO, PNG sizes and manifests',async()=>{
  for(const key of ['traza','pulso',...Object.keys(DEMOS)]) {
    const folder=join(root,'assets/icons',key);
    const ico=await readFile(join(folder,'favicon.ico'));
    assert.deepEqual([...ico.subarray(0,4)],[0,0,1,0]);
    assert.equal(ico.readUInt16LE(4),3);
    for(const [name,size] of [['favicon-32.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
      const png=await readFile(join(folder,name));
      assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
    }
    const manifest=JSON.parse(await readFile(join(folder,'site.webmanifest'),'utf8'));
    assert.ok(await exists(join(root,manifest.start_url)));
    for(const icon of manifest.icons)assert.ok(await exists(join(folder,icon.src)));
  }
});

test('internal sales tools and working screenshots are excluded from the public package',async()=>{
  assert.equal(await exists(join(root,'agencia/prospeccion.html')),false);
  assert.equal(await exists(join(root,'PLAN_COMERCIAL.md')),false);
  assert.equal(files.some(p=>/preview[^\\/]*\.png$/.test(p)),false);
});

test('contact form prepares a WhatsApp message instead of a fake server submission',async()=>{
  const html=await readFile(join(root,'1_basico/pages/contacto.html'),'utf8');
  assert.match(html,/id="gym-contact" action="https:\/\/wa.me\/5493446210306"/);
  assert.match(html,/contacto.js/);
  const js=await readFile(join(root,'1_basico/contacto.js'),'utf8');
  assert.match(js,/event.preventDefault\(\)/);
  assert.match(js,/reportValidity\(\)/);
  assert.match(js,/url.searchParams.set\('text', text\)/);
});

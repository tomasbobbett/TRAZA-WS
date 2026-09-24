import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { resolveOrigin } from '../scripts/site-origin.mjs';

const read = path => readFile(new URL('../public/' + path, import.meta.url), 'utf8');

test('production and preview use Netlify URLs instead of the previous hosting', () => {
  const old = { origin: 'https://previous.example' };
  const production = { NETLIFY: 'true', CONTEXT: 'production', URL: 'https://catalogue.netlify.app', DEPLOY_PRIME_URL: 'https://deploy.netlify.app' };
  assert.equal(resolveOrigin(old, production), 'https://catalogue.netlify.app');
  assert.equal(resolveOrigin(old, { ...production, CONTEXT: 'deploy-preview' }), 'https://deploy.netlify.app');
  assert.equal(resolveOrigin(old, { ...production, SITE_ORIGIN: 'https://custom.example/' }), 'https://custom.example');
  assert.equal(resolveOrigin({}, {}), '');
  for (const origin of ['http://example.com', 'https://example.com/path', 'https://user:password@example.com', 'https://example.com?test=1']) {
    assert.throws(() => resolveOrigin({ origin }, {}));
  }
});

test('the root renders the complete catalogue and all thirteen demos can be shared', async () => {
  const homepage = await read('index.html');
  assert.match(homepage, /id="demo"/);
  assert.match(homepage, /href="\/agencia\/styles.css/);
  assert.match(homepage, /src="\/assets\/motion.js/);
  assert.equal((homepage.match(/class="niche-demo /g) || []).length, 13);
  assert.doesNotMatch(homepage, /http-equiv="refresh"/);
  assert.equal((await read('enlaces.txt')).split('\n').filter(line => /\/demo\/[a-z]+\/$/.test(line)).length, 13);
});

test('only web assets are included in the published folder', async () => {
  const entries = await readdir(new URL('../public/', import.meta.url));
  assert.deepEqual(entries.sort(), ['1_basico', '404.html', '_headers', 'agencia', 'apple-touch-icon.png', 'assets', 'demo', 'enlaces.txt', 'favicon.ico', 'index.html', 'nichos', 'robots.txt', ...(entries.includes('sitemap.xml') ? ['sitemap.xml'] : [])].sort());
  const files = await readdir(new URL('../public/', import.meta.url), { recursive: true });
  assert.equal(files.some(path => /(?:prospeccion|comercial|respaldo|node_modules|\.git|\.env|preview.*\.png)/i.test(path)), false);
  for (const file of files.filter(path => path.endsWith('.html'))) {
    assert.doesNotMatch(await read(file), /https?:[^\s"']+\.chatgpt\.site/);
  }
});

test('public agency assets contain no prospecting dashboard or sales storage', async () => {
  const forbidden = /traza-(?:prospects|metrics)-v1|prospectForm|prospectRows|setupProspects|setupMetrics|data-copy-target|cockpit-hero|pipeline-table/;
  for (const file of ['index.html', 'agencia/index.html', 'agencia/app.js', 'agencia/styles.css']) {
    assert.doesNotMatch(await read(file), forbidden, file);
  }
});

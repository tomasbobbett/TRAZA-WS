import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { DEMO_ROUTES, DEMO_PAGES } from '../scripts/demo-routes.mjs';

const read = path => readFile(new URL('../public' + path, import.meta.url), 'utf8');

test('every industry opens its own complete demo and never sends visitors to the catalogue', async () => {
  assert.equal(DEMO_ROUTES.length, 13);
  for (const { source, route } of DEMO_PAGES) {
    for (const path of [source, `${route}index.html`]) {
      const html = await read(path);
      assert.match(html, /<main\b/);
      assert.match(html, /href="https:\/\/wa.me\/5493446210306\?text=/);
      assert.doesNotMatch(html, /Todas las demos|Volver al catálogo|Ver todas las demos|href="[^"]*agencia\/index.html/i, path);
      assert.doesNotMatch(html, /http-equiv="refresh"|window.location/, path);
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
      if (canonical) {
        assert.equal(new URL(canonical[1]).pathname, route, path);
        assert.ok(html.includes(`property="og:url" content="${canonical[1]}"`), path);
      }
    }
  }
});

test('PULSO navigation stays inside its industry including contact, FAQs and the venue', async () => {
  const home = await read('/demo/gimnasio/index.html');
  for (const key of ['contacto', 'faqs', 'sedes']) {
    assert.ok(home.includes(`href="/demo/gimnasio/${key}/index.html"`), key);
    const page = await read(`/demo/gimnasio/${key}/index.html`);
    assert.ok(page.includes('href="/demo/gimnasio/index.html"'), key);
  }
});

test('direct demos resolve resources and navigation with or without a trailing slash', async () => {
  for (const { route } of DEMO_PAGES) {
    const html = await read(`${route}index.html`);
    for (const [, ref] of html.matchAll(/(?:src|href|action)="([^"]+)"/g)) {
      if (/^(https?:|#|mailto:|tel:|data:)/.test(ref)) continue;
      assert.equal(new URL(ref, 'https://example.com' + route).href,
        new URL(ref, 'https://example.com' + route.slice(0, -1)).href, `${route}: ${ref}`);
    }
  }
});

test('the share list contains only the thirteen direct demo links and the catalogue uses them', async () => {
  const links = (await read('/enlaces.txt')).split('\n').filter(line => /^(https:\/\/|\/)/.test(line));
  assert.equal(links.length, 13);
  assert.deepEqual(links.map(link => new URL(link, 'https://example.com').pathname), DEMO_ROUTES.map(demo => demo.route));
  const catalogue = await read('/agencia/index.html');
  for (const { key, brand } of DEMO_ROUTES) {
    assert.ok(catalogue.includes(`href="../demo/${key}/index.html"`), brand);
    const html = await read(`/demo/${key}/index.html`);
    assert.ok(html.includes(`<title>${brand} —`), brand);
    assert.doesNotMatch(html, /og-catalogo.png/);
  }
});

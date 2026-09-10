import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';
import { DEMOS } from '../scripts/demo-content.mjs';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public');
const read = path => readFile(resolve(publicDir, path), 'utf8');
const declarations = text => Object.fromEntries(text.split(';').map(s => s.trim()).filter(Boolean).map(s => {
    const split = s.indexOf(':');
    return [s.slice(0, split).trim(), s.slice(split + 1).trim()];
}));
const rule = (css, selector) => declarations(css.slice(css.indexOf(selector + ' {') + selector.length + 2).split('}')[0]);

test('the 12 demos and PULSO secondary pages use the TRAZA contact identity', async () => {
    const pages = ['1_basico/index.html', ...['contacto', 'faqs', 'sedes'].map(p => `1_basico/pages/${p}.html`), ...Object.keys(DEMOS).map(p => `nichos/${p}.html`)];
    for (const path of pages) {
        const html = await read(path);
        const button = html.match(/<a class="floating-contact[^]*?<\/a>/g) || [];
        assert.equal(button.length, 1, path);
        assert.match(button[0], /floating-contact__label">WhatsApp<\/span>/, path);
        assert.match(button[0], /img\/logo-whatsapp.png" width="24" height="24" alt=""/, path);
        assert.match(button[0], /href="https:\/\/wa.me\/5493446210306\?text=/, path);
        assert.match(button[0], /target="_blank" rel="noopener"/, path);
        assert.match(html, /assets\/whatsapp.css\?v=20260910-traza/, path);
        assert.doesNotMatch(html, /class="whatsapp"/, path);
    }
});

test('desktop and mobile button dimensions, colour and transitions match TRAZA CSS', async () => {
    const main = await read('agencia/styles.css');
    const shared = await read('assets/whatsapp.css');
    for (const selector of ['.floating-contact', '.floating-contact__icon', '.floating-contact__icon img', '.floating-contact__label']) {
        const original = rule(main, selector);
        const current = rule(shared, selector);
        for (const [key, value] of Object.entries(original)) {
            assert.equal(current[key], value === 'var(--white)' ? '#fff' : value, `${selector} ${key}`);
        }
    }
    assert.deepEqual(rule(shared, '.floating-contact:hover'), {
        ...rule(main, '.floating-contact:hover'), ...rule(main, '.client-page .floating-contact:hover')
    });
    const mainMobile = main.slice(main.indexOf('@media (max-width: 600px)'));
    const sharedMobile = shared.slice(shared.indexOf('@media (max-width: 600px)'));
    for (const selector of ['.floating-contact', '.floating-contact__icon']) {
        assert.deepEqual(rule(sharedMobile, selector), rule(mainMobile, selector));
    }
});

test('all contact buttons appear after the same scroll threshold and hide at the top', async () => {
    for (const path of ['agencia/app.js', 'nichos/demo.js', '1_basico/script.js']) {
        const js = await read(path);
        const toggle = js.split('\n').find(line => /(?:floatingContact|whatsappButton)\?\.classList.toggle/.test(line));
        assert.ok(toggle, path);
        for (const scrollY of [0, 160, 161, 900]) {
            let visible;
            const button = { classList: { toggle: (name, value) => { assert.equal(name, 'is-visible'); visible = value; } } };
            vm.runInNewContext(toggle, { floatingContact: button, whatsappButton: button, scrollY, y: scrollY });
            assert.equal(visible, scrollY > 160, `${path} at ${scrollY}`);
        }
    }
});

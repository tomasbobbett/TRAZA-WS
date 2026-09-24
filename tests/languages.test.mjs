import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DEMO_PAGES } from '../scripts/demo-routes.mjs';
import { makeDictionary, pageStrings, isUnchanged } from '../scripts/i18n.mjs';
import { dynamicCopy } from '../scripts/translations.mjs';

test('every demo and secondary page has complete curated English and Portuguese copy', async () => {
    const dictionary = makeDictionary();
    for (const { source, route } of DEMO_PAGES) {
        for (const file of [source, `${route}index.html`]) {
            const html = await readFile(new URL(`../public${file}`, import.meta.url), 'utf8');
            for (const source of pageStrings(html)) {
                assert.ok(dictionary[source] || isUnchanged(source), `${file}: ${source}`);
                if (dictionary[source]) assert.ok(dictionary[source].length === 2 && dictionary[source].every(text => typeof text === 'string' && text.trim()), source);
            }
            const payload = JSON.parse(html.match(/<script id="demo-translations" type="application\/json">([^]*?)<\/script>/)[1]);
            for (const source of [...pageStrings(html), ...dynamicCopy]) {
                if (dictionary[source]) assert.deepEqual(payload[source], dictionary[source], `${file}: ${source}`);
            }
            assert.match(html, /assets\/languages.css/);
            assert.match(html, /assets\/languages.js/);
            assert.match(html, /<html lang="es-AR">/);
        }
    }
});

test('translated WhatsApp context retains the brand and service for every destination', async () => {
    const dictionary = makeDictionary();
    for (const { source } of DEMO_PAGES) {
        const html = await readFile(new URL(`../public${source}`, import.meta.url), 'utf8');
        for (const match of html.matchAll(/href="(https:\/\/wa.me\/[^"]+)"/g)) {
            const url = new URL(match[1]);
            const isNursery = source === '/nichos/vivero.html';
            assert.equal(url.pathname, isNursery ? '/59172139484' : '/5493446210306');
            const copy = dictionary[url.searchParams.get('text')];
            assert.equal(copy?.length, 2, match[1]);
            assert.ok(copy.every(text => text.includes(isNursery ? 'Vivero la Loma' : 'TRAZA') && !text.includes('undefined')));
        }
    }
});

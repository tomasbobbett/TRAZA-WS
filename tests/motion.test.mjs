import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DEMOS } from '../scripts/demo-content.mjs';
const read=path=>readFile(new URL(`../public/${path}`,import.meta.url),'utf8');

test('all sites load shared motion before their interaction scripts',async()=>{
    for(const route of ['index.html','agencia/index.html','agencia/privacidad.html','1_basico/index.html',...['sedes','faqs','contacto'].map(key=>`1_basico/pages/${key}.html`),...Object.keys(DEMOS).map(key=>`nichos/${key}.html`)]) {
        const html=await read(route);
        const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)];
        const runtime = scripts.filter(match => !match[1].includes('assets/languages.js'));
        assert.match(runtime[0][1],/assets\/motion.js/);
        if (scripts.some(match => match[1].includes('assets/languages.js'))) assert.match(scripts[0][1], /assets\/languages.js/);
        assert.equal(scripts.filter(match=>match[1].includes('assets/motion.js')).length,1,route);
        assert.ok(scripts.every(match=>/\bdefer\b/.test(match[0])),route);
        assert.match(html,/assets\/motion.css\?v=20260924-vivero/);
    }
});

test('production styles preserve animations and never snap scrolling or disable all transitions',async()=>{
    for(const file of ['agencia/styles.css','nichos/demo.css','1_basico/css/main.css','1_basico/css/pages/index.css','assets/motion.css']) {
        const css=await read(file);
        assert.doesNotMatch(css,/animation\s*:\s*none\s*!important/,file);
        assert.doesNotMatch(css,/transition\s*:\s*none\s*!important/,file);
        assert.doesNotMatch(css,/scroll-snap-type\s*:\s*y/,file);
    }
    assert.match(await read('agencia/styles.css'),/@keyframes hero-float/);
    assert.match(await read('nichos/demo.css'),/@keyframes marquee/);
    assert.match(await read('1_basico/css/pages/index.css'),/@keyframes ticker/);
});

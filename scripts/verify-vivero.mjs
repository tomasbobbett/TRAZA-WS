import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4183';
const output = 'qa-vivero';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const report = { layouts: [], errors: [], network: [] };
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('requestfailed', request => report.network.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto(`${base}/demo/vivero/?lang=es`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('h1.visible').waitFor();
    await page.screenshot({ path: `${output}/desktop.png` });
    const chooseLanguage = async language => {
        const previewOpen = await page.locator('.nursery-result').evaluate(el => el.open);
        if (previewOpen) await page.locator('[data-quote-close]').click();
        await page.locator('.language-trigger').click();
        await page.locator(`[data-language="${language}"].language-option`).click();
        if (previewOpen) await page.locator('#nursery-quote button[type="submit"]').click();
    };
    for (const language of ['es', 'en', 'pt']) {
        await chooseLanguage(language);
        for (const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1280,556],[1121,700],[1120,700],[1024,768],[1024,600],[1024,556],[768,1024],[390,844],[320,568],[844,390],[667,375]]) {
            await page.setViewportSize({ width, height });
            await page.waitForTimeout(200);
            const layout = await page.evaluate(() => {
                const outside = [];
                for (const el of document.querySelectorAll('h1,h2,h3,.plant-info,.catalog-filters,.hero-metrics,.nav-actions,.nursery-steps li,.nursery-map,.nursery-map-caption')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > innerWidth + 1 || rect.left < -1 || el.scrollWidth > el.clientWidth + 1) outside.push(el.className || el.tagName);
                }
                const hero = document.querySelector('h1').getBoundingClientRect();
                const nav = document.querySelector('.nav').getBoundingClientRect();
                const sectionHeights = [...document.querySelectorAll('main>header,main>section')].map(el=>({id:el.id,height:el.offsetHeight}));
                const heroActions = document.querySelector('.nursery-hero .hero-actions').getBoundingClientRect();
                const heroPhoto = document.querySelector('.nursery-hero-photo').getBoundingClientRect();
                const metrics = document.querySelector('.hero-metrics').getBoundingClientRect();
                const viewportFits = innerHeight <= 460 || sectionHeights[0].height <= innerHeight + 2;
                return { overflow: document.documentElement.scrollWidth - innerWidth, outside, heroClear: hero.top >= nav.bottom, heroFits:heroActions.bottom <= metrics.top && heroPhoto.bottom <= metrics.top && metrics.bottom <= sectionHeights[0].height && viewportFits, sectionHeights };
            });
            report.layouts.push({ language, width, height, ...layout });
            assert.equal(layout.overflow, 0, `${language}/${width}: horizontal overflow`);
            assert.deepEqual(layout.outside, [], `${language}/${width}: clipped content`);
            assert.ok(layout.heroClear, `${language}/${width}: hero overlaps navigation`);
            assert.ok(layout.heroFits, `${language}/${width}/${height}: hero content must fit above its metrics`);
        }
        for (const [filter, expected] of [['citricos',2],['tropicales',2],['all',4]]) {
            await page.locator(`[data-plant-filter="${filter}"]`).click();
            assert.equal(await page.locator('.plant-card:not([hidden])').count(), expected);
            assert.equal(await page.locator('[data-catalog-count]').textContent(), String(expected));
            assert.equal(await page.locator('.catalog-filters [aria-pressed="true"]').count(), 1);
        }
        const message = new URL(await page.locator('.floating-contact').getAttribute('href')).searchParams.get('text');
        assert.ok(message.includes('Vivero la Loma'));
        assert.ok(message.startsWith({ es: 'Hola', en: 'Hello', pt: 'Olá' }[language]));
        await page.locator('.menu-button').click();
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
    }
    await chooseLanguage('es');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${output}/mobile.png` });
    await page.locator('[data-plant-filter="citricos"]').click();
    await chooseLanguage('pt');
    assert.equal(await page.locator('.plant-card:not([hidden])').count(), 2, 'Language changes preserve selected filter');
    await chooseLanguage('es');
    await page.locator('[data-plant-filter="all"]').click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#catalogo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${output}/catalogo.png` });
    for (const section of ['#proyectos','#experiencia','#cotizar','#preguntas','#visitanos']) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
    }
    await page.screenshot({ path: `${output}/full.png`, fullPage: true });
    await page.setViewportSize({width:1280,height:556});
    for(const id of ['inicio','proyectos','catalogo','experiencia','cotizar','preguntas','visitanos']) {
        await page.locator(`#${id}`).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
        await page.waitForTimeout(900);
        await page.screenshot({path:`${output}/viewport-${id}.png`});
    }
    for(let index=0;index<5;index++) {
        await page.locator('#preguntas summary').nth(index).click();
        assert.equal(await page.locator('#preguntas details[open]').count(),1);
    }
    await page.locator('#preguntas summary').last().click();
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, [], 'All local photographs load');
    // Quote preparation must preserve selections and details across all languages.
    await page.locator('[data-buyer="Municipio"]').click();
    assert.equal(await page.locator('#quote-buyer').inputValue(), 'Municipio');
    await page.locator('[data-species="Limón"]').click();
    assert.ok(await page.locator('[name="species"][value="Limón"]').isChecked());
    await page.locator('[data-species="Palta"]').click();
    await page.locator('#quote-name').fill('María Pérez');
    await page.locator('#quote-org').fill('Proyecto comunitario');
    await page.locator('#quote-destination').fill('El Torno, Santa Cruz, Bolivia');
    await page.locator('#quote-quantity').fill('250');
    await page.locator('#quote-date').fill('2026-11');
    await page.locator('#quote-details').fill('Entrega en dos etapas & documentación <consulta>.');
    await page.locator('#nursery-quote button[type="submit"]').click();
    for (const language of ['es','en','pt']) {
        await chooseLanguage(language);
        const url = new URL(await page.locator('[data-quote-link]').getAttribute('href'));
        const message = url.searchParams.get('text');
        assert.equal(url.pathname, '/59172139484');
        for (const value of ['María Pérez','Proyecto comunitario','El Torno, Santa Cruz, Bolivia','250','2026-11','Entrega en dos etapas & documentación <consulta>.']) assert.ok(message.includes(value), value);
        assert.ok(message.includes({es:'Limón, Palta',en:'Lemon, Avocado',pt:'Limão, Abacate'}[language]));
        assert.ok(message.includes({es:'Municipio',en:'Municipality',pt:'Município'}[language]));
        assert.equal(await page.locator('.nursery-message-preview').textContent(), message);
        assert.ok(await page.locator('.nursery-result').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}));
    }
    await chooseLanguage('es');
    await page.locator('[data-quote-close]').click();
    await page.locator('#quote-quantity').fill('300');
    assert.ok(await page.locator('.nursery-result').isHidden(), 'Editing invalidates the old quote link');
    await page.locator('#nursery-quote button[type="submit"]').click();
    assert.ok(new URL(await page.locator('[data-quote-link]').getAttribute('href')).searchParams.get('text').includes('300'));
    await page.keyboard.press('Escape');
    await page.locator('#quote-name').fill('   ');
    await page.locator('#nursery-quote button[type="submit"]').click();
    assert.ok(await page.locator('.nursery-result').isHidden(), 'Whitespace name cannot create a quote');
    await page.locator('#quote-name').fill('María Pérez');
    await page.locator('#quote-quantity').fill('0');
    await page.locator('#nursery-quote button[type="submit"]').click();
    assert.ok(await page.locator('.nursery-result').isHidden(), 'Zero quantity rejected');
    assert.ok(await page.locator('#quote-quantity').evaluate(el => !el.validity.valid));
    await page.locator('#quote-quantity').fill('');
    await page.locator('#nursery-quote button[type="submit"]').click();
    assert.ok(new URL(await page.locator('[data-quote-link]').getAttribute('href')).searchParams.get('text').includes('A definir'));
    await page.locator('[data-quote-close]').click();
    await page.locator('#preguntas summary').first().click();
    assert.ok(await page.locator('#preguntas details').first().getAttribute('open') !== null);
    const map = new URL(await page.locator('a[href*="google.com/maps"]').getAttribute('href'));
    assert.equal(map.searchParams.get('query'), '2J5J+7W, El Torno, Bolivia');
    const embeddedMap = new URL(await page.locator('.nursery-map iframe').getAttribute('src'));
    assert.equal(embeddedMap.searchParams.get('q'), map.searchParams.get('query'));
    assert.equal(embeddedMap.searchParams.get('output'), 'embed');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    for (const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
        await page.setViewportSize({width,height});
        for (const id of ['experiencia','visitanos']) {
            await page.locator(`#${id}`).scrollIntoViewIfNeeded();
            await page.waitForTimeout(1000);
            await page.locator(`#${id}`).screenshot({path:`${output}/${id}-${device}.png`});
        }
    }
    await page.locator('h1').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1');
    assert.equal(await page.locator('.motion-control,.motion-toggle').count(), 0);
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(`${base}/demo/vivero/`);
    assert.equal(await noJS.locator('.plant-card:visible').count(), 4);
    assert.equal(await noJS.locator('.catalog-filters:visible').count(), 0);
    assert.equal(await noJS.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
    assert.equal(await noJS.locator('.nursery-form-fields:visible').count(), 0);
    assert.equal(await noJS.locator('noscript a[href*="59172139484"]').count(), 1);
    const agency = await browser.newPage();
    await agency.goto(base);
    assert.equal(await agency.locator('.niche-demo').count(), 13);
    assert.equal(await agency.locator('a.niche-demo[href*="/demo/vivero/"]').count(), 1);
    assert.deepEqual(report.errors, []);
    console.log(`Vivero la Loma: ${report.layouts.length} layouts, filters, translations, menu, images, reduced motion and no-JS passed.`);
} finally {
    await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
    await browser.close();
}

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
        await page.locator('.language-trigger').click();
        await page.locator(`[data-language="${language}"].language-option`).click();
    };
    for (const language of ['es', 'en', 'pt']) {
        await chooseLanguage(language);
        for (const width of [1440, 1280, 1121, 1120, 1024, 768, 390, 320]) {
            await page.setViewportSize({ width, height: width > 600 ? 1000 : 844 });
            await page.waitForTimeout(200);
            const layout = await page.evaluate(() => {
                const outside = [];
                for (const el of document.querySelectorAll('h1,h2,h3,.plant-info,.catalog-filters,.hero-metrics,.nav-actions')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > innerWidth + 1 || rect.left < -1 || el.scrollWidth > el.clientWidth + 1) outside.push(el.className || el.tagName);
                }
                const hero = document.querySelector('h1').getBoundingClientRect();
                const nav = document.querySelector('.nav').getBoundingClientRect();
                return { overflow: document.documentElement.scrollWidth - innerWidth, outside, heroClear: hero.top >= nav.bottom };
            });
            report.layouts.push({ language, width, ...layout });
            assert.equal(layout.overflow, 0, `${language}/${width}: horizontal overflow`);
            assert.deepEqual(layout.outside, [], `${language}/${width}: clipped content`);
            assert.ok(layout.heroClear, `${language}/${width}: hero overlaps navigation`);
        }
        for (const [filter, expected] of [['interior',2],['suculentas',1],['accesorios',1],['all',4]]) {
            await page.locator(`[data-plant-filter="${filter}"]`).click();
            assert.equal(await page.locator('.plant-card:not([hidden])').count(), expected);
            assert.equal(await page.locator('[data-catalog-count]').textContent(), String(expected));
            assert.equal(await page.locator('.catalog-filters [aria-pressed="true"]').count(), 1);
        }
        const message = new URL(await page.locator('.plant-card a').first().getAttribute('href')).searchParams.get('text');
        assert.ok(message.includes('RAÍZ') && message.includes('TRAZA'));
        assert.ok(message.includes(language === 'pt' ? 'Costela-de-adão' : 'Monstera'));
        assert.ok(message.startsWith({ es: 'Hola', en: 'Hi', pt: 'Olá' }[language]));
        await page.locator('.menu-button').click();
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
    }
    await chooseLanguage('es');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${output}/mobile.png` });
    await page.locator('[data-plant-filter="interior"]').click();
    await chooseLanguage('pt');
    assert.equal(await page.locator('.plant-card:not([hidden])').count(), 2, 'Language changes preserve selected filter');
    await chooseLanguage('es');
    await page.locator('[data-plant-filter="all"]').click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#catalogo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${output}/catalogo.png` });
    for (const section of ['#servicios','#experiencia','.quote','#visitanos']) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
    }
    await page.screenshot({ path: `${output}/full.png`, fullPage: true });
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, [], 'All local photographs load');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('h1').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1');
    assert.equal(await page.locator('.motion-control,.motion-toggle').count(), 0);
    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(`${base}/demo/vivero/`);
    assert.equal(await noJS.locator('.plant-card:visible').count(), 4);
    assert.equal(await noJS.locator('.catalog-filters:visible').count(), 0);
    assert.equal(await noJS.locator('h1').evaluate(el => getComputedStyle(el).opacity), '1');
    const agency = await browser.newPage();
    await agency.goto(base);
    assert.equal(await agency.locator('.niche-demo').count(), 13);
    assert.equal(await agency.locator('a.niche-demo[href*="/demo/vivero/"]').count(), 1);
    assert.deepEqual(report.errors, []);
    console.log(`RAÍZ: ${report.layouts.length} layouts, filters, translations, menu, images, reduced motion and no-JS passed.`);
} finally {
    await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
    await browser.close();
}

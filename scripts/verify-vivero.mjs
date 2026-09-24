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
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('requestfailed', request => report.network.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto(`${base}/demo/vivero/?lang=es`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const chooseLanguage = async language => {
        await page.locator('.language-trigger').click();
        await page.locator(`[data-language="${language}"].language-option`).click();
    };
    async function checkScreens(context) {
        const layout = await page.evaluate(() => {
            const screens = [...document.querySelectorAll('main>header,main>section')];
            const oversized = screens.filter(el => el.offsetHeight > innerHeight + 2).map(el => `${el.id}: ${el.offsetHeight}px`);
            const overflow = document.documentElement.scrollWidth - innerWidth;
            const clipped = [...document.querySelectorAll('h1,h2,h3,.nursery-form,.nursery-field,.catalog-filters')].filter(el => {
                if (!el.getClientRects().length || el.closest('[data-carousel]')) return false;
                const rect = el.getBoundingClientRect();
                return rect.left < -1 || rect.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1;
            }).map(el => el.className || el.textContent);
            const offCenter = screens.filter(el => {
                if (el.tagName === 'HEADER') return false;
                const shell = el.firstElementChild;
                const css = getComputedStyle(el);
                const top = parseFloat(css.paddingTop), bottom = parseFloat(css.paddingBottom);
                const expected = top + (el.clientHeight - top - bottom) / 2;
                return Math.abs(shell.offsetTop + shell.offsetHeight / 2 - expected) > 3;
            }).map(el => el.id);
            return { oversized, overflow, clipped, offCenter };
        });
        report.layouts.push({ ...context, ...layout });
        assert.deepEqual(layout, { oversized: [], overflow: 0, clipped: [], offCenter: [] }, JSON.stringify(context));
    }
    const sizes = [[1920,1080],[1440,900],[1366,768],[1366,650],[1280,560],[1024,768],[768,1024],[390,844],[360,640],[320,568],[844,390]];
    for (const language of ['es', 'en', 'pt']) {
        await chooseLanguage(language);
        for (const [width,height] of sizes) {
            await page.setViewportSize({ width,height });
            await page.waitForTimeout(180);
            const context = { language,width,height };
            await checkScreens({ ...context, state: 'initial' });
            await page.locator('#quote-name').fill('María Pérez');
            await page.locator('#quote-buyer').selectOption('Municipio');
            await page.locator('[data-form-next]').click();
            await checkScreens({ ...context, state: 'fruit-step' });
            await page.locator('#quote-destination').fill('El Torno, Bolivia');
            await page.locator('[name="species"][value="Limón"]').check();
            await page.locator('[name="species"][value="Palta"]').check();
            await page.locator('[data-form-next]').click();
            await checkScreens({ ...context, state: 'details-step' });
            await page.locator('#quote-quantity').fill('250');
            await page.locator('#quote-date').fill('2026-11');
            await page.locator('[data-form-next]').click();
            await checkScreens({ ...context, state: 'final-details' });
            await page.locator('#quote-org').fill('Proyecto comunitario');
            await page.locator('#quote-details').fill('Entrega en dos etapas & documentación <consulta>.');
            await page.locator('[data-form-submit]').click();
            await checkScreens({ ...context, state: 'review' });
            const url = new URL(await page.locator('[data-quote-link]').getAttribute('href'));
            const message = url.searchParams.get('text');
            assert.equal(url.pathname, '/59172139484');
            for (const value of ['María Pérez','Proyecto comunitario','El Torno, Bolivia','250','2026-11','Entrega en dos etapas & documentación <consulta>.']) assert.ok(message.includes(value), value);
            assert.ok(message.includes({es:'Limón, Palta',en:'Lemon, Avocado',pt:'Limão, Abacate'}[language]));
            assert.equal(await page.locator('.nursery-message-preview').textContent(), message);
            await page.locator('[data-form-edit]').click();
        }
        for (const [filter,expected] of [['citricos',2],['tropicales',2],['all',4]]) {
            await page.locator(`[data-plant-filter="${filter}"]`).click();
            assert.equal(await page.locator('.plant-card:not([hidden])').count(), expected);
            await page.waitForTimeout(50);
            const pager = page.locator('[data-pager="plant-grid"]');
            assert.equal(await pager.locator('[data-page-position]').textContent(), `1 / ${expected}`);
            await pager.locator('[data-page-next]').click();
            await page.waitForTimeout(650);
            assert.equal(await pager.locator('[data-page-position]').textContent(), `2 / ${expected}`);
            await checkScreens({ language, state: `filter-${filter}` });
        }
        for (const id of ['buyer-slides','process-slides']) {
            const pager = page.locator(`[data-pager="${id}"]`);
            for (let index=2;index<=3;index++) {
                await pager.locator('[data-page-next]').click();
                await page.waitForTimeout(650);
                assert.equal(await pager.locator('[data-page-position]').textContent(), `${index} / 3`);
                await checkScreens({language,state:`${id}-${index}`});
            }
            while (!(await pager.locator('[data-page-prev]').isDisabled())) {
                await pager.locator('[data-page-prev]').click();
                await page.waitForTimeout(650);
            }
        }
        for(let index=0;index<5;index++) {
            await page.locator('#nursery-question').selectOption(String(index));
            await checkScreens({language,state:`faq-${index}`});
            assert.ok(await page.locator('#preguntas details[data-active]').isVisible());
        }
        await page.locator('.menu-button').click();
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
    }
    await chooseLanguage('es');
    // The steps validate required data without losing earlier selections.
    await page.locator('#quote-name').fill('   ');
    await page.locator('[data-form-next]').click();
    assert.ok(await page.locator('[data-quote-step="0"]').isVisible());
    await page.locator('#quote-name').fill('María Pérez');
    await page.locator('[data-form-next]').click();
    await chooseLanguage('en');
    assert.ok(await page.locator('[data-quote-step="1"]').isVisible());
    assert.ok(await page.locator('[name="species"][value="Palta"]').isChecked());
    await page.locator('[data-form-next]').click();
    await page.locator('#quote-quantity').fill('0');
    await page.locator('[data-form-next]').click();
    assert.ok(await page.locator('[data-quote-step="2"]').isVisible());
    await page.locator('#quote-quantity').fill('');
    await page.locator('[data-form-next]').click();
    await page.locator('[data-form-submit]').click();
    assert.ok(new URL(await page.locator('[data-quote-link]').getAttribute('href')).searchParams.get('text').includes('To be determined'));
    await chooseLanguage('pt');
    assert.ok(new URL(await page.locator('[data-quote-link]').getAttribute('href')).searchParams.get('text').startsWith('Olá'));
    await page.locator('[data-form-edit]').click();
    await chooseLanguage('es');
    for(const [name,width,height] of [['desktop',1366,650],['mobile',390,844],['small',320,568],['landscape',844,390]]) {
        await page.setViewportSize({width,height});
        for(const id of ['inicio','proyectos','catalogo','experiencia','cotizar','preguntas','visitanos']) {
            await page.locator(`#${id}`).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
            await page.waitForTimeout(950);
            await page.screenshot({path:`${output}/${name}-${id}.png`});
        }
    }
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, []);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('h1')).opacity==='1');
    const noJS = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await noJS.goto(`${base}/demo/vivero/`);
    assert.equal(await noJS.locator('.plant-card').count(),4);
    assert.ok(await noJS.locator('.catalog-filters').isHidden());
    assert.ok(await noJS.locator('.nursery-form-fields').isHidden());
    assert.equal(await noJS.locator('noscript a[href*="59172139484"]').count(),1);
    assert.equal(await noJS.locator('h1').evaluate(el=>getComputedStyle(el).opacity),'1');
    assert.deepEqual(report.errors, []);
    console.log(`Vivero la Loma: ${report.layouts.length} viewport/state checks, slides, form steps, translations and no-JS passed.`);
} finally {
    await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
    await browser.close();
}

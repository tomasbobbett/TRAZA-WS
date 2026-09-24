import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4183';
const checks = [];
const ok = message => { checks.push(message); console.log(message); };
try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const chooseLanguage = async lang => {
        await page.locator('.language-trigger').click();
        await page.locator(`.language-option[data-language="${lang}"]`).click();
        assert.equal(await page.locator('.language-current').textContent(), lang.toUpperCase());
        assert.equal(await page.locator('.language-trigger').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.language-dropdown').isVisible(), false);
    };
    await page.goto(base + '/demo/gimnasio/?lang=en');
    assert.equal(await page.locator('.language-current').textContent(), 'EN');
    assert.equal(await page.locator('.language-dropdown').isVisible(), false);
    await page.locator('.language-trigger').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('.language-dropdown').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement.dataset.language), 'en');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
    assert.equal(await page.locator('.language-trigger').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'language-trigger');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
    await page.goto(base + '/demo/estetica/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
    await page.goto(base + '/demo/gimnasio/?lang=en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    ok('Keyboard selection, reload, cross-demo persistence and explicit URL priority');

    await page.locator('.language-trigger').click();
    await page.keyboard.press('End');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.language), 'pt');
    await page.keyboard.press('Home');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.language), 'es');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.language-dropdown').isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement.className), 'language-trigger');
    await page.locator('.language-trigger').click();
    await page.keyboard.press('End');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.language-dropdown').isVisible(), false);
    await page.locator('.nav__toggle').click();
    await page.locator('.language-trigger').click();
    assert.equal(await page.locator('.nav__toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.language-dropdown').isVisible(), true);
    await page.locator('h1').click();
    assert.equal(await page.locator('.language-dropdown').isVisible(), false);
    ok('Dropdown closes on selection, Escape, Tab and outside click; mobile menus do not overlap');

    await page.locator('#openGaleria').click();
    assert.equal(await page.locator('#galeriaModal').getAttribute('aria-hidden'), 'false');
    assert.equal((await page.locator('#gallery-title').textContent()).trim(), 'Inside the club');
    assert.equal(await page.locator('#closeGaleria').getAttribute('aria-label'), 'Close gallery');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#galeriaModal').getAttribute('aria-hidden'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'openGaleria');
    ok('Translated gallery, close action and restored keyboard focus');

    await chooseLanguage('pt');
    assert.equal(await page.locator('.motion-control, .motion-toggle').count(), 0);
    assert.equal(await page.locator('.ticker__track').evaluate(el => getComputedStyle(el).animationPlayState), 'running');
    ok('Carousel keeps running across language switches without a pause control');

    await page.goto(base + '/demo/gimnasio/faqs/?lang=en');
    await page.locator('summary').first().click();
    await chooseLanguage('pt');
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    assert.equal((await page.locator('summary').first().textContent()).trim(), 'Preciso de experiência para começar?');
    ok('FAQ answer remains open while changing language');

    for (const lang of ['es', 'en', 'pt']) {
        await page.goto(base + '/demo/gimnasio/contacto/?lang=' + lang);
        const validity = await page.locator('#contact-name').evaluate(el => el.validationMessage);
        assert.equal(validity, { es: 'Completá tu nombre.', en: 'Enter your name.', pt: 'Preencha seu nome.' }[lang]);
        await page.locator('#contact-name').fill('Ana & <Studio>');
        await page.locator('#contact-business').fill('Gym + Club');
        await page.locator('#contact-message').fill('Consulta de prueba / keep my words {name}');
        await chooseLanguage('en');
        await chooseLanguage(lang);
        assert.equal(await page.locator('#contact-name').inputValue(), 'Ana & <Studio>');
        assert.equal(await page.locator('#contact-message').inputValue(), 'Consulta de prueba / keep my words {name}');
        let prepared;
        await page.route('https://wa.me/**', async route => {
            prepared = new URL(route.request().url());
            await route.fulfill({ contentType: 'text/html', body: '<p>WhatsApp destination intercepted for local verification.</p>' });
        });
        await Promise.all([page.waitForURL('https://wa.me/**'), page.locator('button[type="submit"]').click()]);
        assert.equal(prepared.pathname, '/5493446210306');
        assert.ok(prepared.searchParams.get('text').startsWith({ es: 'Hola, soy Ana & <Studio> de Gym + Club.', en: "Hi, I'm Ana & <Studio> from Gym + Club.", pt: 'Olá, sou Ana & <Studio> da Gym + Club.' }[lang]));
        assert.ok(prepared.searchParams.get('text').endsWith('Consulta de prueba / keep my words {name}'));
        await page.unroute('https://wa.me/**');
    }
    ok('All three form languages: localized required validation, preserved input and safely encoded WhatsApp message (intercepted, never sent)');

    const blocked = await browser.newContext();
    await blocked.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('Storage disabled'); }; Storage.prototype.setItem = () => { throw new Error('Storage disabled'); }; });
    const isolated = await blocked.newPage();
    await isolated.goto(base + '/demo/gimnasio/?lang=pt');
    assert.equal(await isolated.locator('html').getAttribute('lang'), 'pt-BR');
    await isolated.locator('.footer__links a[href*="contacto"]').click();
    assert.equal(await isolated.locator('html').getAttribute('lang'), 'pt-BR');
    ok('Language selection and internal navigation work when browser storage is disabled');
    await blocked.close();

    const plain = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await plain.newPage();
    await staticPage.goto(base + '/demo/odontologia/');
    assert.match(await staticPage.locator('h1').textContent(), /Volvé a sonreír/);
    assert.equal(await staticPage.locator('.language-switcher').count(), 0);
    ok('Complete Spanish fallback with JavaScript disabled');
    await plain.close();
    assert.deepEqual(errors, []);
    ok('No browser JavaScript errors');
    await mkdir('qa-languages', { recursive: true });
    await writeFile('qa-languages/interactions.json', JSON.stringify({ checks }, null, 2));
} finally { await browser.close(); }

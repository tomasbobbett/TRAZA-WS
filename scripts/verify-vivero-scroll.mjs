import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4183';
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const report = { checks: [], errors: [] };
const check = (condition, label) => { assert.ok(condition, label); report.checks.push(label); };
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(`${base}/demo/vivero/?lang=es`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    await page.mouse.move(300, 450);
    await page.evaluate(() => {
        window.scrollSamples = [];
        const start = performance.now();
        const sample = now => {
            window.scrollSamples.push({ time: now - start, y: scrollY });
            if (now - start < 1100) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
    });
    await page.mouse.wheel(0, 480);
    await page.waitForTimeout(1300);
    const samples = await page.evaluate(() => window.scrollSamples);
    report.wheel = { samples, distinctPositions: new Set(samples.map(sample => sample.y)).size };
    check(report.wheel.distinctPositions > 8, 'Wheel input advances gradually across multiple frames');
    check(Math.abs(samples.at(-1).y - 480) <= 2, 'Wheel input settles at its requested distance');
    check(samples.every((sample, index) => !index || sample.y >= samples[index - 1].y), 'Wheel input does not jump backward');

    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(80);
    check(await page.locator('.nursery-map iframe').evaluate(el => getComputedStyle(el).pointerEvents === 'none'), 'Map does not interrupt active wheel momentum');
    await page.locator('.nav-links a[href="#catalogo"]').click();
    await page.waitForTimeout(1400);
    check(new URL(page.url()).hash === '#catalogo', 'Anchor links preserve their URL');
    check(Math.abs(await page.locator('#catalogo').evaluate(el => el.getBoundingClientRect().top) - 100) < 3, 'Anchor navigation cancels momentum and respects the fixed header');
    check(await page.locator('.nursery-map iframe').evaluate(el => getComputedStyle(el).pointerEvents === 'auto'), 'Map interaction returns when scrolling settles');

    await page.mouse.wheel(0, 120);
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    check(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY < 3), 'Keyboard scrolling can take over from wheel input');
    await page.keyboard.press('Home');
    await page.waitForTimeout(1000);
    await page.locator('.hero-actions a[href="#cotizar"]').click();
    await page.waitForTimeout(1200);
    await page.locator('#quote-name').fill('Prueba de desplazamiento');
    await page.locator('#quote-buyer').selectOption('Municipio');
    await page.locator('#quote-destination').fill('El Torno');
    await page.locator('#quote-details').fill('Detalle de la consulta.\n'.repeat(45));
    await page.locator('#quote-details').evaluate(el => { el.scrollTop = 0; });
    await page.locator('#quote-details').hover();
    const formY = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(400);
    check(await page.locator('#quote-details').evaluate(el => el.scrollTop > 0), 'Textarea retains its own native scroll');
    check(Math.abs(await page.evaluate(() => scrollY) - formY) < 2, 'Scrolling inside a field does not move the page');
    await page.locator('#nursery-quote button[type="submit"]').click();
    await page.locator('.nursery-result[open]').waitFor();
    await page.waitForTimeout(100);
    const dialogY = await page.evaluate(() => scrollY);
    await page.locator('.nursery-message-preview').hover();
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(400);
    check(await page.locator('.nursery-message-preview').evaluate(el => el.scrollTop > 0), 'Quote preview can scroll inside the dialog');
    check(Math.abs(await page.evaluate(() => scrollY) - dialogY) < 2, 'Dialog scrolling does not move the background');
    await page.keyboard.press('Escape');
    await page.mouse.move(80, 450);
    await page.mouse.wheel(0, -200);
    await page.waitForTimeout(1000);
    check(await page.evaluate(() => scrollY) < dialogY - 100, 'Page scrolling resumes after closing the dialog');

    await page.setViewportSize({ width: 1024, height: 768 });
    await page.locator('.menu-button').click();
    await page.waitForTimeout(100);
    const menuY = await page.evaluate(() => scrollY);
    await page.mouse.move(80, 650);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(400);
    check(Math.abs(await page.evaluate(() => scrollY) - menuY) < 2, 'Open navigation locks the background');
    await page.locator('.nav-links a[href="#proyectos"]').click();
    await page.waitForTimeout(1300);
    check(Math.abs(await page.locator('#proyectos').evaluate(el => el.getBoundingClientRect().top) - 100) < 3, 'Closing navigation restores native anchor scrolling');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('lenis'));
    check(true, 'Live reduced-motion changes remove smooth scrolling');
    const reducedY = await page.evaluate(() => scrollY);
    await page.mouse.move(80, 650);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);
    check(await page.evaluate(() => scrollY) > reducedY + 100, 'Native scrolling remains available with reduced motion');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
    check(true, 'Smooth scrolling resumes after a live preference change');

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    mobile.on('pageerror', error => report.errors.push(error.message));
    await mobile.goto(`${base}/demo/vivero/?lang=es`);
    await mobile.waitForTimeout(700);
    const touch = await mobile.context().newCDPSession(mobile);
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 700 }] });
    for (const y of [640,580,520,460,400,340,280]) {
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
        await mobile.waitForTimeout(30);
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobile.waitForTimeout(900);
    check(await mobile.evaluate(() => scrollY > 250), 'Touch gestures keep native scrolling on mobile');
    await mobile.locator('.menu-button').click();
    await mobile.locator('.nav-links a[href="#visitanos"]').click();
    await mobile.waitForTimeout(1500);
    check(await mobile.evaluate(() => document.querySelector('#visitanos h2').getBoundingClientRect().top >= document.querySelector('.nav').getBoundingClientRect().bottom), 'Mobile location heading remains clear of navigation');
    assert.deepEqual(report.errors, []);
    console.log(`Vivero scroll: ${report.checks.length} input, anchor, dialog, preference and mobile checks passed.`);
} finally {
    await mkdir('qa-vivero', { recursive: true });
    await writeFile('qa-vivero/scroll-report.json', JSON.stringify(report, null, 2));
    await browser.close();
}

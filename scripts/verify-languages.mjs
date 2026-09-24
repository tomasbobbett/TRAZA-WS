// Browser acceptance checks. Install Playwright or expose it through NODE_PATH.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DEMO_PAGES } from './demo-routes.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4183';
const output = join(process.cwd(), 'qa-languages');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const results = [], errors = [], network = [];
const widths = [1440, 1280, 1121, 1120, 1024, 390, 320];
try {
    for (const demo of DEMO_PAGES) {
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(`${demo.route}: ${error.message}`));
        page.on('requestfailed', request => { if (!request.url().includes('google.com/maps')) network.push({ url: request.url(), error: request.failure()?.errorText }); });
        await page.goto(base + demo.route + '?lang=es', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.DemoI18n);
        await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 8000))]));
        for (const lang of ['es', 'en', 'pt']) {
            await page.locator('.language-trigger').click();
            await page.locator(`.language-switcher button[data-language="${lang}"]`).click();
            for (const width of widths) {
                await page.setViewportSize({ width, height: width > 600 ? 1000 : 844 });
                await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
                await page.waitForTimeout(150);
                // Let the existing navigation fade finish when crossing its breakpoint.
                await page.waitForFunction(() => getComputedStyle(document.querySelector('.menu-button, .nav__toggle')).display === 'none'
                    || getComputedStyle(document.querySelector('.nav-links, .nav__menu')).visibility === 'hidden');
                await page.locator('.nav').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => {}))));
                const layout = await page.evaluate(() => {
                    const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, right: r.right, y: r.y, bottom: r.bottom, width: r.width }; };
                    const visible = element => getComputedStyle(element).visibility !== 'hidden' && element.getBoundingClientRect().width > 0;
                    const inCarousel = element => { for(let parent = element.parentElement; parent; parent = parent.parentElement) { if (['auto','scroll'].includes(getComputedStyle(parent).overflowX) && parent.scrollWidth > parent.clientWidth) return true; } return false; };
                    const nav = [...document.querySelectorAll('.nav > .brand, .nav > .nav-links, .nav > .nav__menu, .nav-actions > *')].filter(visible);
                    const navRect = rect(document.querySelector('.nav'));
                    const navOutside = nav.filter(el => { const r = rect(el); return r.x < navRect.x || r.right > navRect.right || r.y < navRect.y || r.bottom > navRect.bottom; }).map(el => el.className);
                    const overlap = nav.flatMap((a, i) => nav.slice(i + 1).filter(b => { const x = rect(a), y = rect(b); return x.x < y.right - 1 && x.right > y.x + 1 && x.y < y.bottom - 1 && x.bottom > y.y + 1; }).map(b => `${a.className}/${b.className}`));
                    const escaped = [...document.querySelectorAll('h1,h2,h3,p,summary,.button,.language-switcher')].filter(visible).filter(el => !el.closest('.gallery[aria-hidden="true"]') && !inCarousel(el)).filter(el => { const r = rect(el); return r.x < -2 || r.right > innerWidth + 2; }).map(el => `${el.tagName}: ${el.textContent.trim().slice(0,65)}`);
                    const clippedText = [...document.querySelectorAll('h1,h2,h3,.button')].filter(visible).filter(el => !el.closest('.gallery[aria-hidden="true"]') && !inCarousel(el)).filter(el => { const range = document.createRange(); range.selectNodeContents(el); const r = range.getBoundingClientRect(); return r.left < -3 || r.right > innerWidth + 3; }).map(el => el.textContent.trim().slice(0,65));
                    const copy = JSON.parse(document.getElementById('demo-translations').textContent);
                    const untranslated = [];
                    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                    while (walker.nextNode()) { const n = walker.currentNode; if(n.parentElement.closest('script,style,noscript,.language-switcher'))continue; const s = n.nodeValue.replace(/\s+/g,' ').trim(); if(document.documentElement.lang !== 'es-AR' && copy[s] && !copy[s].includes(s))untranslated.push(s); }
                    return { lang: document.documentElement.lang, overflow: document.documentElement.scrollWidth - innerWidth, overlap, navOutside, escaped, clippedText, untranslated, title: document.title, heading: document.querySelector('h1').innerText };
                });
                results.push({ route: demo.route, lang, width, ...layout });
                if ((width === 1440 || width === 390) && process.env.SCREENSHOTS !== '0') {
                    await page.waitForTimeout(650);
                    await page.screenshot({ path: join(output, `${demo.route.split('/').filter(Boolean).slice(1).join('-')}-${lang}-${width}.png`) });
                }
                const navHeight = await page.locator('.nav').evaluate(el => el.getBoundingClientRect().height);
                await page.locator('.language-trigger').click();
                const dropdown = await page.locator('.language-dropdown').evaluate(el => {
                    const r = el.getBoundingClientRect(), trigger = document.querySelector('.language-trigger').getBoundingClientRect();
                    return { visible: !el.hidden, inside: r.left >= 0 && r.right <= innerWidth, below: r.top >= trigger.bottom, navHeight: document.querySelector('.nav').getBoundingClientRect().height };
                });
                if (!dropdown.visible || !dropdown.inside || !dropdown.below || dropdown.navHeight !== navHeight) {
                    const error = `${demo.route} ${lang} ${width}: dropdown placement or navbar shift ${JSON.stringify({ beforeHeight: navHeight, ...dropdown })}`;
                    errors.push(error);
                    console.error(error);
                }
                if (lang === 'en' && [1440, 390].includes(width) && process.env.SCREENSHOTS !== '0') {
                    await page.screenshot({ path: join(output, `${demo.route.split('/').filter(Boolean).slice(1).join('-')}-dropdown-${width}.png`) });
                }
                await page.locator('.language-trigger').click();
            }
            const menu = page.locator('.menu-button, .nav__toggle');
            await menu.click();
            if (await menu.getAttribute('aria-expanded') !== 'true') errors.push(`${demo.route} ${lang}: menu did not open`);
            const menuFits = await page.locator('.nav-links, .nav__menu').evaluate(el => {
                const r = el.getBoundingClientRect(), nav = document.querySelector('.nav').getBoundingClientRect();
                return r.left >= 0 && r.right <= innerWidth && r.width >= nav.width - 4;
            });
            if (!menuFits) errors.push(`${demo.route} ${lang}: mobile navigation must span the navbar`);
            await page.keyboard.press('Escape');
            if (await menu.getAttribute('aria-expanded') !== 'false') errors.push(`${demo.route} ${lang}: menu did not close`);
            if (await page.locator('.motion-control, .motion-toggle').count()) errors.push(`${demo.route} ${lang}: unexpected pause control`);
            const wa = await page.locator('a[href*="wa.me"]').first().getAttribute('href');
            if (!new URL(wa).searchParams.get('text').startsWith({ es: 'Hola', en: 'Hi', pt: 'Olá' }[lang])) errors.push(`${demo.route} ${lang}: WhatsApp language`);
        }
        console.log(`Checked ${demo.route}: 3 languages × ${widths.length} widths`);
        await page.close();
    }
    const issues = results.filter(r => r.overflow > 0 || r.overlap.length || r.navOutside.length || r.escaped.length || r.clippedText.length || r.untranslated.length);
    const report = { checks: results.length, errors, network: [...new Map(network.map(n => [n.url, n])).values()], issues, results };
    await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ checks: report.checks, errors, issues, networkFailures: report.network.length }, null, 2));
    if (errors.length || issues.length) process.exitCode = 1;
} finally { await browser.close(); }

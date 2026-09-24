/* Local, curated translations. No external service or page reload required. */
(() => {
    'use strict';
    const payload = document.getElementById('demo-translations');
    if (!payload) return;
    const dictionary = JSON.parse(payload.textContent);
    const supported = ['es', 'en', 'pt'];
    const locales = { es: 'es-AR', en: 'en', pt: 'pt-BR' };
    const names = { es: 'Español', en: 'English', pt: 'Português' };
    const normalize = value => value.replace(/\s+/g, ' ').trim();
    let saved;
    try { saved = localStorage.getItem('traza-language'); } catch { /* Optional storage. */ }
    const requested = new URL(location.href).searchParams.get('lang');
    let language = supported.includes(requested) ? requested : supported.includes(saved) ? saved : 'es';
    const t = (source, values = {}) => {
        const translated = language === 'es' ? source : dictionary[source]?.[language === 'en' ? 0 : 1] ?? source;
        return translated.replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values, key) ? String(values[key]) : match);
    };

    // Keep node references so switching languages preserves focus, form values,
    // gallery/FAQ state, event handlers and the existing animation lifecycle.
    const bindings = [];
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('script, style, noscript, .motion-toggle, .motion-control')) continue;
        const source = normalize(node.nodeValue);
        if (Object.hasOwn(dictionary, source)) {
            const before = node.nodeValue.match(/^\s*/)[0], after = node.nodeValue.match(/\s*$/)[0];
            bindings.push(() => { node.nodeValue = before + t(source) + after; });
        }
    }
    for (const element of document.querySelectorAll('[alt], [title], [placeholder], [aria-label], meta[content]')) {
        if (element.matches('.menu-button, .nav__toggle, .motion-toggle, .motion-control')) continue;
        for (const attribute of ['alt', 'title', 'placeholder', 'aria-label', ...(element.tagName === 'META' ? ['content'] : [])]) {
            const source = element.getAttribute(attribute);
            if (source && Object.hasOwn(dictionary, normalize(source))) bindings.push(() => element.setAttribute(attribute, t(normalize(source))));
        }
    }
    const links = [...document.querySelectorAll('a[href]')].map(element => ({ element, href: element.getAttribute('href') }));
    const map = document.querySelector('iframe[src*="google.com/maps"]');
    const mapSource = map?.getAttribute('src');
    const selector = document.createElement('div');
    selector.className = 'language-switcher';
    selector.setAttribute('role', 'group');
    selector.innerHTML = supported.map(lang => `<button type="button" lang="${locales[lang]}" data-language="${lang}" aria-label="${names[lang]}" title="${names[lang]}" aria-pressed="false">${lang.toUpperCase()}</button>`).join('');
    const nav = document.querySelector('.nav');
    nav.classList.add('nav--languages');
    nav.insertBefore(selector, nav.querySelector('.nav-cta, .nav__cta'));
    const status = document.createElement('span');
    status.className = 'language-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    selector.appendChild(status);

    function apply(announce = false) {
        document.documentElement.lang = locales[language];
        document.documentElement.dataset.language = language;
        bindings.forEach(update => update());
        selector.setAttribute('aria-label', t('Elegir idioma'));
        selector.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
        for (const toggle of document.querySelectorAll('.menu-button, .nav__toggle')) {
            toggle.setAttribute('aria-label', t(toggle.getAttribute('aria-expanded') === 'true' ? 'Cerrar menú' : 'Abrir menú'));
        }
        for (const { element, href } of links) {
            const url = new URL(href, location.href);
            if (url.hostname === 'wa.me' && url.searchParams.has('text')) {
                url.searchParams.set('text', t(url.searchParams.get('text')));
                element.href = url.href;
            } else if (!href.startsWith('#') && url.origin === location.origin && /\/(?:demo\/|1_basico\/|nichos\/)/.test(url.pathname)) {
                url.searchParams.set('lang', language);
                element.href = url.href;
            }
        }
        document.querySelector('meta[property="og:locale"]')?.setAttribute('content', { es: 'es_AR', en: 'en_US', pt: 'pt_BR' }[language]);
        if (map) {
            const url = new URL(mapSource, location.href);
            url.searchParams.set('hl', locales[language]);
            const pb = url.searchParams.get('pb');
            if (pb) url.searchParams.set('pb', pb.replaceAll('!1ses-419', `!1s${locales[language]}`));
            if (map.src !== url.href) map.src = url.href;
        }
        try { localStorage.setItem('traza-language', language); } catch { /* Links still preserve the language. */ }
        if (announce || requested) {
            const url = new URL(location.href);
            url.searchParams.set('lang', language);
            try { history.replaceState(history.state, '', url); } catch { /* Direct file previews. */ }
        }
        if (announce) status.textContent = t('Idioma: Español');
        document.dispatchEvent(new CustomEvent('demo:languagechange', { detail: { language } }));
        window.dispatchEvent(new Event('resize'));
    }
    const setLanguage = lang => { if (supported.includes(lang)) { language = lang; apply(true); } };
    window.DemoI18n = { t, setLanguage, get language() { return language; } };
    selector.addEventListener('click', event => {
        const button = event.target.closest('button[data-language]');
        if (button) setLanguage(button.dataset.language);
    });
    apply();
})();

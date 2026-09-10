/* Shared motion for TRAZA and every demo. Native scrolling stays in control. */
(() => {
    'use strict';
    const root = document.documentElement;
    let saved;
    try { saved = sessionStorage.getItem('traza-motion'); } catch { /* Motion works without storage. */ }
    root.dataset.motion = saved === 'reduced' ? 'reduced' : 'full';
    root.classList.add('motion-ready');
    const state = { get matches() { return root.dataset.motion === 'reduced'; } };
    window.TrazaMotion = state;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const mobile = matchMedia('(max-width: 760px)');
    const ease = 'cubic-bezier(.16,1,.3,1)';
    const entryAnimations = new Set();

    // Animate entry separately from transform so hover, tilt and layout offsets
    // never fight over the same property. Release the animation after it finishes.
    document.querySelectorAll('.hero-metrics > div, .secondary-main > .eyebrow, .secondary-main > .display, .secondary-intro, .info-panel, .secondary-photo, .faq-list details, .contact-form, .privacy-page > *').forEach((element, index) => {
        element.classList.add('reveal');
        element.dataset.delay ||= String((index % 3) * 90);
    });
    const reveals = [...document.querySelectorAll('.reveal')];
    for (const element of reveals) {
        element.classList.add('is-visible', 'visible', 'reveal-complete');
        element.dataset.reveal = 'pending';
    }
    const reveal = element => {
        if (element.dataset.reveal === 'done') return;
        const reduced = state.matches;
        const delay = reduced ? 0 : Math.min(Number(element.dataset.delay || parseFloat(element.style.getPropertyValue('--delay')) || 0), 280);
        const distance = reduced ? 0 : mobile.matches ? 24 : element.matches('h1,h2') ? 52 : 34;
        element.dataset.reveal = 'entering';
        const animation = element.animate([
            { opacity: 0, translate: `0 ${distance}px` },
            { opacity: 1, translate: '0 0' }
        ], { duration: reduced ? 180 : 900, delay, easing: ease, fill: 'both' });
        entryAnimations.add(animation);
        animation.finished.then(() => {
            element.dataset.reveal = 'done';
            animation.cancel();
            entryAnimations.delete(animation);
        }).catch(() => { element.dataset.reveal = 'done'; entryAnimations.delete(animation); });
    };
    if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) if (entry.isIntersecting) {
                reveal(entry.target);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
        reveals.forEach(element => observer.observe(element));
    } else reveals.forEach(element => { element.dataset.reveal = 'done'; });

    // Preserve the original animated section rules and number counters.
    const sections = document.querySelectorAll('.section');
    if ('IntersectionObserver' in window) {
        const sectionsObserver = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('is-in-view'); sectionsObserver.unobserve(entry.target); }
        }), { threshold: 0.06 });
        sections.forEach(section => sectionsObserver.observe(section));
        const counters = new IntersectionObserver(entries => entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            counters.unobserve(entry.target);
            const element = entry.target, finish = Number(element.dataset.count), start = performance.now();
            if (state.matches) { element.textContent = String(finish); return; }
            const tick = now => {
                const progress = Math.min((now - start) / 1100, 1);
                element.textContent = String(Math.round(finish * (1 - (1 - progress) ** 4)));
                if (progress < 1 && !state.matches) requestAnimationFrame(tick);
                else element.textContent = String(finish);
            };
            element.textContent = '0';
            requestAnimationFrame(tick);
        }), { threshold: 0.5 });
        document.querySelectorAll('[data-count]').forEach(element => counters.observe(element));
    } else sections.forEach(section => section.classList.add('is-in-view'));

    const media = [...document.querySelectorAll('.hero-media img, .hero__media img, .story-media img, .final-cta__media img, .secondary-photo')].map(element => {
        element.classList.add('motion-parallax');
        return { element, parent: element.parentElement, top: 0, height: 0, current: 0, visible: false };
    });
    let frame = 0, viewport = innerHeight;
    const pointerItems = [];
    const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
    function measure() {
        viewport = innerHeight;
        for (const item of media) {
            const rect = item.parent.getBoundingClientRect();
            item.top = rect.top + scrollY;
            item.height = rect.height;
        }
        schedule();
    }
    function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(update); }
    function update() {
        frame = 0;
        let settling = false;
        const y = scrollY, strength = mobile.matches ? 18 : 46;
        for (const item of media) {
            if (!item.visible) continue;
            const target = state.matches ? 0 : clamp((y + viewport / 2 - item.top - item.height / 2) / (viewport + item.height), -.5, .5) * strength * 2;
            item.current += (target - item.current) * .16;
            if (Math.abs(target - item.current) < .08) item.current = target;
            else settling = true;
            item.element.style.setProperty('--motion-y', `${item.current.toFixed(2)}px`);
        }
        for (const item of pointerItems) {
            if (!item.active && Math.abs(item.x) + Math.abs(item.y) < .01) continue;
            item.x += (item.tx - item.x) * .18;
            item.y += (item.ty - item.y) * .18;
            const settled = Math.abs(item.tx - item.x) + Math.abs(item.ty - item.y) < .015;
            if (!settled) settling = true;
            if (item.kind === 'tilt') item.element.style.rotate = `${-item.y.toFixed(3)} ${item.x.toFixed(3)} 0 ${Math.hypot(item.x, item.y).toFixed(3)}deg`;
            else item.element.style.translate = `${item.x.toFixed(2)}px ${item.y.toFixed(2)}px`;
            if (settled && !item.active) { item.x = item.y = 0; item.element.style.removeProperty(item.kind === 'tilt' ? 'rotate' : 'translate'); }
        }
        if (settling) schedule();
    }
    if ('IntersectionObserver' in window) {
        const visibility = new IntersectionObserver(entries => entries.forEach(entry => {
            const item = media.find(item => item.element === entry.target);
            if (item) { item.visible = entry.isIntersecting; schedule(); }
        }), { rootMargin: '100px 0px' });
        media.forEach(item => visibility.observe(item.element));
    } else media.forEach(item => { item.visible = true; });

    function setupPointer(selector, kind, amount) {
        document.querySelectorAll(selector).forEach(element => {
            const item = { element, kind, x:0, y:0, tx:0, ty:0, active:false, rect:null };
            pointerItems.push(item);
            element.addEventListener('pointerenter', () => { item.rect = element.getBoundingClientRect(); });
            element.addEventListener('pointermove', event => {
                if (state.matches || !finePointer.matches || event.pointerType === 'touch' || element.dataset.reveal === 'pending') return;
                const rect = item.rect;
                if (!rect) return;
                item.active = true;
                item.tx = clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5) * amount;
                item.ty = clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5) * amount;
                schedule();
            }, { passive:true });
            const leave = () => { item.active = false; item.tx = item.ty = 0; schedule(); };
            element.addEventListener('pointerleave', leave);
            element.addEventListener('pointercancel', leave);
        });
    }
    setupPointer('.tilt, .niche-demo, .program-card, .image-card', 'tilt', 6);
    setupPointer('.button, .nav__cta, .nav-cta', 'magnetic', 9);

    const ticker = document.querySelector('.marquee, .ticker');
    let toggle = document.querySelector('.motion-toggle');
    if (!toggle && ticker) { toggle = document.createElement('button'); toggle.type = 'button'; ticker.appendChild(toggle); }
    if (toggle) {
        toggle.classList.add('motion-control');
        const label = () => {
            toggle.textContent = state.matches ? 'Activar movimiento' : 'Pausar movimiento';
            toggle.setAttribute('aria-label', state.matches ? 'Activar animaciones' : 'Pausar animaciones');
            toggle.setAttribute('aria-pressed', String(state.matches));
        };
        label();
        toggle.addEventListener('click', () => {
            root.dataset.motion = state.matches ? 'full' : 'reduced';
            document.body.classList.remove('motion-paused');
            try { sessionStorage.setItem('traza-motion', root.dataset.motion); } catch { /* Optional preference. */ }
            if (state.matches) {
                entryAnimations.forEach(animation => animation.finish());
                pointerItems.forEach(item => { item.active = false; item.tx = item.ty = 0; });
            }
            label(); schedule();
        });
    }
    addEventListener('scroll', schedule, { passive:true });
    addEventListener('resize', measure, { passive:true });
    addEventListener('load', measure, { once:true });
    document.fonts?.ready.then(measure);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
        else schedule();
    });
    measure();
})();

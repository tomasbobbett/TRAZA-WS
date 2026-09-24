const nav = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const progress = document.querySelector('.progress i');
const floatingContact = document.querySelector('.floating-contact');
const translate = source => window.DemoI18n?.t(source) ?? source;
let scrollScheduled = false;

function updateScroll() {
    const y = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    nav?.classList.toggle('scrolled', y > 20);
    floatingContact?.classList.toggle('is-visible', y > 160);
    progress?.style.setProperty('transform', `scaleX(${Math.min(y / scrollable, 1)})`);
    scrollScheduled = false;
}

function requestScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(updateScroll);
}

menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', translate(open ? 'Cerrar menú' : 'Abrir menú'));
    navLinks?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
});

navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', translate('Abrir menú'));
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
}));

addEventListener('scroll', requestScroll, { passive: true });
addEventListener('resize', requestScroll);
updateScroll();

function closeDemoMenu(restoreFocus = false) {
    const wasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', translate('Abrir menú'));
    navLinks?.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (restoreFocus && wasOpen) menuButton?.focus();
}
addEventListener('keydown', event => { if (event.key === 'Escape') closeDemoMenu(true); });
addEventListener('resize', () => { if (innerWidth > 1120) closeDemoMenu(); });
document.addEventListener('click', event => { if (!nav?.contains(event.target)) closeDemoMenu(); });

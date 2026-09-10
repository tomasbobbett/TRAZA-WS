const TRAZA_CONFIG = {
    whatsapp: '5493446210306'
};

const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const scrollProgress = document.querySelector('.scroll-progress span');
const floatingContact = document.querySelector('.floating-contact');
const clientPage = document.body.classList.contains('client-page');
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');
const reducedMotion = window.TrazaMotion || { matches: false };

let scrollTicking = false;


function updateOnScroll() {
    const scrollY = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    nav?.classList.toggle('is-scrolled', scrollY > 24);
    floatingContact?.classList.toggle('is-visible', scrollY > 160);
    scrollProgress?.style.setProperty('transform', `scaleX(${Math.min(scrollY / scrollable, 1)})`);
    if (scrollY < window.innerHeight * 0.45) {
        document.querySelectorAll('.nav__menu a.is-active').forEach((link) => link.classList.remove('is-active'));
    }
    if (clientPage && hero && !reducedMotion.matches) {
        const progress = Math.min(scrollY / Math.max(hero.offsetHeight, 1), 1);
        hero.style.setProperty('--hero-content-shift', `${progress * -34}px`);
        heroVisual?.style.setProperty('--hero-visual-shift', `${progress * 46}px`);
    }

    scrollTicking = false;
}

function requestScrollUpdate() {
    if (scrollTicking) return;
    window.requestAnimationFrame(updateOnScroll);
    scrollTicking = true;
}

function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
}

function toggleMenu() {
    if (!navToggle || !navMenu) return;
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
}

function setupActiveNavigation() {
    const links = [...document.querySelectorAll('.nav__menu a[href^="#"]')];
    if (!links.length || !('IntersectionObserver' in window)) return;

    const targets = links.map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter((item) => item.section);
    const activeObserver = new IntersectionObserver((entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);
        if (!activeEntry) return;
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${activeEntry.target.id}`));
    }, { threshold: 0, rootMargin: '-38% 0px -52% 0px' });
    targets.forEach(({ section }) => activeObserver.observe(section));
}

function setupWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach((link) => {
        const message = encodeURIComponent(link.dataset.message || 'Hola, quiero consultar por un proyecto web.');
        link.href = `https://wa.me/${TRAZA_CONFIG.whatsapp}?text=${message}`;
    });
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', () => { requestScrollUpdate(); if (window.innerWidth > 1120) closeMenu(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
navToggle?.addEventListener('click', toggleMenu);
navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

updateOnScroll();

setupActiveNavigation();


setupWhatsAppLinks();

document.addEventListener('click', event => { if (!nav?.contains(event.target)) closeMenu(); });

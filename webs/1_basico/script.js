const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const scrollProgress = document.querySelector('.scroll-progress span');
const gallery = document.querySelector('#galeriaModal');
const openGalleryButton = document.querySelector('#openGaleria');
const closeGalleryButton = document.querySelector('#closeGaleria');
const whatsappButton = document.querySelector('.floating-contact');

let lastFocusedElement = null;
let scrollTicking = false;

function updatePageOnScroll() {
    const scrollY = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(scrollY / scrollable, 1);

    nav?.classList.toggle('is-scrolled', scrollY > 24);
    whatsappButton?.classList.toggle('is-visible', scrollY > 160);
    scrollProgress?.style.setProperty('transform', `scaleX(${progress})`);

    scrollTicking = false;
}

function requestScrollUpdate() {
    if (scrollTicking) return;
    window.requestAnimationFrame(updatePageOnScroll);
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
    const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(willOpen));
    navToggle.setAttribute('aria-label', willOpen ? 'Cerrar menú' : 'Abrir menú');
    navMenu.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
}

function openGallery() {
    if (!gallery) return;
    lastFocusedElement = document.activeElement;
    gallery.classList.add('is-open');
    gallery.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');
    document.querySelector('main')?.setAttribute('inert', '');
    nav?.setAttribute('inert', '');
    document.querySelector('.footer')?.setAttribute('inert', '');
    whatsappButton?.setAttribute('inert', '');
    closeGalleryButton?.focus();
}

function closeGallery() {
    if (!gallery) return;
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
    document.querySelectorAll('[inert]').forEach(element => element.removeAttribute('inert'));
    lastFocusedElement?.focus();
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', () => {
    requestScrollUpdate();
    if (window.innerWidth > 1120) closeMenu();
});
updatePageOnScroll();

navToggle?.addEventListener('click', toggleMenu);
navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

openGalleryButton?.addEventListener('click', openGallery);
closeGalleryButton?.addEventListener('click', closeGallery);
gallery?.addEventListener('click', (event) => {
    if (event.target === gallery) closeGallery();
});

window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (gallery?.classList.contains('is-open')) closeGallery();
    else closeMenu();
});

gallery?.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !gallery.classList.contains('is-open')) return;
    const items = [...gallery.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

document.addEventListener('click', event => { if (!nav?.contains(event.target)) closeMenu(); });

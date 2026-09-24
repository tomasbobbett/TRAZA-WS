const contactForm = document.querySelector('#gym-contact');
const contactTranslate = (source, values = {}) => window.DemoI18n?.t(source, values) ?? source.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
function contactStatus(source) {
    const status = document.querySelector('#contact-status');
    status.dataset.message = source;
    status.textContent = contactTranslate(source);
}
function validateContactFields() {
    for (const [id, source] of [['contact-name', 'Completá tu nombre.'], ['contact-message', 'Escribí tu consulta.']]) {
        const field = document.getElementById(id);
        if (field) field.setCustomValidity(field.value.trim() ? '' : contactTranslate(source));
    }
}
contactForm?.addEventListener('input', validateContactFields);
validateContactFields();
document.addEventListener('demo:languagechange', () => {
    validateContactFields();
    const source = document.querySelector('#contact-status')?.dataset.message;
    if (source) contactStatus(source);
});
contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    const business = String(data.get('business') || '').trim();
    if (!name || !message) {
        contactStatus('Completá tu nombre y consulta antes de continuar.');
        return;
    }
    const text = contactTranslate('Hola, soy {name}{business}. Vi la demo PULSO de TRAZA. {message}', {
        name, business: business ? ` ${contactTranslate('de {business}', { business })}` : '', message
    });
    const url = new URL(contactForm.action);
    url.searchParams.set('text', text);
    contactStatus('Tu consulta está preparada. Confirmá el envío en WhatsApp.');
    window.location.assign(url.href);
});

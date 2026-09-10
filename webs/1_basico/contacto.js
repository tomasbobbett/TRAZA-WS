const contactForm = document.querySelector('#gym-contact');
contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    const business = String(data.get('business') || '').trim();
    const status = document.querySelector('#contact-status');
    if (!name || !message) {
        status.textContent = 'Completá tu nombre y consulta antes de continuar.';
        return;
    }
    const text = `Hola, soy ${name}${business ? ` de ${business}` : ''}. Vi la demo PULSO de TRAZA. ${message}`;
    const url = new URL(contactForm.action);
    url.searchParams.set('text', text);
    status.textContent = 'Tu consulta está preparada. Confirmá el envío en WhatsApp.';
    window.location.assign(url.href);
});

(() => {
    const form = document.getElementById('nursery-quote');
    if (!form) return;
    const fields = form.querySelector('.nursery-form-fields');
    const result = form.querySelector('.nursery-result');
    const status = form.querySelector('.nursery-form-status');
    const preview = form.querySelector('.nursery-message-preview');
    const link = form.querySelector('[data-quote-link]');
    const t = source => window.DemoI18n?.t(source) ?? source;
    fields.hidden = false;
    const clearResult = () => { result.hidden = true; };
    form.addEventListener('input', clearResult);
    form.addEventListener('change', clearResult);

    document.querySelectorAll('[data-buyer], [data-species]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (trigger.dataset.buyer) form.elements.buyer.value = trigger.dataset.buyer;
            if (trigger.dataset.species) {
                [...form.querySelectorAll('[name="species"]')].find(input => input.value === trigger.dataset.species).checked = true;
            }
            clearResult();
            // Keep native anchor navigation and move keyboard focus into the form.
            form.elements.contactName.focus({ preventScroll: true });
        });
    });

    function prepareMessage() {
        const data = new FormData(form);
        const value = key => String(data.get(key) || '').trim();
        const pending = t('A definir');
        const lines = [
            t('Hola, quisiera una cotización de plantas frutales injertadas de Vivero la Loma.'),
            '',
            `${t('Nombre')}: ${value('contactName')}`,
            `${t('Tipo de comprador')}: ${t(value('buyer'))}`,
            `${t('Organización o proyecto')}: ${value('organization') || pending}`,
            `${t('Destino de plantación')}: ${value('destination')}`,
            `${t('Frutales de interés')}: ${data.getAll('species').map(t).join(', ') || t('Necesito orientación')}`,
            `${t('Cantidad aproximada')}: ${value('quantity') || pending}`,
            `${t('Fecha estimada')}: ${value('date') || pending}`,
        ];
        if (value('details')) lines.push(`${t('Detalles del proyecto')}: ${value('details')}`);
        lines.push('', t('Por favor, confirmar variedades, disponibilidad, precios y condiciones de retiro o entrega.'));
        const message = lines.join('\n');
        const url = new URL(form.action);
        url.searchParams.set('text', message);
        link.href = url.href;
        preview.textContent = message;
        status.textContent = t('Tu consulta está lista. Revisala y continuá a WhatsApp para enviarla.');
        result.hidden = false;
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        // Reject whitespace-only contact details as well as native invalid fields.
        for (const name of ['contactName', 'destination']) {
            const input = form.elements[name];
            input.value = input.value.trim();
        }
        if (!form.reportValidity()) return;
        prepareMessage();
        link.focus({ preventScroll: true });
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    });
    // The shared language switcher restores original links before this event.
    document.addEventListener('demo:languagechange', () => {
        if (!result.hidden) prepareMessage();
    });
})();

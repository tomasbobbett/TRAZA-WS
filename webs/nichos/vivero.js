(() => {
    const compact = matchMedia('(max-width: 1120px), (max-height: 740px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const t = (source, values = {}) => (window.DemoI18n?.t(source, values) ?? source)
        .replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);

    // Horizontal panels preserve native touch scrolling and keyboard access.
    document.querySelectorAll('[data-pager]').forEach(pager => {
        const track = document.getElementById(pager.dataset.pager);
        const previous = pager.querySelector('[data-page-prev]');
        const next = pager.querySelector('[data-page-next]');
        const position = pager.querySelector('[data-page-position]');
        const cards = () => [...track.children].filter(card => !card.hidden);
        const offset = card => card.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
        const current = () => {
            const visible = cards();
            return visible.reduce((best, card, index) => Math.abs(offset(card) - track.scrollLeft) < Math.abs(offset(visible[best]) - track.scrollLeft) ? index : best, 0);
        };
        function update() {
            const visible = cards(), index = current();
            position.textContent = `${index + 1} / ${visible.length}`;
            previous.disabled = index === 0;
            next.disabled = index >= visible.length - 1;
            track.tabIndex = compact.matches ? 0 : -1;
        }
        function move(direction) {
            const visible = cards();
            const index = Math.max(0, Math.min(visible.length - 1, current() + direction));
            track.scrollTo({ left: offset(visible[index]), behavior: reduced.matches ? 'instant' : 'smooth' });
        }
        previous.addEventListener('click', () => move(-1));
        next.addEventListener('click', () => move(1));
        track.addEventListener('keydown', event => {
            if (event.target !== track || !compact.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
        });
        track.addEventListener('scroll', update, { passive: true });
        new ResizeObserver(update).observe(track);
        new MutationObserver(() => { track.scrollTo({ left: 0, behavior: 'instant' }); update(); })
            .observe(track, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
        pager.hidden = false;
        update();
    });

    // One complete answer at a time on short displays; normal accordions on desktop.
    const faq = document.getElementById('preguntas');
    const picker = faq.querySelector('.nursery-faq-picker');
    const question = document.getElementById('nursery-question');
    const answers = [...faq.querySelectorAll('details')];
    function updateFAQ() {
        faq.toggleAttribute('data-compact', compact.matches);
        answers.forEach((answer, index) => {
            const active = index === Number(question.value);
            answer.toggleAttribute('data-active', active);
            answer.open = active && compact.matches;
        });
    }
    picker.hidden = false;
    question.addEventListener('change', updateFAQ);
    compact.addEventListener('change', updateFAQ);
    answers.forEach(answer => answer.addEventListener('toggle', () => {
        if (!compact.matches && answer.open) answers.forEach(other => { if (other !== answer) other.open = false; });
    }));
    updateFAQ();

    const form = document.getElementById('nursery-quote');
    const fields = form.querySelector('.nursery-form-fields');
    const steps = [...form.querySelectorAll('[data-quote-step]')];
    const next = form.querySelector('[data-form-next]');
    const back = form.querySelector('[data-form-back]');
    const submit = form.querySelector('[data-form-submit]');
    const result = form.querySelector('.nursery-result');
    const status = form.querySelector('.nursery-form-status');
    const preview = form.querySelector('.nursery-message-preview');
    const link = form.querySelector('[data-quote-link]');
    let step = 0;
    form.noValidate = true;
    fields.hidden = false;
    function showStep(index, focus = false) {
        step = index;
        steps.forEach((panel, current) => { panel.hidden = current !== step; });
        back.hidden = step === 0;
        next.hidden = step === steps.length - 1;
        submit.hidden = step !== steps.length - 1;
        form.querySelector('[data-form-progress]').textContent = t('Paso {step} de 4', { step: step + 1 });
        form.querySelector('[data-form-step-title]').textContent = t(['Tu proyecto', 'Tus frutales', 'Tu pedido', 'Últimos detalles'][step]);
        fields.hidden = false;
        result.hidden = true;
        if (focus) steps[step].querySelector('input,select,textarea')?.focus({ preventScroll: true });
    }
    function validateStep(index) {
        for (const input of steps[index].querySelectorAll('input,select,textarea')) {
            if (input.required && input.type !== 'checkbox') input.value = input.value.trim();
            if (!input.checkValidity()) {
                showStep(index);
                input.reportValidity();
                return false;
            }
        }
        return true;
    }
    next.addEventListener('click', () => { if (validateStep(step)) showStep(step + 1, true); });
    back.addEventListener('click', () => showStep(step - 1, true));
    form.querySelector('[data-form-edit]').addEventListener('click', () => showStep(0, true));
    form.addEventListener('input', () => { result.hidden = true; });
    form.addEventListener('change', () => { result.hidden = true; });
    document.querySelectorAll('[data-buyer], [data-species]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (trigger.dataset.buyer) form.elements.buyer.value = trigger.dataset.buyer;
            if (trigger.dataset.species) {
                [...form.querySelectorAll('[name="species"]')].find(input => input.value === trigger.dataset.species).checked = true;
            }
            showStep(0, true);
        });
    });
    function prepareMessage() {
        const data = new FormData(form);
        const value = key => String(data.get(key) || '').trim();
        const pending = t('A definir');
        const lines = [
            t('Hola, quisiera una cotización de plantas frutales injertadas de Vivero la Loma.'), '',
            `${t('Nombre')}: ${value('contactName')}`,
            `${t('Tipo de comprador')}: ${t(value('buyer'))}`,
            `${t('Organización o proyecto')}: ${value('organization') || pending}`,
            `${t('Destino de plantación')}: ${value('destination')}`,
            `${t('Frutales de interés')}: ${data.getAll('species').map(source => t(source)).join(', ') || t('Necesito orientación')}`,
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
        fields.hidden = true;
        result.hidden = false;
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (step < steps.length - 1) {
            if (validateStep(step)) showStep(step + 1, true);
            return;
        }
        if (!steps.every((_, index) => validateStep(index))) return;
        prepareMessage();
        link.focus({ preventScroll: true });
    });
    document.addEventListener('demo:languagechange', () => {
        if (!result.hidden) prepareMessage();
        else showStep(step);
    });
    showStep(0);
})();

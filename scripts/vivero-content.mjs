export const nursery = {
    theme: 'garden', layout: 'botanical', brand: 'Vivero la Loma',
    label: 'Frutales injertados · El Torno, Bolivia',
    description: 'Plantas frutales injertadas para productores, municipios y proyectos de ONG y cooperación. Consultá especies, cantidades y entrega con Vivero la Loma, en El Torno, Bolivia.',
    heroImage: '/assets/vivero/mango.jpg', whatsapp: '59172139484',
    location: '2J5J+7W · El Torno, Bolivia', services: [],
    catalog: [
        { name: 'Limón', category: 'citricos', label: 'Cítricos', image: 'limon', alt: 'Limón en el árbol, fotografía de referencia', description: 'Un punto de partida para tu proyecto citrícola. Consultá las variedades y presentaciones disponibles.' },
        { name: 'Naranja', category: 'citricos', label: 'Cítricos', image: 'naranja', alt: 'Naranjas en el árbol, fotografía de referencia', description: 'Sumá cítricos a tu propuesta productiva. Definí con el vivero la variedad y la cantidad que necesitás.' },
        { name: 'Mango', category: 'tropicales', label: 'Tropicales', image: 'mango', alt: 'Mangos en el árbol, fotografía de referencia', description: 'Una opción para evaluar en tu plantación. Consultá disponibilidad y compatibilidad con tu zona.' },
        { name: 'Palta', category: 'tropicales', label: 'Tropicales', image: 'palta', alt: 'Palta en el árbol, fotografía de referencia', description: 'Planificá tu pedido de palta o aguacate. Consultá variedad, portainjerto y condiciones de entrega.' }
    ]
};

export const nurseryMessage = 'Hola, me interesa cotizar plantas frutales injertadas de Vivero la Loma. ¿Podemos conversar sobre mi proyecto?';
export const nurseryBuyers = ['Productor/a', 'Municipio', 'ONG / fundación', 'FAO / cooperación', 'Otro proyecto'];
export const nurseryFAQs = [
    ['¿Qué especies y variedades tienen disponibles?', 'Consultanos por WhatsApp para confirmar el listado actual, las variedades, los portainjertos y el tamaño de las plantas. Las especies de esta demo son una selección de ejemplo.'],
    ['¿Puedo pedir una cotización por cantidad?', 'Sí. Indicá cuántas plantas necesitás, las especies de interés, el destino y la fecha estimada. Si todavía no definiste la cantidad, contanos el alcance de tu proyecto.'],
    ['¿Cómo consulto para una ONG, FAO o municipio?', 'Elegí tu tipo de organización en el formulario y detallá el objetivo, la cantidad de beneficiarios si corresponde y los requisitos de compra. Consultá la documentación disponible antes de confirmar el pedido.'],
    ['¿Cómo coordinamos el retiro o la entrega?', 'El vivero está en El Torno, Bolivia. Confirmá por WhatsApp el horario de visita y las alternativas de retiro o entrega para tu destino. Los plazos y costos se acuerdan al cotizar.'],
    ['¿Y si todavía no sé qué frutales elegir?', 'Contanos dónde vas a plantar, qué espacio tenés y cuál es tu objetivo. Esos datos permiten conversar sobre las opciones antes de solicitar una cotización.']
];

export function renderNursery() {
    const wa = `https://wa.me/${nursery.whatsapp}?text=${encodeURIComponent(nurseryMessage)}`;
    const map = 'https://www.google.com/maps/search/?api=1&query=2J5J%2B7W%2C%20El%20Torno%2C%20Bolivia';
    const external = 'target="_blank" rel="noopener"';
    return `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <div class="progress" aria-hidden="true"><i></i></div>
    <nav class="nav" aria-label="Navegación principal">
        <a class="brand nursery-brand" href="#inicio"><span class="nursery-mark" aria-hidden="true">✳</span><span><small>Vivero</small><b>la Loma</b></span></a>
        <button aria-controls="demo-menu" class="menu-button" type="button" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i></button>
        <div class="nav-links" id="demo-menu"><a href="#catalogo">Frutales</a><a href="#proyectos">Proyectos</a><a href="#preguntas">Preguntas</a><a href="#visitanos">Ubicación</a></div>
        <a class="nav-cta" href="#cotizar">Cotizar mi proyecto <span>↗</span></a>
    </nav>
    <main id="contenido">
        <header class="hero nursery-hero" id="inicio">
            <div class="hero-media" aria-hidden="true"><img src="${nursery.heroImage}" alt="" fetchpriority="high" width="1800" height="1200"><span></span></div>
            <div class="hero-content shell">
                <h1 class="reveal">Buenas raíces.<br><em>Nuevas cosechas.</em></h1>
                <p class="hero-copy reveal">Plantas frutales injertadas para hacer crecer tu producción y los proyectos de tu comunidad.</p>
                <p class="nursery-audience reveal">Productores · Municipios · ONG y cooperación</p>
                <div class="hero-actions reveal"><a class="button button-primary magnetic" href="#cotizar">Cotizar mi proyecto <span>↗</span></a><a class="button button-ghost" href="#catalogo">Explorar frutales <span>↓</span></a></div>
                <p class="nursery-hero-note reveal">Contanos qué querés plantar. Empecemos por una conversación.</p>
            </div>
            <div class="nursery-photo-label">De la planta al proyecto.</div>
            <div class="hero-metrics shell" aria-label="Nuestra propuesta"><div><strong>Injertados</strong><span>Especialidad del vivero</span></div><div><strong>A tu escala</strong><span>Consultas por cantidad</span></div><div><strong>El Torno</strong><span>Santa Cruz · Bolivia</span></div></div>
        </header>
        <section class="nursery-intro section" id="proyectos">
            <div class="shell"><div class="catalog-heading reveal"><div><h2 class="section-title">Tu objetivo.<br><em>Nuestro punto de partida.</em></h2></div><p class="section-copy">Una plantación productiva, un programa municipal o una iniciativa comunitaria. La propuesta empieza por entender para quién plantamos.</p></div>
            <div class="nursery-buyers">
                <a class="nursery-buyer reveal" href="#cotizar" data-buyer="Productor/a"><span class="nursery-card-index">01 —</span><h3>Productores</h3><p>Para iniciar, ampliar o diversificar tu plantación. Consultá especies y cantidades según tu zona y objetivo productivo.</p><span class="nursery-card-link">Planificar mi plantación <b>↗</b></span></a>
                <a class="nursery-buyer reveal" href="#cotizar" data-buyer="Municipio"><span class="nursery-card-index">02 —</span><h3>Municipios</h3><p>Para huertos comunitarios y programas de entrega de frutales. Contanos el destino, las etapas y los requisitos de tu compra.</p><span class="nursery-card-link">Cotizar un programa <b>↗</b></span></a>
                <a class="nursery-buyer reveal" href="#cotizar" data-buyer="ONG / fundación"><span class="nursery-card-index">03 —</span><h3>ONG y cooperación</h3><p>Para iniciativas de seguridad alimentaria y desarrollo rural de ONG, FAO y otros organismos. Conversemos sobre el alcance de tu proyecto.</p><span class="nursery-card-link">Consultar por mi organización <b>↗</b></span></a>
            </div></div>
        </section>
        <section class="plant-catalog section" id="catalogo" aria-labelledby="catalog-title"><div class="shell">
            <div class="catalog-heading reveal"><div><h2 class="section-title" id="catalog-title">El próximo fruto<br><em>empieza acá.</em></h2></div><p class="section-copy">Elegí una especie como punto de partida. Consultamos variedad, cantidad y destino para preparar tu pedido.</p></div>
            <div class="catalog-filters" role="group" aria-label="Filtrar el catálogo" hidden>${[['all','Ver todo'],['citricos','Cítricos'],['tropicales','Tropicales']].map(([key,label])=>`<button type="button" data-plant-filter="${key}" aria-pressed="${key==='all'}" aria-controls="plant-grid">${label}</button>`).join('')}</div>
            <p class="catalog-status" role="status" aria-live="polite" aria-atomic="true"><span>Especies de referencia:</span> <span data-catalog-count>4</span></p>
            <div class="plant-grid" id="plant-grid">${nursery.catalog.map(plant=>`<article class="plant-card reveal" data-plant-category="${plant.category}"><div class="plant-photo"><img src="/assets/vivero/${plant.image}.jpg" alt="${plant.alt}" width="800" height="900" loading="lazy" decoding="async"><span>${plant.label}</span></div><div class="plant-info"><h3>${plant.name}</h3><p>${plant.description}</p><p class="plant-availability">Variedades y disponibilidad a confirmar</p><a href="#cotizar" data-species="${plant.name}">Incluir en mi consulta <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div>
            <p class="nursery-catalog-note">Selección ilustrativa: las especies y fotografías son de referencia. Confirmá el catálogo real, precios y stock con el vivero.</p>
            <a class="nursery-text-link" href="#cotizar" data-species="Necesito orientación">¿No sabés cuál elegir? Contanos tu proyecto <span>↗</span></a>
        </div></section>
        <section class="nursery-process section" id="experiencia"><div class="shell nursery-process-grid">
            <div class="nursery-process-intro reveal"><h2 class="section-title">Hagamos lugar<br><em>a lo que viene.</em></h2><p class="section-copy">Para cotizar con claridad, empecemos por los datos que importan.</p><a class="button button-primary" href="#cotizar">Empezar mi consulta <span>↗</span></a><figure class="nursery-process-photo"><img src="/assets/vivero/vivero.jpg" alt="Herramientas y sustrato para preparar una plantación, fotografía ilustrativa" width="1600" height="1067" loading="lazy" decoding="async"></figure></div>
            <ol class="nursery-steps"><li class="reveal"><span>01</span><div><h3>Contanos tu proyecto</h3><p>Tipo de comprador, zona de plantación, especies y cantidad aproximada. Podés consultar aunque todavía estés definiendo los detalles.</p></div></li><li class="reveal"><span>02</span><div><h3>Confirmemos la propuesta</h3><p>Solicitá variedades, portainjertos, tamaño, disponibilidad y precio. Para compras institucionales, agregá tus requisitos de documentación.</p></div></li><li class="reveal"><span>03</span><div><h3>Coordinemos el siguiente paso</h3><p>Acordá con el vivero las condiciones de pago, el retiro o la entrega y los plazos antes de confirmar el pedido.</p></div></li></ol>
        </div></section>
        <section class="nursery-quote section" id="cotizar"><div class="shell nursery-quote-grid">
            <div class="nursery-quote-copy reveal"><h2 class="section-title">Tu proyecto<br><em>puede empezar hoy.</em></h2><p class="section-copy">Completá lo esencial y llevá tu consulta a WhatsApp. Cuantos más detalles compartas, más precisa podrá ser la propuesta.</p><a class="nursery-direct" href="${wa}" ${external}><span>¿Preferís conversar directamente?</span><strong>+591 72139484 <span>↗</span></strong></a><p class="nursery-small">Cotización sujeta a confirmación de disponibilidad, condiciones y destino. Este formulario no confirma una compra.</p></div>
            <form class="nursery-form" id="nursery-quote" action="https://wa.me/${nursery.whatsapp}" method="get">
                <input type="hidden" name="text" value="${nurseryMessage}">
                <div class="nursery-form-fields" hidden>
                    <div class="nursery-field"><label for="quote-name">Tu nombre *</label><input id="quote-name" name="contactName" autocomplete="name" maxlength="100" required placeholder="¿Cómo te llamás?"></div>
                    <div class="nursery-field"><label for="quote-buyer">¿Para quién cotizamos? *</label><select id="quote-buyer" name="buyer" required><option value="">Seleccioná una opción</option>${nurseryBuyers.map(label=>`<option value="${label}">${label}</option>`).join('')}</select></div>
                    <div class="nursery-field nursery-field-wide"><label for="quote-org">Organización o proyecto</label><input id="quote-org" name="organization" autocomplete="organization" maxlength="140" placeholder="Nombre del proyecto u organización (opcional)"></div>
                    <div class="nursery-field nursery-field-wide"><label for="quote-destination">¿Dónde vas a plantar? *</label><input id="quote-destination" name="destination" maxlength="180" required placeholder="Localidad, departamento y país"></div>
                    <fieldset class="nursery-field-wide nursery-species"><legend>¿Qué frutales te interesan?</legend>${nursery.catalog.map(plant=>`<label><input type="checkbox" name="species" value="${plant.name}"><span>${plant.name}</span></label>`).join('')}<label><input type="checkbox" name="species" value="Necesito orientación"><span>Necesito orientación</span></label></fieldset>
                    <div class="nursery-field"><label for="quote-quantity">Cantidad aproximada</label><input id="quote-quantity" name="quantity" type="number" min="1" max="1000000" step="1" inputmode="numeric" placeholder="Ej.: 200"></div>
                    <div class="nursery-field"><label for="quote-date">Fecha estimada</label><input id="quote-date" name="date" type="month"></div>
                    <div class="nursery-field nursery-field-wide"><label for="quote-details">Contanos un poco más</label><textarea id="quote-details" name="details" rows="3" maxlength="1200" placeholder="Objetivo, otras especies, requisitos de compra o entrega…"></textarea></div>
                    <button class="button button-primary nursery-field-wide" type="submit">Preparar cotización <span>↗</span></button>
                    <p class="nursery-small nursery-field-wide">* Datos necesarios. Revisá tu consulta antes de enviarla. El formulario no guarda datos ni envía mensajes automáticamente.</p>
                </div>
                <noscript><p>Para cotizar, escribinos por WhatsApp con tu nombre, cantidad de plantas y lugar de entrega.</p><a class="button button-primary" href="${wa}" ${external}>Consultar por WhatsApp <span>↗</span></a></noscript>
                <dialog class="nursery-result" hidden aria-labelledby="nursery-result-title"><button class="nursery-result-back" type="button" data-quote-close>Volver al formulario</button><p class="nursery-form-status" id="nursery-result-title" role="status" aria-live="polite"></p><pre class="nursery-message-preview"></pre><a class="button button-primary" data-quote-link href="${wa}" ${external}>Enviar por WhatsApp <span>↗</span></a></dialog>
            </form>
        </div></section>
        <section class="nursery-faq section" id="preguntas"><div class="shell nursery-faq-grid"><div class="reveal"><h2 class="section-title">Resolvamos<br><em>tus dudas.</em></h2></div><div class="nursery-faq-list">${nurseryFAQs.map(([question,answer])=>`<details name="nursery-faq"><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></section>
        <section class="nursery-location section" id="visitanos"><div class="shell nursery-location-grid">
            <div class="reveal"><h2 class="section-title">El Torno.<br><em>Bolivia.</em></h2><p>Vivero la Loma · 2J5J+7W, El Torno, Bolivia</p><div class="nursery-location-actions"><a class="button button-primary" href="${map}" ${external}>Cómo llegar <span>↗</span></a><a class="nursery-location-contact" href="${wa}" ${external}>Coordinar una visita <span>↗</span></a></div><div class="nursery-location-note"><h3>Una conversación.<br>Muchas posibilidades.</h3><p>Antes de visitarnos, confirmá el horario y las plantas que te interesan por WhatsApp.</p><a href="tel:+59172139484">+591 72139484</a></div></div>
            <div class="nursery-map reveal"><iframe src="https://maps.google.com/maps?q=2J5J%2B7W%2C%20El%20Torno%2C%20Bolivia&amp;z=15&amp;output=embed" title="Ubicación de Vivero la Loma en El Torno, Bolivia" width="640" height="480" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><div class="nursery-map-caption"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><div><strong>Vivero la Loma</strong><span>2J5J+7W · El Torno, Bolivia</span></div></div></div>
        </div></section>
    </main>
    <footer class="footer shell"><div><b>Vivero la Loma</b><span>Frutales injertados · El Torno, Bolivia</span></div><a href="#cotizar">Hablemos de tu proyecto ↗</a></footer>
    <p class="demo-disclaimer shell">Demo comercial de TRAZA para Vivero la Loma. Fotografías y especies ilustrativas; catálogo, precios y disponibilidad a confirmar. Las consultas se dirigen al WhatsApp del vivero; no se realizan reservas ni compras automáticas.</p>
    <a class="floating-contact is-visible" href="${wa}" ${external} aria-label="Consultar a Vivero la Loma por WhatsApp"><span class="floating-contact__icon" aria-hidden="true"><img src="../1_basico/img/logo-whatsapp.png" width="24" height="24" alt=""></span><span class="floating-contact__label">WhatsApp</span></a>`;
}

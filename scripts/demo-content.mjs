export const DEMOS = {
    vivero: {
        theme: 'garden', layout: 'botanical', brand: 'RAÍZ', label: 'Vivero & jardín · Buenos Aires',
        headline: 'Un poco de verde.<br><em>Otra forma de vivir.</em>',
        description: 'Plantas, macetas y pequeños rituales para llenar de vida tu casa. Te ayudamos a encontrar el verde que va con vos.',
        heroImage: '/assets/vivero/invernadero.jpg', storyImage: '/assets/vivero/vivero.jpg',
        alt: 'Plantas en macetas dentro de un invernadero', action: 'Encontrar mi planta',
        primaryAnchor: '#catalogo', navServices: 'Plantas', navExperience: 'Cuidados',
        accentNote: 'Elegí con calma · consultanos por WhatsApp',
        strip: ['Plantas de interior', 'Rincones verdes', 'Suculentas', 'Macetas', 'Sustratos', 'Hecho para crecer'],
        metrics: [['Interior', 'verde para tu casa'], ['A tu ritmo', 'cuidados simples'], ['Con vos', 'desde la primera hoja']],
        intro: ['Hay una planta para tu forma de vivir.', 'La luz de tu casa, el espacio y tu rutina importan. Contanos cómo es tu rincón y te ayudamos a elegir una planta que lo disfrute tanto como vos.'],
        services: [
            ['01', 'Tu rincón verde', 'Plantas para interiores luminosos, patios y balcones. Encontramos la indicada para cada ambiente.', 'Asesoramiento'],
            ['02', 'Regalá vida', 'Una planta, una maceta y un mensaje especial. Un regalo que sigue creciendo.', 'Con intención'],
            ['03', 'Todo para crecer', 'Macetas, sustratos y herramientas para acompañar cada nueva hoja.', 'Para cuidar']
        ],
        catalog: [
            { name: 'Monstera', category: 'interior', label: 'Interior', image: '/assets/vivero/monstera.jpg', alt: 'Monstera de hojas grandes en una maceta blanca', description: 'Hojas grandes para darle protagonismo a ese rincón luminoso.', light: 'Luz indirecta', water: 'Dejar secar la capa superior' },
            { name: 'Helecho', category: 'interior', label: 'Interior', image: '/assets/vivero/verde.jpg', alt: 'Frondas verdes de un helecho', description: 'Verde abundante para espacios frescos, húmedos y sin sol directo.', light: 'Semisombra', water: 'Sustrato ligeramente húmedo' },
            { name: 'Suculenta cebra', category: 'suculentas', label: 'Suculentas', image: '/assets/vivero/interior.jpg', alt: 'Suculenta de hojas rayadas en una maceta verde agua', description: 'Pequeña, de crecimiento lento y perfecta para empezar.', light: 'Luz brillante indirecta', water: 'Dejar secar entre riegos' },
            { name: 'Kit de trasplante', category: 'accesorios', label: 'Accesorios', image: '/assets/vivero/vivero.jpg', alt: 'Palita, sustrato y macetas sobre una mesa de jardinería', description: 'Lo esencial para cambiar de maceta y darle lugar a nuevas raíces.', light: 'Sustrato + herramientas', water: 'Te orientamos para usarlo' }
        ],
        storyTitle: 'No hace falta saber.<br><em>Hace falta empezar.</em>',
        storyCopy: 'Te contamos dónde ubicar tu planta, cómo reconocer cuándo necesita agua y cuándo cambiarla de maceta. Cuidados claros, sin complicarte la vida. Y si aparece una duda, nos mandás una foto por WhatsApp.',
        storyAction: 'Quiero ayuda para elegir',
        quote: 'Llegué sin saber qué planta elegir. Me fui con una para mi casa y las ganas de seguir sumando verde.', person: '— CLARA, CLIENTA ILUSTRATIVA',
        location: 'Zona norte · Buenos Aires', hours: 'Lun a sáb · 9 a 18 h', booking: 'Consultar retiro o envío',
        visitTitle: 'Tu próximo rincón verde<br><em>empieza acá.</em>'
    },
    estetica: {
        theme: 'blush', layout: 'soft', brand: 'ALMA', label: 'Estética integral · Palermo',
        headline: 'Tu piel.<br><em>Tu mejor versión.</em>',
        description: 'Tratamientos faciales y corporales pensados para que te veas increíble sin dejar de sentirte vos.',
        heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1800&q=86',
        storyImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=84',
        alt: 'Tratamiento facial en un centro de estética moderno', action: 'Reservar diagnóstico',
        accentNote: 'Agenda online · cupos esta semana', strip: ['Faciales', 'Body sculpt', 'Masajes', 'Dermaplaning', 'Glow ritual'],
        metrics: [['4.9', 'en Google'], ['+1.2k', 'pieles cuidadas'], ['45 min', 'diagnóstico inicial']],
        intro: ['Belleza que se siente propia.', 'Nada de protocolos en serie. Primero escuchamos, evaluamos tu piel y diseñamos un plan realista para vos.'],
        services: [
            ['01', 'Glow reset', 'Limpieza profunda, dermaplaning e hidratación intensiva.', '75 min'],
            ['02', 'Lifting facial', 'Tecnología no invasiva para reafirmar y redefinir.', '6 sesiones'],
            ['03', 'Body contour', 'Plan corporal personalizado, medible y acompañado.', 'A medida']
        ],
        storyTitle: 'Cuidado experto.<br><em>Cero apuro.</em>', storyCopy: 'Un espacio sereno, profesionales matriculadas y tecnología elegida por resultados, no por moda.',
        quote: 'Salí con la piel luminosa y, por primera vez, entendiendo qué necesitaba de verdad.', person: '— JULIETA, PALERMO',
        location: 'Gurruchaga 1680 · Palermo Soho', hours: 'Lun a sáb · 9 a 20 h', booking: 'Quiero mi momento ALMA'
    },
    odontologia: {
        theme: 'clinic', layout: 'clean', brand: 'NÍTIDA', label: 'Odontología digital · Belgrano',
        headline: 'Volvé a sonreír<br><em>sin vueltas.</em>',
        description: 'Diagnóstico claro, tecnología de precisión y un equipo que te explica cada paso antes de empezar.',
        heroImage: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1800&q=86',
        storyImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=84',
        alt: 'Profesional odontológica atendiendo a una paciente', action: 'Pedir primera consulta',
        accentNote: 'Urgencias en el día', strip: ['Implantes', 'Ortodoncia', 'Blanqueamiento', 'Diseño digital', 'Prevención'],
        metrics: [['15 años', 'de experiencia'], ['4.9', 'valoración'], ['24 h', 'respuesta online']],
        intro: ['Precisión para darte tranquilidad.', 'Vas a ver tu diagnóstico, alternativas y presupuesto con claridad. Sin tecnicismos, sin sorpresas.'],
        services: [
            ['01', 'Consulta digital', 'Escaneo, imágenes y plan de tratamiento completo.', '60 min'],
            ['02', 'Implantes', 'Planificación 3D y seguimiento cercano.', 'Alta precisión'],
            ['03', 'Alineadores', 'Ortodoncia estética con controles simples.', 'Plan digital']
        ],
        storyTitle: 'Sabés qué hacemos.<br><em>Y por qué.</em>', storyCopy: 'La confianza empieza cuando todo se entiende. Te mostramos cada opción para que decidas con información real.',
        quote: 'Me explicaron todo con paciencia y el tratamiento fue mucho más simple de lo que imaginaba.', person: '— MARTÍN, COLEGIALES',
        location: 'Av. Cabildo 2140 · Belgrano', hours: 'Lun a vie · 8 a 20 h', booking: 'Coordinar mi consulta'
    },
    gastronomia: {
        theme: 'fire', layout: 'editorial', brand: 'BRASA', label: 'Cocina de estación · Chacarita',
        headline: 'Fuego, producto<br><em>y sobremesa.</em>',
        description: 'Una cocina porteña contemporánea donde el producto de estación y las brasas hacen todo el ruido.',
        heroImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=84',
        alt: 'Plato de autor servido en un restaurante contemporáneo', action: 'Reservar una mesa',
        accentNote: 'Menú noche · desde las 19:30', strip: ['Fuego', 'Estación', 'Vinos', 'Compartir', 'Buenos Aires'],
        metrics: [['7 pasos', 'menú degustación'], ['60+', 'etiquetas argentinas'], ['4.8', 'comensales felices']],
        intro: ['La cena empieza antes del primer plato.', 'Luz baja, cocina abierta y una carta corta que cambia con lo que llega mejor cada semana.'],
        services: [
            ['01', 'Menú BRASA', 'Siete pasos que recorren mar, huerta y fuego.', 'Mar–sáb'],
            ['02', 'A la carta', 'Platos para compartir y quedarse sin reloj.', 'Desde 19:30'],
            ['03', 'Mesa del chef', 'Una experiencia íntima frente a la cocina.', '8 lugares']
        ],
        storyTitle: 'Producto local.<br><em>Instinto global.</em>', storyCopy: 'Trabajamos con productores chicos, vinos argentinos y una obsesión simple: que cada plato tenga algo para recordar.',
        quote: 'Todo tuvo carácter, pero nada fue pretencioso. Volvimos por la provoleta ahumada.', person: '— SOFI & TOMI, CABALLITO',
        location: 'Dorrego 1187 · Chacarita', hours: 'Mar a sáb · 19:30 a cierre', booking: 'Reservar en BRASA'
    },
    inmobiliaria: {
        theme: 'estate', layout: 'gallery', brand: 'NORTE', label: 'Propiedades con criterio · CABA',
        headline: 'Espacios para<br><em>tu próxima etapa.</em>',
        description: 'Selección curada de propiedades y un asesoramiento que pone tu decisión por encima de la operación.',
        heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=84',
        alt: 'Casa contemporánea luminosa con grandes ventanales', action: 'Consultar propiedades',
        accentNote: 'Tasación sin cargo en 48 h', strip: ['Palermo', 'Belgrano', 'Núñez', 'Colegiales', 'Vicente López'],
        metrics: [['38', 'propiedades activas'], ['12 años', 'en zona norte'], ['96%', 'recomendación']],
        intro: ['Menos listados. Mejores decisiones.', 'Filtramos oportunidades reales, anticipamos problemas y te acompañamos de la primera visita a la firma.'],
        services: [
            ['01', 'Comprar', 'Búsqueda enfocada y análisis de cada oportunidad.', 'Curado'],
            ['02', 'Vender', 'Estrategia, producción visual y negociación.', 'Integral'],
            ['03', 'Invertir', 'Renta, potencial y escenarios claros.', 'Con datos']
        ],
        storyTitle: 'No mostramos metros.<br><em>Leemos momentos.</em>', storyCopy: 'Una propiedad funciona cuando encaja con tu vida, tus números y lo que viene después.',
        quote: 'Entendieron qué buscábamos antes que nosotros. Visitamos tres lugares y el tercero fue casa.', person: '— FAMILIA GÓMEZ, NÚÑEZ',
        location: 'Echeverría 2420 · Belgrano', hours: 'Lun a vie · 9 a 18 h', booking: 'Hablar con un asesor'
    },
    profesional: {
        theme: 'legal', layout: 'classic', brand: 'MÉRITO', label: 'Estudio jurídico · Buenos Aires',
        headline: 'Estrategia legal.<br><em>Decisiones firmes.</em>',
        description: 'Asesoramiento empresario directo, confidencial y orientado a resolver antes de que el problema crezca.',
        heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=86',
        storyImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=84',
        alt: 'Documentos y lapicera sobre una mesa de trabajo profesional', action: 'Solicitar entrevista',
        accentNote: 'Respuesta confidencial en 24 h', strip: ['Societario', 'Contratos', 'Laboral', 'Litigios', 'Compliance'],
        metrics: [['18 años', 'asesorando empresas'], ['24 h', 'primera respuesta'], ['90%', 'acuerdos tempranos']],
        intro: ['Claridad jurídica para poder avanzar.', 'Traducimos escenarios complejos en un mapa concreto de riesgos, opciones y próximos pasos.'],
        services: [
            ['01', 'Empresas', 'Contratos, sociedades y decisiones estratégicas.', 'Preventivo'],
            ['02', 'Conflictos', 'Negociación y litigios con foco en resultado.', 'Resolutivo'],
            ['03', 'Laboral', 'Relaciones de trabajo y contingencias.', 'Integral']
        ],
        storyTitle: 'Rigor en el análisis.<br><em>Practicidad al decidir.</em>', storyCopy: 'No entregamos respuestas de manual. Entendemos el negocio y construimos la estrategia legal que necesita.',
        quote: 'Nos dieron un panorama claro en dos reuniones y destrabamos una negociación que llevaba meses.', person: '— DIRECTOR, EMPRESA TECNOLÓGICA',
        location: 'Tucumán 836 · Microcentro', hours: 'Lun a vie · 9 a 18 h', booking: 'Coordinar entrevista privada'
    },
    taller: {
        theme: 'garage', layout: 'industrial', brand: 'TORQUE', label: 'Taller integral · Villa Crespo',
        headline: 'Tu auto listo.<br><em>Sin chamuyo.</em>',
        description: 'Diagnóstico preciso, presupuesto antes de tocar y seguimiento por WhatsApp. Mecánica con palabra.',
        heroImage: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1400&q=84',
        alt: 'Mecánico trabajando en el motor de un auto', action: 'Pedir diagnóstico',
        accentNote: 'Turnos desde mañana', strip: ['Scanner', 'Frenos', 'Tren delantero', 'Service', 'Electricidad'],
        metrics: [['20 años', 'en el barrio'], ['6 meses', 'de garantía'], ['4.9', 'en reseñas']],
        intro: ['Te mostramos el problema. Después decidís.', 'Fotos, videos y presupuesto detallado antes de cada arreglo. Nada aparece de sorpresa al retirar el auto.'],
        services: [
            ['01', 'Service oficial', 'Aceite, filtros y chequeo de 24 puntos.', 'En el día'],
            ['02', 'Diagnóstico', 'Scanner multimarca y revisión especializada.', 'Preciso'],
            ['03', 'Frenos y tren', 'Seguridad, repuestos trazables y garantía.', '6 meses']
        ],
        storyTitle: 'Manos expertas.<br><em>Cuentas claras.</em>', storyCopy: 'Un taller ordenado, repuestos con procedencia y comunicación directa con quien trabaja en tu auto.',
        quote: 'Me mandaron un video, explicaron qué era urgente y qué podía esperar. Volví a confiar en un taller.', person: '— LUCAS, ALMAGRO',
        location: 'Warnes 1432 · Villa Crespo', hours: 'Lun a vie · 8 a 18 h', booking: 'Reservar lugar en el taller'
    },
    veterinaria: {
        theme: 'vet', layout: 'friendly', brand: 'MIMO', label: 'Veterinaria & bienestar · Caballito',
        headline: 'Cuidarlos bien<br><em>se nota.</em>',
        description: 'Clínica, prevención y seguimiento cercano para que compartan más años buenos con vos.',
        heroImage: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1400&q=84',
        alt: 'Veterinaria revisando a un perro en el consultorio', action: 'Sacar un turno',
        accentNote: 'Guardia telefónica hasta las 23 h', strip: ['Clínica', 'Vacunas', 'Laboratorio', 'Nutrición', 'Peluquería'],
        metrics: [['12k+', 'pacientes mimados'], ['4.9', 'familias felices'], ['23 h', 'guardia telefónica']],
        intro: ['Medicina con tiempo y con cariño.', 'Consultas sin apuro, diagnósticos explicados y un seguimiento que sigue cuando vuelven a casa.'],
        services: [
            ['01', 'Consulta clínica', 'Chequeo completo y plan preventivo.', '40 min'],
            ['02', 'Plan cachorro', 'Vacunas, nutrición y acompañamiento inicial.', 'Todo el año'],
            ['03', 'Senior care', 'Controles y calidad de vida en cada etapa.', 'Cercano']
        ],
        storyTitle: 'Los conocemos.<br><em>Los acompañamos.</em>', storyCopy: 'Historia clínica digital, recordatorios y un equipo que se acuerda de su nombre —y de sus mañas.',
        quote: 'Mora antes temblaba al entrar a una veterinaria. Acá entra moviendo la cola.', person: '— CARO + MORA, CABALLITO',
        location: 'Av. Pedro Goyena 640 · Caballito', hours: 'Lun a sáb · 8 a 21 h', booking: 'Pedir turno para mi mascota'
    },
    academia: {
        theme: 'academy', layout: 'playful', brand: 'SALTO', label: 'Academia de idiomas · Online + CABA',
        headline: 'Hablá desde<br><em>la primera clase.</em>',
        description: 'Inglés real para viajar, trabajar y animarte. Grupos chicos, objetivos concretos y cero ejercicios de relleno.',
        heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=84',
        alt: 'Estudiantes compartiendo una clase dinámica', action: 'Consultar mi nivel',
        accentNote: 'Nuevos grupos · consultá los horarios', strip: ['Travel', 'Work', 'Conversation', 'Cambridge', 'Kids'],
        metrics: [['8 max', 'por grupo'], ['92%', 'llega a su meta'], ['2x semana', 'clases en vivo']],
        intro: ['Tu objetivo marca el programa.', 'No enseñamos unidades: entrenamos situaciones que vas a usar afuera de la clase.'],
        services: [
            ['01', 'English Go', 'Conversación para viajar y resolver situaciones.', 'A2–B1'],
            ['02', 'Career boost', 'Reuniones, entrevistas y presentaciones.', 'B1–C1'],
            ['03', 'Cambridge lab', 'Preparación enfocada y simulacros reales.', 'B2–C2']
        ],
        storyTitle: 'Menos miedo.<br><em>Más conversación.</em>', storyCopy: 'Clases activas, feedback humano y una comunidad que te empuja a usar el idioma aunque no salga perfecto.',
        quote: 'A los tres meses tuve mi primera reunión completa en inglés. No pensé que iba a animarme tan rápido.', person: '— VALE, PRODUCT DESIGNER',
        location: 'Online + Villa Urquiza', hours: 'Lun a sáb · 8 a 22 h', booking: 'Descubrir mi nivel'
    },
    hogar: {
        theme: 'home', layout: 'utility', brand: 'LISTO', label: 'Soluciones para el hogar · AMBA',
        headline: 'Se rompió.<br><em>Lo resolvemos.</em>',
        description: 'Plomería, electricidad y mantenimiento con técnicos verificados, precio claro y llegada coordinada.',
        heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1400&q=84',
        alt: 'Técnico profesional reparando una instalación del hogar', action: 'Pedir técnico',
        accentNote: 'Emergencias · respuesta en 15 min', strip: ['Plomería', 'Electricidad', 'Gas', 'Climatización', 'Mantenimiento'],
        metrics: [['90 min', 'llegada promedio'], ['4.8', 'servicio verificado'], ['30 días', 'garantía escrita']],
        intro: ['Un técnico confiable, cuando lo necesitás.', 'Contanos el problema, recibí un rango de precio y coordiná la visita sin cadenas eternas de mensajes.'],
        services: [
            ['01', 'Urgencias', 'Pérdidas, cortes y fallas que no pueden esperar.', 'Hoy'],
            ['02', 'Instalaciones', 'Equipos, artefactos y mejoras planificadas.', 'Con garantía'],
            ['03', 'Mantenimiento', 'Visitas programadas para casas y comercios.', 'Mensual']
        ],
        storyTitle: 'Llegamos a horario.<br><em>Dejamos todo listo.</em>', storyCopy: 'Profesionales con identidad verificada, presupuesto previo y seguimiento después del trabajo.',
        quote: 'Pedí ayuda a las 9, a las 11 ya estaba resuelto y pagué exactamente lo que me habían dicho.', person: '— ANDREA, VILLA DEVOTO',
        location: 'Cobertura CABA + GBA', hours: 'Todos los días · 7 a 23 h', booking: 'Resolver mi problema ahora'
    },
    eventos: {
        theme: 'event', layout: 'immersive', brand: 'FUEGO', label: 'Eventos con pulso · Buenos Aires',
        headline: 'Que pase algo<br><em>inolvidable.</em>',
        description: 'Concepto, producción y puesta integral para eventos que se sienten propios desde que empieza la música.',
        heroImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1400&q=84',
        alt: 'Evento nocturno con luces y ambientación elegante', action: 'Contar mi idea',
        accentNote: 'Tu próxima fecha · consultá la agenda', strip: ['Bodas', 'Marcas', 'Fiestas', 'Escenografía', 'Experiencias'],
        metrics: [['180+', 'eventos producidos'], ['14', 'premios creativos'], ['1 equipo', 'de idea a cierre']],
        intro: ['No decoramos espacios. Creamos una energía.', 'Una idea rectora conecta ambientación, luz, música, gastronomía y cada momento que vive el invitado.'],
        services: [
            ['01', 'Sociales', 'Bodas y fiestas con una identidad irrepetible.', 'Integral'],
            ['02', 'Marcas', 'Lanzamientos y experiencias que generan conversación.', 'Impacto'],
            ['03', 'Dirección creativa', 'Concepto, diseño y curaduría de proveedores.', 'A medida']
        ],
        storyTitle: 'Una noche.<br><em>Mil detalles.</em>', storyCopy: 'Producimos la experiencia completa para que vos puedas estar presente, no pendiente.',
        quote: 'No parecía un salón decorado: parecía nuestro mundo por una noche.', person: '— LU + FEDE, NOVIOS FUEGO',
        location: 'Buenos Aires · Producciones nacionales', hours: 'Reuniones con cita previa', booking: 'Empezar a imaginarlo'
    },
    alojamiento: {
        theme: 'stay', layout: 'cinematic', brand: 'CALMA', label: 'Refugio de montaña · Patagonia',
        headline: 'Lejos del ruido.<br><em>Cerca de todo.</em>',
        description: 'Cabañas contemporáneas, bosque nativo y hospitalidad cálida a quince minutos de Bariloche.',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=88',
        storyImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=84',
        alt: 'Alojamiento boutique rodeado de naturaleza', action: 'Consultar disponibilidad',
        accentNote: 'Mejor tarifa reservando directo', strip: ['Bosque', 'Desayuno', 'Spa', 'Senderos', 'Atardeceres'],
        metrics: [['8', 'cabañas privadas'], ['4.9', 'huéspedes felices'], ['15 min', 'del centro']],
        intro: ['Un ritmo distinto desde que llegás.', 'Desayuno sin horario, ventanales al bosque y recomendaciones hechas por gente que vive acá.'],
        services: [
            ['01', 'Nido', 'Suite para dos, estufa y deck entre cipreses.', '2 personas'],
            ['02', 'Casa bosque', 'Dos cuartos, cocina y hogar a leña.', '4 personas'],
            ['03', 'Experiencia CALMA', 'Masajes, picnic y salida guiada.', 'Personalizada']
        ],
        storyTitle: 'Dormir profundo.<br><em>Despertar despacio.</em>', storyCopy: 'Arquitectura simple, materiales nobles y la Patagonia entrando por cada ventana.',
        quote: 'Reservamos por dos noches y nos quedamos cuatro. Hacía mucho que no descansábamos así.', person: '— PAULA + NICO, ROSARIO',
        location: 'Circuito Chico km 12 · Bariloche', hours: 'Check-in desde 15 h', booking: 'Planear mi escapada'
    }
};


export function renderDemo(demo, TRAZA_PHONE) {
    const whatsappText = encodeURIComponent(`Hola, vi la demo ${demo.brand} de TRAZA y quiero una web así para mi negocio.`);
    const wa = `https://wa.me/${TRAZA_PHONE}?text=${whatsappText}`;
    const primaryLink = demo.primaryAnchor ? `href="${demo.primaryAnchor}"` : `href="${wa}" target="_blank" rel="noopener"`;
    const serviceMarkup = demo.services.map(([number, title, copy, tag], index) => `
        <a class="service-card reveal tilt" style="--delay:${index * 80}ms" href="https://wa.me/${TRAZA_PHONE}?text=${encodeURIComponent(`Hola, vi la demo ${demo.brand} de TRAZA, en la sección ${title}, y quiero una web así para mi negocio.`)}" target="_blank" rel="noopener" aria-label="Consultar por la demo ${demo.brand}: ${title}">
            <div class="service-card__top"><span>${number}</span><small>${tag}</small></div>
            <h3>${title}</h3><p>${copy}</p><span class="service-card__arrow" aria-hidden="true">↗</span>
        </a>`).join('');
    const metricsMarkup = demo.metrics.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    const stripMarkup = [...demo.strip, ...demo.strip].map(item => `<span>${item}<i>✦</i></span>`).join('');
    const catalogMarkup = demo.catalog ? `
        <section class="plant-catalog section" id="catalogo" aria-labelledby="catalog-title">
            <div class="shell">
                <div class="catalog-heading reveal"><div><p class="section-index">SELECCIÓN BOTÁNICA</p><h2 class="section-title" id="catalog-title">Encontrá tu<br><em>próxima planta.</em></h2></div><p class="section-copy">Explorá esta selección y consultanos por tamaños, precios y disponibilidad. Te ayudamos a elegir.</p></div>
                <div class="catalog-filters" role="group" aria-label="Filtrar el catálogo" hidden>
                    ${[['all','Ver todo'],['interior','Interior'],['suculentas','Suculentas'],['accesorios','Accesorios']].map(([key, label]) => `<button type="button" data-plant-filter="${key}" aria-pressed="${key === 'all'}" aria-controls="plant-grid">${label}</button>`).join('')}
                </div>
                <p class="catalog-status" role="status" aria-live="polite" aria-atomic="true"><span>Opciones en esta selección:</span> <span data-catalog-count>${demo.catalog.length}</span></p>
                <div class="plant-grid" id="plant-grid">${demo.catalog.map(plant => `
                    <article class="plant-card reveal" data-plant-category="${plant.category}">
                        <div class="plant-photo"><img src="${plant.image}" alt="${plant.alt}" width="800" height="900" loading="lazy" decoding="async"><span>${plant.label}</span></div>
                        <div class="plant-info"><h3>${plant.name}</h3><p>${plant.description}</p><ul class="plant-care"><li>${plant.light}</li><li>${plant.water}</li></ul>
                        <a href="https://wa.me/${TRAZA_PHONE}?text=${encodeURIComponent(`Hola, vi la demo ${demo.brand} de TRAZA, en la sección ${plant.name}, y quiero una web así para mi negocio.`)}" target="_blank" rel="noopener" aria-label="Consultar por la demo ${demo.brand}: ${plant.name}">Consultar por WhatsApp <span aria-hidden="true">↗</span></a></div>
                    </article>`).join('')}
                </div>
            </div>
        </section>` : '';

    return `
        <a class="skip-link" href="#contenido">Saltar al contenido</a>
        <div class="progress" aria-hidden="true"><i></i></div>
        <nav class="nav" aria-label="Navegación principal">
            <a class="brand" href="#inicio"><b>${demo.brand}</b><small>Demo conceptual</small></a>
            <button aria-controls="demo-menu" class="menu-button" type="button" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i></button>
            <div class="nav-links" id="demo-menu"><a href="${demo.primaryAnchor || '#servicios'}">${demo.navServices || 'Servicios'}</a><a href="#experiencia">${demo.navExperience || 'Experiencia'}</a><a href="#visitanos">Visitanos</a></div>
            <a class="nav-cta" ${primaryLink}>${demo.action} <span>↗</span></a>
        </nav>

        <main id="contenido">
            <header class="hero" id="inicio">
                <div class="hero-media" aria-hidden="true"><img src="${demo.heroImage}" alt="" fetchpriority="high" width="1800" height="1200"><span></span></div>
                <div class="hero-orbit" aria-hidden="true"><i></i><i></i><b>${demo.brand}</b></div>
                <div class="hero-content shell">
                    <p class="eyebrow reveal">${demo.label} · Demo</p>
                    <h1 class="reveal" style="--delay:90ms">${demo.headline}</h1>
                    <p class="hero-copy reveal" style="--delay:170ms">${demo.description}</p>
                    <div class="hero-actions reveal" style="--delay:240ms">
                        <a class="button button-primary magnetic" ${primaryLink}>${demo.action}<span>↗</span></a>
                        <a class="button button-ghost" href="#servicios">Conocer más <span>↓</span></a>
                    </div>
                </div>
                <div class="hero-note reveal" style="--delay:300ms"><i></i><span>${demo.accentNote}</span></div>
                <div class="hero-metrics shell" aria-label="Cifras ilustrativas de la demo">${metricsMarkup}</div>
            </header>

            <div class="marquee"><div aria-hidden="true">${stripMarkup}</div></div>
            ${catalogMarkup}

            <section class="intro section" id="servicios">
                <div class="shell intro-grid">
                    <p class="section-index reveal">01 / ENFOQUE</p>
                    <h2 class="section-title reveal">${demo.intro[0]}</h2>
                    <p class="section-copy reveal">${demo.intro[1]}</p>
                </div>
                <div class="shell service-grid">${serviceMarkup}</div>
            </section>

            <section class="story section" id="experiencia">
                <div class="story-media reveal"><img src="${demo.storyImage}" alt="Ambiente de ${demo.brand}" loading="lazy" width="1400" height="1000" decoding="async"><span></span></div>
                <div class="story-content reveal">
                    <p class="section-index">02 / EXPERIENCIA</p>
                    <h2 class="section-title">${demo.storyTitle}</h2>
                    <p>${demo.storyCopy}</p>
                    <a href="${wa}" target="_blank" rel="noopener">${demo.storyAction || 'Conocer el enfoque'} <span>↗</span></a>
                </div>
                <div class="story-number" aria-hidden="true">02</div>
            </section>

            <section class="quote section" aria-label="Testimonio ilustrativo">
                <div class="quote-mark" aria-hidden="true">“</div>
                <blockquote class="shell reveal"><p>${demo.quote}</p><footer>${demo.person}</footer></blockquote>
            </section>

            <section class="visit section" id="visitanos">
                <div class="visit-grid" aria-hidden="true"></div>
                <div class="shell visit-content">
                    <p class="section-index reveal">03 / VISITANOS</p>
                    <h2 class="section-title reveal">${demo.visitTitle || 'Todo listo para<br><em>dar el primer paso.</em>'}</h2>
                    <div class="visit-data reveal">
                        <div><small>Dónde</small><strong>${demo.location}</strong></div>
                        <div><small>Cuándo</small><strong>${demo.hours}</strong></div>
                    </div>
                    <a class="button button-primary magnetic reveal" href="${wa}" target="_blank" rel="noopener">${demo.booking}<span>↗</span></a>
                </div>
            </section>
        </main>

        <p class="demo-disclaimer shell">Demo conceptual: marca, testimonios, cifras y ubicación ilustrativas. Las consultas llegan a TRAZA para crear una web para tu negocio; no se realizan reservas.</p>
        <footer class="footer shell"><div><b>${demo.brand}</b><span>${demo.label}</span></div><a href="${wa}" target="_blank" rel="noopener">Quiero esta web para mi negocio ↗</a></footer>
        <a class="floating-contact is-visible" href="${wa}" target="_blank" rel="noopener" aria-label="Consultar esta demo por WhatsApp">
            <span class="floating-contact__icon" aria-hidden="true"><img src="../1_basico/img/logo-whatsapp.png" width="24" height="24" alt=""></span>
            <span class="floating-contact__label">WhatsApp</span>
        </a>`;
}

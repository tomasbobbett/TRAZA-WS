import { readFile, writeFile, mkdir, readdir, copyFile, stat, unlink } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMOS, renderDemo } from './demo-content.mjs';
import { resolveOrigin } from './site-origin.mjs';
import { canonicalRoute } from './demo-routes.mjs';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(site, 'webs');
const publicDir = join(site, 'public');
const config = JSON.parse(await readFile(join(site, 'site.config.json'), 'utf8'));
const origin = resolveOrigin(config);
const version = '20260924-clean-headings';
const nurseryVersion = '20260924-viewport';
const exists = async p => stat(p).then(() => true, () => false);
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
async function output(path, text) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, text); }
async function copyTree(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (/^preview.*\.png$/.test(entry.name) || ['prospeccion.html', 'PLAN_COMERCIAL.md'].includes(entry.name)) continue;
    const source = join(from, entry.name), dest = join(to, entry.name);
    if (entry.isDirectory()) await copyTree(source, dest);
    else await copyFile(source, dest);
  }
}

// Editable sources are always in webs/. Builds only write to public/.
for (const folder of ['agencia', '1_basico', 'nichos', 'assets']) {
  await copyTree(join(root, folder), join(publicDir, folder));
}
// The nursery has local fonts; skip the unrelated remote font families.
await output(join(publicDir, 'nichos/vivero-base.css'), (await readFile(join(root, 'nichos/demo.css'), 'utf8')).replace(/^@import[^\r\n]*\r?\n/, ''));
// Remove only known private/starter artifacts from the public copy.
for (const path of ['PLAN_COMERCIAL.md', 'agencia/prospeccion.html', 'favicon.svg', 'file.svg', 'globe.svg', 'window.svg']) {
  await unlink(join(publicDir, path)).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
for (const file of await readdir(join(publicDir, 'agencia'))) {
  if (/^preview.*\.png$/.test(file)) await unlink(join(publicDir, 'agencia', file));
}

function icons(key, prefix='../') {
  const path = `${prefix}assets/icons/${key}`;
  return `<link rel="icon" href="${path}/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${path}/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="${path}/apple-touch-icon.png">
<link rel="manifest" href="${path}/site.webmanifest">`;
}
function social(title, description, image, path) {
  path = canonicalRoute(path);
  const absoluteImage = image && (/^https:\/\//.test(image) ? image : origin ? origin + image : '');
  return `${origin ? `<link rel="canonical" href="${origin}${path}"><meta property="og:url" content="${origin}${path}">` : ''}
<meta property="og:type" content="website"><meta property="og:locale" content="es_AR">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta name="twitter:card" content="${absoluteImage ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">
${absoluteImage ? `<meta property="og:image" content="${esc(absoluteImage)}"><meta property="og:image:alt" content="${esc(title)}"><meta name="twitter:image" content="${esc(absoluteImage)}"><meta name="twitter:image:alt" content="${esc(title)}">` : ''}`;
}
function head(title, description, key, path, image, extra='', prefix='../') {
  return `<!DOCTYPE html><html lang="es-AR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="${key === 'pulso' ? '#0a0a0a' : '#080b12'}">
${icons(key,prefix)}${social(title,description,image,path)}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${extra}</head>`;
}

for (const [key, demo] of Object.entries(DEMOS)) {
  const title = `${demo.brand} — ${demo.label.split(' · ')[0]} | Demo TRAZA`;
  const description = `Demo conceptual de ${demo.brand}. ${demo.description}`;
  const html = head(title,description,key,`/nichos/${key}.html`,demo.heroImage,`<link rel="stylesheet" href="${key === 'vivero' ? 'vivero-base' : 'demo'}.css?v=${version}">${key === 'vivero' ? `<link rel="stylesheet" href="vivero.css?v=${nurseryVersion}">` : ''}<link rel="stylesheet" href="../assets/whatsapp.css?v=20260910-traza">`)
    .replace('<meta name="theme-color" content="#080b12">', `<meta name="theme-color" content="${({blush:'#2e2223',clinic:'#0b2930',fire:'#1e0c08',estate:'#17241c',legal:'#0c182a',garage:'#0c0c0c',vet:'#24372a',academy:'#15225d',home:'#0d2d3c',event:'#110512',stay:'#25261f',garden:'#172e23'})[demo.theme]}">`)
    + `<body data-demo="${key}" class="theme-${demo.theme} layout-${demo.layout}">${renderDemo(demo,config.whatsapp)}<script src="demo.js?v=${version}" defer></script>${key === 'vivero' ? `<script src="vivero.js?v=${nurseryVersion}" defer></script>` : ''}</body></html>`;
  await output(join(publicDir, 'nichos', `${key}.html`),html);
}

const wa = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Hola, vi la demo PULSO de TRAZA y quiero una web así para mi gimnasio.')}`;
const secondaryCSS = `<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/main.css?v=${version}"><link rel="stylesheet" href="../css/pages/index.css?v=${version}"><link rel="stylesheet" href="../css/pages/secondary.css?v=${version}"><link rel="stylesheet" href="../../assets/whatsapp.css?v=20260910-traza">`;
function gymPage(name, description, body) {
  return head(`${name} — PULSO | Demo TRAZA`,description,'pulso',`/1_basico/pages/${({Contacto:'contacto','Preguntas frecuentes':'faqs',Sede:'sedes'})[name]}.html`,'/1_basico/img/sentadilla.jpg',secondaryCSS,'../../') + `<body class="secondary-page">
<a class="skip-link" href="#main">Saltar al contenido</a>
<nav class="nav" aria-label="Navegación principal"><a class="brand" href="../index.html"><span class="brand__mark" aria-hidden="true"></span><span class="brand__name">PULSO</span></a>
<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menú"><span></span><span></span></button>
<div class="nav__menu" id="nav-menu"><a href="../index.html">El club</a><a href="sedes.html"${name==='Sede'?' aria-current="page"':''}>Sede</a><a href="faqs.html"${name==='Preguntas frecuentes'?' aria-current="page"':''}>Preguntas</a><a href="contacto.html"${name==='Contacto'?' aria-current="page"':''}>Contacto</a></div>
<a class="nav__cta" href="${wa}" target="_blank" rel="noopener">Quiero esta web ↗</a></nav>
<main class="shell secondary-main" id="main">${body}</main>
<footer class="footer"><div class="shell footer__bottom"><p>© 2026 PULSO · Demo conceptual de TRAZA.</p><a href="../index.html">Volver a PULSO ↗</a></div><p class="demo-disclaimer shell">Marca, horarios, testimonios y ubicación ilustrativos. Las consultas se envían a TRAZA para crear una web; no se realizan reservas.</p></footer>
<a class="floating-contact is-visible" href="${wa}" target="_blank" rel="noopener" aria-label="Consultar a TRAZA por la demo PULSO"><span class="floating-contact__icon" aria-hidden="true"><img src="../img/logo-whatsapp.png" width="24" height="24" alt=""></span><span class="floating-contact__label">WhatsApp</span></a>
<script src="../script.js?v=${version}" defer></script>${name==='Contacto'?`<script src="../contacto.js?v=${version}" defer></script>`:''}</body></html>`;
}
const pages = {
  'faqs.html': gymPage('Preguntas frecuentes','Preguntas sobre la experiencia de entrenamiento que presenta la demo PULSO.',`<h1 class="display">Antes de empezar.<br><em>Todo claro.</em></h1><p class="secondary-intro">Conocé cómo sería entrenar en PULSO. La información forma parte de esta demo.</p>
<div class="faq-list">${[
['¿Necesito experiencia para empezar?','No. La experiencia propuesta incluye una evaluación inicial y una rutina adaptada al nivel de cada persona.'],
['¿Cuáles son los horarios?','Los horarios ilustrativos son de lunes a viernes de 6 a 23 h y sábados y domingos de 8 a 20 h.'],
['¿Qué tipos de entrenamiento hay?','Fuerza, entrenamiento funcional y acompañamiento personal. El programa se adapta al objetivo y al punto de partida.'],
['¿Qué llevaría a mi primera clase?','Ropa cómoda, zapatillas deportivas, agua y una toalla. El acompañamiento de un coach está contemplado en la experiencia de ejemplo.'],
['¿Puedo reservar una clase desde esta web?','Esta es una demostración de diseño. Los botones abren una consulta con TRAZA para solicitar una web similar; no reservan clases en un gimnasio real.'],
['¿Quiero una web como esta para mi gimnasio?','Podés escribirnos por WhatsApp o usar la página de contacto. Adaptamos identidad, servicios, horarios y contenidos a tu negocio.']
].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div><a class="button button--lime" href="${wa}" target="_blank" rel="noopener">Quiero esta web para mi gimnasio ↗</a>`),
  'sedes.html': gymPage('Sede','Explorá la sede ilustrativa de PULSO en Palermo: espacio, equipamiento y horarios de ejemplo.',`<h1 class="display">Un espacio.<br><em>Otra energía.</em></h1><p class="secondary-intro">Palermo, Buenos Aires. Una sede de ejemplo pensada para entrenar con foco y sentirte parte.</p><div class="secondary-grid"><img class="secondary-photo" src="../img/astetikgym.webp" alt="Espacio de entrenamiento que ilustra la demo PULSO" width="900" height="1000"><div class="info-panel"><h2>El lugar para dar<br>tu próximo paso.</h2><dl><dt>Zona de ejemplo</dt><dd>Palermo, Ciudad de Buenos Aires</dd><dt>Horarios ilustrativos</dt><dd>Lun a vie · 06:00—23:00<br>Sáb y dom · 08:00—20:00</dd><dt>La experiencia</dt><dd>Peso libre, máquinas, espacio funcional, vestuarios y coaching cercano.</dd></dl><a class="button button--lime" href="${wa}" target="_blank" rel="noopener">Consultar por esta demo ↗</a></div></div>`),
  'contacto.html': gymPage('Contacto','Contactá a TRAZA para adaptar la demo PULSO a tu gimnasio.',`<h1 class="display">Tu gimnasio.<br><em>Su próxima web.</em></h1><p class="secondary-intro">Contanos qué necesitás. Al continuar se abre WhatsApp con tu consulta preparada para TRAZA; vos decidís cuándo enviarla.</p><div class="secondary-grid"><form class="contact-form" id="gym-contact" action="https://wa.me/${config.whatsapp}" method="get"><label for="contact-name">Tu nombre</label><input id="contact-name" name="name" autocomplete="name" maxlength="100" required placeholder="¿Cómo te llamás?"><label for="contact-business">Nombre del gimnasio <span>(opcional)</span></label><input id="contact-business" name="business" autocomplete="organization" maxlength="120" placeholder="Tu negocio"><label for="contact-message">¿Qué te gustaría hacer?</label><textarea id="contact-message" name="message" rows="5" maxlength="1500" required placeholder="Una web nueva, mostrar las clases, recibir más consultas…"></textarea><button class="button button--lime" type="submit">Preparar consulta en WhatsApp ↗</button><p class="form-note">Estos datos se usan para armar el mensaje. Este formulario no guarda tus datos ni envía mensajes automáticamente. <a href="../../agencia/privacidad.html">Privacidad</a>.</p><p class="form-status" id="contact-status" role="status" aria-live="polite"></p><noscript><p>Podés escribirnos directamente con el enlace de WhatsApp que está al lado del formulario.</p></noscript></form><aside class="info-panel"><h2>De la idea<br>a la primera consulta.</h2><p>Identidad, propuesta, clases, equipo, ubicación y una forma simple de contactarte. Todo adaptado a tu gimnasio.</p><a class="button button--ghost" href="${wa}" target="_blank" rel="noopener">Abrir WhatsApp directamente ↗</a><a class="secondary-back" href="../index.html">← Recorrer la demo PULSO</a></aside></div>`)
};
for (const [filename, html] of Object.entries(pages)) {
  await output(join(publicDir,'1_basico','pages',filename),html);
}

// Override all share metadata together to prevent inherited or stale cards.
for (const [path,title,description,image] of [
  ['agencia/index.html','TRAZA — Webs que resuelven','Diseño y desarrollo web para negocios argentinos. Explorá 13 demos con identidad propia y consultá por tu proyecto.','/agencia/og-catalogo.png'],
  ['1_basico/index.html','PULSO — Club de fuerza | Demo TRAZA','Demo conceptual de un gimnasio boutique: fuerza, entrenamiento y comunidad. Una web de ejemplo creada por TRAZA.','/1_basico/img/sentadilla.jpg']
]) {
  let html=await readFile(join(publicDir,path),'utf8');
  html=html.replace(/<meta\b[^>]*(?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/g,'');
  html=html.replace(/<title>[^<]*<\/title>/,`<title>${title}</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${description}">`);
  html=html.replace('</head>',`${social(title,description,image,path === 'agencia/index.html' ? '/' : '/'+path)}\n</head>`);
  await output(join(publicDir,path),html);
}

const privacy = head('Privacidad — TRAZA','Cómo se usan los datos de contacto en el sitio de TRAZA.','traza','/agencia/privacidad.html',null,`<link rel="stylesheet" href="styles.css?v=${version}">`) + `<body><a class="skip-link" href="#main">Saltar al contenido</a><main id="main" class="shell privacy-page"><a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true"></span><span class="brand__name">TRAZA</span></a><p class="eyebrow">Información de contacto</p><h1>Privacidad</h1><p>Este sitio presenta los servicios de TRAZA y un catálogo de demos conceptuales. No incluye cuentas de clientes, pagos ni un sistema propio de seguimiento publicitario.</p><h2>Consultas por WhatsApp</h2><p>Los botones de contacto abren WhatsApp con un mensaje preparado. El envío ocurre cuando vos lo confirmás dentro de WhatsApp. Los datos que compartas allí se usarán para responder tu consulta y conversar sobre tu proyecto.</p><h2>Formulario de la demo PULSO</h2><p>El nombre, negocio y consulta se usan en tu navegador para preparar el mensaje. El formulario no guarda esos datos en una base de datos del sitio.</p><h2>Servicios externos</h2><p>Las tipografías, algunas imágenes y el mapa se cargan desde Google y Unsplash. Al cargarlos, tu navegador se conecta con esos proveedores, que reciben datos técnicos de la conexión. Los enlaces a WhatsApp y mapas llevan a servicios con sus propias políticas.</p><h2>Consultas sobre tus datos</h2><p>Podés pedir aclaraciones o la eliminación de la información que hayas compartido escribiendo a <a href="https://wa.me/${config.whatsapp}" target="_blank" rel="noopener">TRAZA por WhatsApp</a>.</p><a class="button button--accent" href="index.html">Volver a TRAZA ↗</a></main></body></html>`;
await output(join(publicDir,'agencia/privacidad.html'),privacy);
await copyFile(join(publicDir,'assets/icons/traza/favicon.ico'),join(publicDir,'favicon.ico'));
await copyFile(join(publicDir,'assets/icons/traza/apple-touch-icon.png'),join(publicDir,'apple-touch-icon.png'));
await output(join(publicDir,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /agencia/prospeccion.html\nDisallow: /PLAN_COMERCIAL.md\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
const routes=['/agencia/index.html','/agencia/privacidad.html','/1_basico/index.html',...Object.keys(pages).map(p=>'/1_basico/pages/'+p),...Object.keys(DEMOS).map(k=>`/nichos/${k}.html`)];
if(origin) await output(join(publicDir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path=>`<url><loc>${origin}${path === '/agencia/index.html' ? '/' : canonicalRoute(path)}</loc></url>`).join('')}</urlset>`);
else await unlink(join(publicDir,'sitemap.xml')).catch(e=>{if(e.code!=='ENOENT')throw e;});
await output(join(publicDir,'404.html'),head('Página no encontrada — TRAZA','Volvé al catálogo de demos de TRAZA.','traza','/404.html',null,'<meta name="robots" content="noindex"><link rel="stylesheet" href="/agencia/styles.css">','/')+'<body><main class="shell privacy-page" id="main"><p class="eyebrow">TRAZA · 404</p><h1>Este camino<br>no lleva a una web.</h1><p>El enlace pudo cambiar. Encontrá tu próxima web en el catálogo.</p><a class="button button--accent" href="/agencia/index.html#demo">Explorar las demos ↗</a></main></body></html>');
await output(join(publicDir,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n');
// Every website shares the same progressive motion lifecycle, including direct
// file links and secondary pages. Bump all local assets to avoid mixed versions.
for (const path of routes.map(route => route.slice(1))) {
  const sourcePath=join(publicDir,path);
  const localPath=join(root,path);
  const sourceExists=await exists(sourcePath);
  if(!sourceExists && !await exists(localPath))continue;
  let html=await readFile(sourceExists?sourcePath:localPath,'utf8');
  const prefix=path.startsWith('1_basico/pages/')?'../../':'../';
  html=html.replace(/<link\b[^>]*href="[^"]*assets\/motion.css[^"]*"[^>]*>\s*/g,'').replace(/<script\b[^>]*src="[^"]*assets\/motion.js[^"]*"[^>]*><\/script>\s*/g,'');
  html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/motion.css?v=${version}">\n<script src="${prefix}assets/motion.js?v=${version}" defer></script>\n</head>`);
  html=html.replace(/((?:href|src)="(?!https?:)[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g,(match,path)=>path.includes('whatsapp.css')?match:`${path}?v=${version}"`);
  html=html.replace(/<script\b[^>]*src="[^"]+"[^>]*>/g,tag=>/\bdefer\b/.test(tag)?tag:tag.replace('>',' defer>'));
  if(path==='agencia/privacidad.html') html=html.replace('<h2>Servicios externos</h2>','<h2>Preferencia de movimiento</h2><p>El control de animaciones guarda tu elección sólo durante esta sesión del navegador. No se envía a un servidor.</p><h2>Servicios externos</h2>');
  if(sourceExists)await output(sourcePath,html);
}
console.log(`Prepared ${routes.length} content pages, ${Object.keys(DEMOS).length + 2} icon families and a 404 page. ${origin ? 'Canonical URLs and sitemap configured.' : 'Set site.config.json origin when the final domain is available.'}`);

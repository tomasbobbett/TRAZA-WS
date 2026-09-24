# TRAZA

Sitio de TRAZA y catálogo de 13 demos web por rubro.

## Netlify

La configuración está en netlify.toml:

- Directorio base: raíz del repositorio.
- Comando de compilación: npm run build.
- Directorio publicado: public.
- Versión de Node: 22.13 o posterior.

El dominio se obtiene de Netlify durante la compilación. Para definir otro origen HTTPS, usar SITE_ORIGIN o el campo origin en site.config.json.

## Desarrollo

Ejecutar npm run build y luego npm run preview. La vista previa está en http://127.0.0.1:4183. El comando de compilación ejecuta también las pruebas.

- webs/: páginas, estilos, interacciones e imágenes.
- scripts/demo-content.mjs: contenido de las demos por rubro.
- scripts/: generación y herramientas de desarrollo.
- tests/: comprobaciones de contenido, recursos e interacciones.
- public/: salida generada; no se edita ni se versiona.

Cada rubro tiene una página independiente en `/demo/<rubro>/`. Por ejemplo, `/demo/gimnasio/`, `/demo/estetica/` y `/demo/gastronomia/`. El cliente entra directamente en su demo, sin pasar por el catálogo ni encontrar enlaces a otros rubros. Las consultas llegan a WhatsApp con el nombre de la demo.

`/enlaces.txt` contiene las 13 direcciones para copiar y enviar al cliente. El dominio configurado es `https://trraza.netlify.app`; Netlify lo adapta automáticamente en las vistas previas. Las direcciones anteriores siguen funcionando.

PULSO también tiene contacto, preguntas y sede dentro de `/demo/gimnasio/`. Las páginas comparten recursos visuales para mantener las animaciones y evitar duplicar imágenes. `scripts/demo-routes.mjs` define las direcciones; `public/` debe publicarse completo.

## Idiomas de las demos

Las 13 demos y las tres páginas internas de PULSO incluyen un selector compacto con un globo, el idioma actual (ES, EN o PT) y una flecha. Al abrirlo, un menú hacia abajo ofrece Español, English y Português, sin desplazar la navegación. Se cierra al elegir, hacer clic afuera, salir con Tab o presionar Escape; también admite las flechas del teclado. Español es el idioma inicial; la preferencia se guarda en el navegador. Se puede compartir una demo directamente en inglés con `?lang=en`, en portugués de Brasil con `?lang=pt` o en español con `?lang=es`. El parámetro del enlace tiene prioridad sobre la preferencia guardada.

Las traducciones están en `scripts/translations.mjs`. Incluyen contenido, metadatos en el navegador, accesibilidad, formularios y mensajes preparados de WhatsApp. `scripts/i18n.mjs` verifica la cobertura al compilar e incorpora sólo las traducciones de cada página; si se agrega texto sin traducir, la compilación indica qué falta. Los nombres de las marcas y las direcciones se conservan. El cambio de idioma no recarga la página ni borra campos completados.

Para revisar las demos, usar la salida compilada de `npm run preview`. Sin JavaScript mantienen el contenido completo en español. Las tarjetas de enlaces de redes sociales siguen usando los metadatos estáticos en español.

Con la vista previa en marcha, `npm run verify:languages` comprueba las 16 páginas en los tres idiomas y en siete anchos (320, 390, 1024, 1120, 1121, 1280 y 1440 px), incluyendo el cambio entre la navegación móvil y la de escritorio y la posición del desplegable abierto. También verifica selección por teclado, preferencia guardada, enlaces compartidos, navegación sin almacenamiento, galería, preguntas, animaciones y formularios. Las consultas de WhatsApp se interceptan durante la prueba y no se envían.

Los informes y las capturas se guardan en `qa-languages/`, fuera del sitio publicado y del repositorio. La revisión requiere Playwright instalado o disponible mediante `NODE_PATH`, y Edge, o la variable `BROWSER_CHANNEL` para otro navegador compatible. `PREVIEW_URL` permite cambiar la dirección de la vista previa. Las comprobaciones de diseño e interacciones también se pueden ejecutar por separado con `node scripts/verify-languages.mjs` y `node scripts/verify-language-interactions.mjs`.

La [base de clientes potenciales](clientes-potenciales/README.md) contiene la planilla comercial actualizada con negocios, rubros y contactos públicos de distintos países. Se versiona junto al proyecto y queda fuera de la web publicada.

La demo de **Vivero la Loma**, de El Torno, Bolivia, está en `/demo/vivero/`. Está orientada a frutales injertados para productores, municipios y organizaciones. Las consultas de esta demo se dirigen al número del cliente, `+591 72139484`; las demás demos conservan el contacto de TRAZA. Incluye catálogo con filtros, selección de especies y tipo de comprador, formulario que prepara un mensaje revisable de WhatsApp, preguntas frecuentes y mapa con el código `2J5J+7W, El Torno, Bolivia`.

La portada de Vivero la Loma se ajusta al alto visible para mostrar título, descripción, botones e indicadores completos. El catálogo y las demás secciones conservan fotos grandes, tamaños cómodos y su espaciado natural; pueden ocupar más de una pantalla tanto en escritorio como en móvil. El formulario conserva todos sus campos a la vista; la consulta preparada se revisa en un diálogo que permite volver a editar sin perder los datos. Las preguntas muestran una respuesta por vez.

La sección de consulta combina una fotografía ilustrativa con tres tarjetas de pasos. La ubicación incluye un mapa interactivo de Google Maps con el código proporcionado por el cliente, los datos de contacto y un enlace independiente para abrir las indicaciones. El mapa se carga al acercarse a la sección.

El contenido y el teléfono están en `scripts/vivero-content.mjs`, las traducciones en `scripts/vivero-translations.mjs` y los estilos e interacciones en `webs/nichos/vivero.css` y `vivero.js`. Limón, naranja, mango y palta son especies propuestas por pedido del usuario, pendientes de confirmar con el vivero. Las fotografías son ilustrativas y locales; no se publican precios, stock, certificaciones ni testimonios inventados. El formulario no guarda datos ni envía mensajes automáticamente y ofrece contacto directo sin JavaScript.

Con la vista previa en marcha, `node scripts/verify-vivero.mjs` verifica Vivero la Loma en tres idiomas y trece tamaños de pantalla, incluyendo escritorio de 1280 × 556 y móvil de 320 × 568. Comprueba que la portada entre completa sin tapar sus botones o indicadores, la ausencia de desbordes horizontales en las demás secciones, los filtros, el formulario completo, el diálogo de revisión, el destinatario y contenido de WhatsApp, la persistencia de datos al traducir, el menú móvil, el mapa y el contenido sin JavaScript. No envía mensajes. Guarda capturas e informe en `qa-vivero/`, fuera del repositorio. Usa los mismos requisitos de Playwright, `NODE_PATH` y `PREVIEW_URL` de las comprobaciones de idiomas. Las fuentes de las fotografías están en `scripts/vivero-image-sources.json`; las tipografías locales incluyen sus licencias en `webs/assets/vivero/`.

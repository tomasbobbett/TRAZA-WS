# TRAZA

Sitio de TRAZA y catálogo de 12 demos web por rubro.

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

`/enlaces.txt` contiene las 12 direcciones para copiar y enviar al cliente. El dominio configurado es `https://trraza.netlify.app`; Netlify lo adapta automáticamente en las vistas previas. Las direcciones anteriores siguen funcionando.

PULSO también tiene contacto, preguntas y sede dentro de `/demo/gimnasio/`. Las páginas comparten recursos visuales para mantener las animaciones y evitar duplicar imágenes. `scripts/demo-routes.mjs` define las direcciones; `public/` debe publicarse completo.

## Idiomas de las demos

Las 12 demos y las tres páginas internas de PULSO incluyen un selector ES / EN / PT. Español es el idioma inicial; la preferencia se guarda en el navegador. Se puede compartir una demo directamente en inglés con `?lang=en`, en portugués de Brasil con `?lang=pt` o en español con `?lang=es`. El parámetro del enlace tiene prioridad sobre la preferencia guardada.

Las traducciones están en `scripts/translations.mjs`. Incluyen contenido, metadatos en el navegador, accesibilidad, formularios y mensajes preparados de WhatsApp. `scripts/i18n.mjs` verifica la cobertura al compilar e incorpora sólo las traducciones de cada página; si se agrega texto sin traducir, la compilación indica qué falta. Los nombres de las marcas y las direcciones se conservan. El cambio de idioma no recarga la página ni borra campos completados.

Para revisar las demos, usar la salida compilada de `npm run preview`. Sin JavaScript mantienen el contenido completo en español. Las tarjetas de enlaces de redes sociales siguen usando los metadatos estáticos en español.

Con la vista previa en marcha, `npm run verify:languages` comprueba las 15 páginas en los tres idiomas y en cuatro anchos (320, 390, 1024 y 1440 px). También verifica selección por teclado, preferencia guardada, enlaces compartidos, navegación sin almacenamiento, galería, preguntas, animaciones y formularios. Las consultas de WhatsApp se interceptan durante la prueba y no se envían.

Los informes y las capturas se guardan en `qa-languages/`, fuera del sitio publicado y del repositorio. La revisión requiere Playwright instalado o disponible mediante `NODE_PATH`, y Edge, o la variable `BROWSER_CHANNEL` para otro navegador compatible. `PREVIEW_URL` permite cambiar la dirección de la vista previa. Las comprobaciones de diseño e interacciones también se pueden ejecutar por separado con `node scripts/verify-languages.mjs` y `node scripts/verify-language-interactions.mjs`.

La [base de clientes potenciales](clientes-potenciales/README.md) contiene la planilla comercial actualizada con negocios, rubros y contactos públicos de distintos países. Se versiona junto al proyecto y queda fuera de la web publicada.

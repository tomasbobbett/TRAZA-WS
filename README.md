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

La [base de clientes potenciales](clientes-potenciales/README.md) contiene la planilla comercial actualizada con negocios, rubros y contactos públicos de distintos países. Se versiona junto al proyecto y queda fuera de la web publicada.

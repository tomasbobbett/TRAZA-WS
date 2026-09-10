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

Cada demo se abre desde el catálogo. /enlaces.txt contiene sus direcciones completas después de publicar.

Este repositorio contiene únicamente el sitio y sus herramientas de publicación.

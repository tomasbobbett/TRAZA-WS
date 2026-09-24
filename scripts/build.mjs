import { readFile, writeFile, rm, lstat, realpath } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_ROUTES } from './demo-routes.mjs';
import { separateDemos } from './separate-demos.mjs';
import { resolveOrigin } from './site-origin.mjs';
import { addTranslations } from './i18n.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(project, 'public');
const config = JSON.parse(await readFile(join(project, 'site.config.json'), 'utf8'));
const origin = resolveOrigin(config);
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
});
if (existing) {
  const expected = join(await realpath(project), 'public');
  if (existing.isSymbolicLink() || !existing.isDirectory() || await realpath(output) !== expected) {
    throw new Error('Refusing to clear a publish directory outside this project.');
  }
  await rm(output, { recursive: true });
}
await import('./prepare-public.mjs');
await addTranslations(output);
await separateDemos(output);

// The main address serves the complete agency page, with assets resolved from /.
const agency = await readFile(join(output, 'agencia/index.html'), 'utf8');
const homepage = agency.replace(/\b(href|src|action)="([^"]+)"/g, (match, attribute, reference) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(reference)) return match;
  const url = new URL(reference, 'https://local.invalid/agencia/index.html');
  return `${attribute}="${url.pathname}${url.search}${url.hash}"`;
});
await writeFile(join(output, 'index.html'), homepage);

const links = [
  ...DEMO_ROUTES.map(demo => [`${demo.label} · ${demo.brand}`, demo.route]),
];
await writeFile(join(output, 'enlaces.txt'), 'TRAZA — Demos por rubro para enviar directamente al cliente\n\n'
  + 'Copiá únicamente el enlace del rubro de tu cliente. Abre su demo sin pasar por el catálogo.\n\n'
  + (origin ? '' : 'Agregar el dominio publicado delante de cada ruta.\n\n')
  + links.map(([label, route]) => `${label}\n${origin}${route}`).join('\n\n') + '\n');
console.log(`Netlify: public/ listo, portada completa y 12 demos. ${origin || 'El dominio se detectará al compilar en Netlify.'}`);

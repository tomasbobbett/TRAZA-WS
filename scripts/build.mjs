import { readFile, writeFile, rm, lstat, realpath } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMOS } from './demo-content.mjs';
import { resolveOrigin } from './site-origin.mjs';

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

// The main address serves the complete agency page, with assets resolved from /.
const agency = await readFile(join(output, 'agencia/index.html'), 'utf8');
const homepage = agency.replace(/\b(href|src|action)="([^"]+)"/g, (match, attribute, reference) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(reference)) return match;
  const url = new URL(reference, 'https://local.invalid/agencia/index.html');
  return `${attribute}="${url.pathname}${url.search}${url.hash}"`;
});
await writeFile(join(output, 'index.html'), homepage);

const links = [
  ['TRAZA · Catálogo completo', '/'],
  ['Gimnasio · PULSO', '/1_basico/index.html'],
  ...Object.entries(DEMOS).map(([key, demo]) => [demo.label, `/nichos/${key}.html`]),
];
await writeFile(join(output, 'enlaces.txt'), 'TRAZA — Enlaces para compartir\n\n'
  + (origin ? '' : 'Agregar el dominio publicado delante de cada ruta.\n\n')
  + links.map(([label, route]) => `${label}\n${origin}${route}`).join('\n\n') + '\n');
console.log(`Netlify: public/ listo, portada completa y 12 demos. ${origin || 'El dominio se detectará al compilar en Netlify.'}`);

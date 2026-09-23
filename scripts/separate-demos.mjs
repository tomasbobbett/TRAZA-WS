import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, posix } from 'node:path';
import { DEMO_PAGES, canonicalRoute } from './demo-routes.mjs';

export async function separateDemos(output) {
  for (const { source, route } of DEMO_PAGES) {
    const original = await readFile(join(output, source), 'utf8');
    // Relocate real HTML pages; a direct visit never relies on the catalogue or JS.
    const html = original.replace(/\b(href|src|action)="([^"]+)"/g, (match, attribute, reference) => {
      if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(reference)) return match;
      const url = new URL(reference, `https://local.invalid${source}`);
      const target = canonicalRoute(url.pathname);
      const destination = target.endsWith('/') ? `${target}index.html` : target;
      const relative = posix.relative(route, destination);
      return `${attribute}="${relative}${url.search}${url.hash}"`;
    });
    const file = join(output, route, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  // Installed shortcuts open the same industry as the shared page.
  for (const { key, route } of DEMO_PAGES.filter(page => page.key)) {
    const file = join(output, 'assets/icons', key === 'gimnasio' ? 'pulso' : key, 'site.webmanifest');
    const manifest = JSON.parse(await readFile(file, 'utf8'));
    manifest.start_url = route;
    await writeFile(file, JSON.stringify(manifest, null, 2) + '\n');
  }
}

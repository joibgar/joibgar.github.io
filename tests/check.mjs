// Comprueba las reglas de contenido del escaparate (ver
// docs/superpowers/specs/2026-10-03-escaparate-design.md).
// Uso: node tests/check.mjs  (sale con 1 y lista los fallos si algo no cumple)

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CORREO = 'joibgar@gmail.com';
const JUEGOS = ['prisma', 'sky-dash'];
const PAGINAS = ['index.html', ...JUEGOS.map((j) => `${j}/privacidad.html`)];

const fallos = [];
const leer = (rel) => {
  const ruta = join(raiz, rel);
  if (!existsSync(ruta)) {
    fallos.push(`${rel}: no existe`);
    return null;
  }
  return readFileSync(ruta, 'utf8');
};

for (const rel of PAGINAS) {
  const html = leer(rel);
  if (html === null) continue;

  for (const prohibido of ['prisma-preview', 'gaibjo']) {
    if (html.includes(prohibido)) fallos.push(`${rel}: contiene "${prohibido}"`);
  }

  for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|#|mailto:|data:)/.test(url)) continue;
    const destino = join(raiz, dirname(rel), url.split(/[?#]/)[0]);
    if (!existsSync(destino)) fallos.push(`${rel}: "${url}" no existe`);
  }

  // El lang de <html> es el idioma inicial, no un texto traducido.
  const cuerpo = html.replace(/<html[^>]*>/, '');
  const es = (cuerpo.match(/lang="es"/g) ?? []).length;
  const en = (cuerpo.match(/lang="en"/g) ?? []).length;
  if (es !== en) fallos.push(`${rel}: ${es} textos en ES y ${en} en EN`);
}

const index = leer('index.html');
if (index !== null) {
  if (index.includes(CORREO) || index.includes('mailto:')) {
    fallos.push('index.html: lleva correo');
  }
  const tarjetas = index.split('<article class="juego"').slice(1);
  if (tarjetas.length !== JUEGOS.length) {
    fallos.push(`index.html: ${tarjetas.length} tarjetas, se esperaban ${JUEGOS.length}`);
  }
  JUEGOS.forEach((juego, i) => {
    const t = tarjetas[i] ?? '';
    if (!t.includes('data-play-url=')) fallos.push(`tarjeta ${juego}: sin data-play-url`);
    if (!t.includes(`href="${juego}/privacidad.html"`)) {
      fallos.push(`tarjeta ${juego}: sin enlace a ${juego}/privacidad.html`);
    }
  });
}

for (const juego of JUEGOS) {
  const html = leer(`${juego}/privacidad.html`);
  if (html !== null && !html.includes(CORREO)) {
    fallos.push(`${juego}/privacidad.html: falta el contacto ${CORREO}`);
  }
}

if (fallos.length) {
  console.error([...new Set(fallos)].map((f) => `✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log('✓ escaparate correcto');

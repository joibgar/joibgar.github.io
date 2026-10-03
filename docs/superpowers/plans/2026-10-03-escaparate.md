# Escaparate joibgar.github.io — plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** sustituir la página actual por un escaparate bilingüe de Prisma y Sky Dash, con políticas de privacidad propias y capturas.

**Architecture:** HTML/CSS estático servido por GitHub Pages; un JS mínimo en línea para el idioma y el botón de Play. Un script Node sin dependencias (`tests/check.mjs`) comprueba las reglas del contenido.

**Tech Stack:** HTML, CSS, Node ≥ 18 (solo para el check y las capturas), puppeteer-core en el scratchpad contra el Firefox del sistema (solo para sacar capturas, no entra en el repo).

**Spec:** `docs/superpowers/specs/2026-10-03-escaparate-design.md`

## Global Constraints

- Ningún enlace a la versión web: ni `prisma-preview` ni ninguna URL jugable.
- La página principal no lleva correo ni datos personales.
- Único correo del sitio: `joibgar@gmail.com`, y solo dentro de las dos políticas.
- `gaibjo@gmail.com` no aparece en ningún sitio.
- Bilingüe ES/EN. Si no hay JS, se ven los dos idiomas.
- `app-ads.txt` no se toca.

## Review Focus

1. Navegador en un idioma que no es ni es ni en (p. ej. `fr`) → la página sale en EN.
2. `localStorage` bloqueado (modo privado) → la página carga y el selector funciona igual, solo que no recuerda la elección.
3. Pantalla de 320 px de ancho → sin scroll horizontal de página; la tira de capturas se desplaza dentro de su tarjeta.
4. Rellenar `data-play-url` en una tarjeta → el botón pasa a ser un enlace activo que abre en pestaña nueva; si queda vacío, sigue desactivado.
5. Una imagen referenciada que no existe → `tests/check.mjs` falla.

(1, 2 y 4 se comprueban a mano en el navegador sin ventana en la Tarea 4; 5 la cubre el check; 3, con una captura a 320 px.)

---

### Task 1: check de contenido

**Files:** Create `tests/check.mjs`; Modify `_config.yml` (excluir `tests`).

- [ ] Escribir `tests/check.mjs`. Lee `index.html`, `prisma/privacidad.html` y `sky-dash/privacidad.html`, y falla (exit 1, listando los motivos) si:
  - algún fichero contiene `prisma-preview` o `gaibjo`;
  - `index.html` contiene `@` dentro de un `href="mailto:` o la cadena `joibgar@gmail.com`;
  - alguna política no contiene `joibgar@gmail.com`;
  - alguna `src`/`href` relativa (sin `http`, `#` ni `mailto:`) apunta a un fichero que no existe;
  - `index.html` no tiene exactamente dos `<article class="juego"`, o alguno no lleva `data-play-url` y un enlace a `<juego>/privacidad.html`;
  - algún `<span lang="es">` no tiene su pareja `lang="en"` (que el número de unos y otros coincida).
- [ ] Ejecutar `node tests/check.mjs` contra la página actual → debe FALLAR (gaibjo, prisma-preview y faltan las políticas).
- [ ] Commit.

### Task 2: capturas e iconos

**Files:** Create `assets/prisma/{icon.png,1.webp,2.webp,3.webp}` y `assets/sky-dash/{icon.png,1.webp,2.webp,3.webp}`.

- [ ] Iconos: `merge-mine/covers/play-icon-512.png` y `sky-dash/covers/play-icon.png`, reducidos a 192 px.
- [ ] Servir `merge-mine/dist` y `sky-dash/dist-web` con `python3 -m http.server`, y con puppeteer-core + Firefox sin ventana (viewport 412×915, DPR 2) sacar tres capturas por juego: inicio, partida en curso y resultado o tienda.
- [ ] Convertir a WebP de 540 px de ancho (`cwebp` o Pillow) y mirar cada imagen.
- [ ] Commit.

### Task 3: páginas

**Files:** Create `assets/estilo.css`, `prisma/privacidad.html`, `sky-dash/privacidad.html`; Rewrite `index.html`.

- [ ] Escribir `estilo.css` con tokens claro/oscuro, `html[lang=es] [lang=en]{display:none}` y su inversa (solo con la clase `js` en `<html>`), las tarjetas, la tira de capturas (scroll-snap) y los botones.
- [ ] Escribir `index.html` con el contenido de la spec. Las descripciones salen de las fichas de Play (`merge-mine/docs/google-play-envio.md`, `sky-dash/docs/google-play-envio.md`), resumidas.
- [ ] Escribir las dos políticas según la spec.
- [ ] `node tests/check.mjs` → PASA.
- [ ] Commit.

### Task 4: verificación en navegador

- [ ] Servir el repo y sacar capturas a 412 px y 320 px en ES y EN, con `navigator.language` `fr` y con un `data-play-url` de prueba (sin comitear).
- [ ] Mirarlas, corregir lo que haga falta y volver a pasar el check.
- [ ] Commit final. No hacer push.

# Escaparate joibgar.github.io — diseño

Aprobado por José en el chat el 2026-10-03.

## Propósito

Página de desarrollador que enseña los juegos y aplicaciones de joibgar. Es
también el destino del botón «Más juegos y aplicaciones» de Sky Dash en Android
(`MORE_GAMES_URL` en `sky-dash/src/sdk/android.ts`) y la web de desarrollador
que valida `app-ads.txt` para AdMob.

## Requisitos

- Una introducción breve: aquí se enseñan los juegos y aplicaciones que
  joibgar va desarrollando.
- Por ahora, dos juegos: **Prisma: Merge Gems** y **Sky Dash**.
- Cada juego lleva icono, descripción breve y capturas sacadas de su versión web.
- Cada juego lleva solo dos enlaces: **Google Play** y **Política de privacidad**.
- **Ningún enlace a la versión web** de ningún juego. Ni `prisma-preview` ni
  otra URL jugable.
- **Sin datos personales en la página principal**, tampoco correo. El único
  correo del sitio es `joibgar@gmail.com`, y solo dentro de las políticas de
  privacidad, porque Google Play exige que la política tenga un contacto.
- Bilingüe español/inglés.

## Estructura

```
index.html                 escaparate (ES/EN)
prisma/privacidad.html     política de Prisma (ES + EN en la misma página)
sky-dash/privacidad.html   política de Sky Dash (ES + EN en la misma página)
assets/estilo.css          estilos comunes a las tres páginas
assets/prisma/             icon.png + capturas .webp
assets/sky-dash/           icon.png + capturas .webp
app-ads.txt                sin cambios
_config.yml                Jekyll: excluye docs/ de la publicación
```

HTML y CSS estáticos, sin build ni dependencias. Lo único que usa JS es el
selector de idioma.

## Escaparate (index.html)

- Cabecera con el nombre «joibgar» y la introducción.
- Selector ES/EN arriba a la derecha. Los textos van en pares
  `<span lang="es">`/`<span lang="en">` y el CSS oculta el idioma no activo
  según `html[lang]`. El idioma inicial sale de `navigator.language` (es* →
  ES; cualquier otro → EN), y la elección manual se guarda en `localStorage`
  dentro de try/catch. Sin JS, se ven los dos idiomas.
- Una tarjeta por juego con icono, nombre, descripción breve (sacada de la
  descripción larga de la ficha de Play), una tira de capturas en vertical con
  scroll horizontal y scroll-snap, y dos botones:
  - **Google Play**: mientras no haya URL, es un botón desactivado («Próximamente
    en Google Play»). Para activarlo basta con rellenar `data-play-url` en la
    tarjeta: un script corto lo convierte en enlace. Es un solo sitio por juego.
  - **Política de privacidad** → `prisma/privacidad.html` o `sky-dash/privacidad.html`.
- Pie con «© 2026 joibgar». Sin correo.
- Tema claro/oscuro con `prefers-color-scheme`. Se ve bien en móvil, con
  margen lateral de 16 px y sin scroll horizontal de página.

## Políticas de privacidad

Parten de la política publicada de Prisma (`prisma-preview/privacy.html`,
2026-09-26) con estos cambios:

- El contacto pasa a ser `joibgar@gmail.com`.
- Se quita el apartado «Versión web»: la política es de la app Android.
- Sky Dash usa el mismo esquema y menciona que guarda en el dispositivo el
  récord, las monedas, las naves y los ajustes. En el menú, el botón de
  consentimiento se llama «Privacidad», como en Prisma.
- Fecha: 3 de octubre de 2026.
- Las dos páginas llevan enlace de vuelta al escaparate y ninguno a la versión web.

## Capturas

Se sacan con un navegador sin ventana desde la build web de cada juego
(`merge-mine/dist`, `sky-dash/dist-web`), servida en local, con viewport
vertical de móvil (412×915 CSS px, DPR 2). Son tres por juego: menú o inicio,
partida en curso y una tercera representativa (resultado o tienda de naves).
Se guardan en WebP a 540 px de ancho y no muestran ninguna URL ni la interfaz
del navegador.

## Fuera de alcance

- Borrar o tocar `prisma-preview`: sigue accesible para quien tenga la URL.
- Cambiar la URL de privacidad registrada en Play Console (lo hace José).
- `git push` (lo hace José desde el PC físico).

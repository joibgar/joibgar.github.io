// Selector ES/EN común a todas las páginas. Sin JS se ven los dos idiomas.
(function () {
  var CLAVE = 'joibgar-idioma';
  var raiz = document.documentElement;

  function guardado() {
    try {
      return localStorage.getItem(CLAVE);
    } catch (e) {
      return null;
    }
  }

  function aplicar(idioma, recordar) {
    raiz.lang = idioma;
    if (recordar) {
      try {
        localStorage.setItem(CLAVE, idioma);
      } catch (e) {}
    }
    var botones = document.querySelectorAll('[data-idioma]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].setAttribute('aria-pressed', String(botones[i].dataset.idioma === idioma));
    }
    var titulo = raiz.dataset['titulo' + (idioma === 'es' ? 'Es' : 'En')];
    if (titulo) document.title = titulo;
  }

  var inicial = guardado();
  if (inicial !== 'es' && inicial !== 'en') {
    inicial = /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  }
  raiz.classList.add('js');
  raiz.lang = inicial;

  document.addEventListener('DOMContentLoaded', function () {
    aplicar(inicial, false);
    var botones = document.querySelectorAll('[data-idioma]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].addEventListener('click', function (e) {
        aplicar(e.currentTarget.dataset.idioma, true);
      });
    }

    // Botón de Google Play: se activa en cuanto la tarjeta tiene data-play-url.
    var tarjetas = document.querySelectorAll('[data-play-url]');
    for (var j = 0; j < tarjetas.length; j++) {
      var url = tarjetas[j].dataset.playUrl;
      var boton = tarjetas[j].querySelector('.boton.play');
      if (!url || !boton) continue;
      boton.href = url;
      boton.target = '_blank';
      boton.rel = 'noopener';
      boton.removeAttribute('aria-disabled');
      boton.removeAttribute('tabindex');
    }
  });
})();

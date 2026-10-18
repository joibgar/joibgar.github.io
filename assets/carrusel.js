// Carrusel de capturas, visor a pantalla completa y tráiler de YouTube.
//
// Sin JS, las capturas se ven como una tira con scroll y el tráiler es un
// enlace al Short. Con JS:
// - .carrusel recibe flechas y puntos; tocar una captura la abre en el visor,
//   que también es un carrusel (flechas, deslizar, ← →, Esc).
// - a.video[data-youtube] carga el reproductor de youtube-nocookie.com solo al
//   pulsarlo: hasta entonces la página no conecta con YouTube.
// Las capturas y los tráileres de un idioma se ocultan con CSS en el otro
// (ver idioma.js), así que todo cuenta solo con los elementos visibles y se
// rehace al cambiar de idioma.
(function () {
  var GAP = 12;
  var carruseles = [];

  function visibles(lista) {
    return Array.prototype.filter.call(lista, function (el) {
      return el.offsetParent !== null;
    });
  }

  function boton(clase, etiqueta, texto) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.setAttribute('aria-label', etiqueta);
    b.textContent = texto;
    return b;
  }

  function es() {
    return document.documentElement.lang === 'es';
  }

  // ------------------------------------------------------------- carrusel
  function montarCarrusel(carrusel) {
    var pista = carrusel.querySelector('.pista');
    var ant = boton('flecha ant', es() ? 'Capturas anteriores' : 'Previous screenshots', '‹');
    var sig = boton('flecha sig', es() ? 'Capturas siguientes' : 'Next screenshots', '›');
    var puntos = document.createElement('div');
    puntos.className = 'puntos';
    carrusel.append(ant, sig);
    carrusel.after(puntos);

    function items() {
      return visibles(pista.querySelectorAll('.captura'));
    }
    function paso() {
      var i = items();
      return i.length ? i[0].getBoundingClientRect().width + GAP : 1;
    }
    function pintar() {
      var max = pista.scrollWidth - pista.clientWidth - 2;
      ant.disabled = pista.scrollLeft <= 2;
      sig.disabled = pista.scrollLeft >= max;
      var actual = Math.round(pista.scrollLeft / paso());
      var dots = puntos.children;
      for (var k = 0; k < dots.length; k++) {
        dots[k].setAttribute('aria-current', String(k === Math.min(actual, dots.length - 1)));
      }
    }
    function rehacer() {
      puntos.textContent = '';
      items().forEach(function (item, k) {
        var d = boton('', (es() ? 'Captura ' : 'Screenshot ') + (k + 1), '');
        d.addEventListener('click', function () {
          pista.scrollTo({ left: k * paso() });
        });
        puntos.append(d);
      });
      pista.scrollLeft = 0;
      pintar();
    }

    ant.addEventListener('click', function () {
      pista.scrollBy({ left: -paso() });
    });
    sig.addEventListener('click', function () {
      pista.scrollBy({ left: paso() });
    });
    pista.addEventListener('scroll', pintar, { passive: true });
    window.addEventListener('resize', pintar);
    pista.addEventListener('click', function (e) {
      var item = e.target.closest('.captura');
      if (!item) return;
      e.preventDefault();
      var lista = items();
      abrirVisor(lista.map(function (el) {
        return el.getAttribute('href');
      }), lista.indexOf(item), item);
    });
    rehacer();
    carruseles.push(rehacer);
  }

  // ----------------------------------------------------------------- visor
  var visor, vImg, vCuenta, vPuntos, vCaps = [], vI = 0, vOrigen = null;

  function crearVisor() {
    visor = document.createElement('div');
    visor.className = 'visor';
    visor.hidden = true;
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    var barra = document.createElement('div');
    barra.className = 'visor-barra';
    vCuenta = document.createElement('span');
    var cerrar = boton('visor-cerrar', 'Cerrar / Close', '×');
    barra.append(vCuenta, cerrar);
    var escena = document.createElement('div');
    escena.className = 'visor-escena';
    vImg = document.createElement('img');
    vImg.alt = '';
    var ant = boton('flecha ant', 'Anterior / Previous', '‹');
    var sig = boton('flecha sig', 'Siguiente / Next', '›');
    escena.append(vImg, ant, sig);
    vPuntos = document.createElement('div');
    vPuntos.className = 'puntos';
    visor.append(barra, escena, vPuntos);
    document.body.append(visor);

    cerrar.addEventListener('click', cerrarVisor);
    ant.addEventListener('click', function () { mostrar(vI - 1); });
    sig.addEventListener('click', function () { mostrar(vI + 1); });
    escena.addEventListener('click', function (e) {
      if (e.target === escena) cerrarVisor();
    });
    document.addEventListener('keydown', function (e) {
      if (visor.hidden) return;
      if (e.key === 'Escape') cerrarVisor();
      else if (e.key === 'ArrowLeft') mostrar(vI - 1);
      else if (e.key === 'ArrowRight') mostrar(vI + 1);
    });
    var x0 = null;
    escena.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    escena.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) mostrar(vI + (dx < 0 ? 1 : -1));
    });
  }

  function abrirVisor(caps, i, origen) {
    if (!visor) crearVisor();
    vCaps = caps;
    vOrigen = origen;
    visor.setAttribute('aria-label', es() ? 'Capturas a pantalla completa' : 'Full-screen screenshots');
    vPuntos.textContent = '';
    caps.forEach(function (_, k) {
      var d = boton('', (es() ? 'Captura ' : 'Screenshot ') + (k + 1), '');
      d.addEventListener('click', function () { mostrar(k); });
      vPuntos.append(d);
    });
    visor.hidden = false;
    document.documentElement.classList.add('visor-abierto');
    mostrar(i);
    visor.querySelector('.visor-cerrar').focus();
  }

  function mostrar(i) {
    vI = (i + vCaps.length) % vCaps.length;
    vImg.src = vCaps[vI];
    vImg.alt = (es() ? 'Captura ' : 'Screenshot ') + (vI + 1) + ' / ' + vCaps.length;
    vCuenta.textContent = vI + 1 + ' / ' + vCaps.length;
    for (var k = 0; k < vPuntos.children.length; k++) {
      vPuntos.children[k].setAttribute('aria-current', String(k === vI));
    }
  }

  function cerrarVisor() {
    visor.hidden = true;
    document.documentElement.classList.remove('visor-abierto');
    if (vOrigen) vOrigen.focus();
  }

  // ---------------------------------------------------------------- tráiler
  function cargarVideo(e) {
    var a = e.currentTarget;
    e.preventDefault();
    var marco = document.createElement('iframe');
    marco.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.youtube +
      '?autoplay=1&playsinline=1&rel=0';
    marco.title = a.getAttribute('aria-label');
    marco.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    marco.allowFullscreen = true;
    marco.className = 'video';
    marco.setAttribute('lang', a.getAttribute('lang'));
    marco.dataset.enlace = a.outerHTML;
    a.replaceWith(marco);
  }

  function prepararVideos() {
    document.querySelectorAll('a.video[data-youtube]:not([data-listo])').forEach(function (a) {
      a.dataset.listo = '';
      a.addEventListener('click', cargarVideo);
    });
  }

  // Un reproductor del idioma que se oculta seguiría sonando: vuelve a ser póster.
  function reiniciarVideos() {
    document.querySelectorAll('iframe.video').forEach(function (marco) {
      var tmp = document.createElement('div');
      tmp.innerHTML = marco.dataset.enlace;
      delete tmp.firstChild.dataset.listo;
      marco.replaceWith(tmp.firstChild);
    });
    prepararVideos();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.carrusel').forEach(montarCarrusel);
    prepararVideos();
    new MutationObserver(function () {
      reiniciarVideos();
      carruseles.forEach(function (rehacer) { rehacer(); });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
})();

(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu do celular: fecha ao tocar numa opção, fora dele ou no Esc */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var scrim = document.getElementById('scrim');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    scrim.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  scrim.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 992) setMenu(false); });

  /* barra de progresso */
  var bar = document.querySelector('.progress');
  var tick = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', h > 0 ? Math.min(1, window.pageYOffset / h).toFixed(4) : 0);
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* revelar ao rolar */
  /* tudo que já entrou na tela (ou ficou acima dela) aparece; conferido a cada rolagem */
  var items = [].slice.call(document.querySelectorAll('[data-r]'));
  function reveal() {
    var lim = window.innerHeight * 0.94;
    items = items.filter(function (el) {
      if (el.getBoundingClientRect().top < lim) { el.classList.add('in'); return false; }
      return true;
    });
  }
  if (reduce) { items.forEach(function (el) { el.classList.add('in'); }); items = []; }
  var rt = false;
  window.addEventListener('scroll', function () { if (!rt) { rt = true; requestAnimationFrame(function () { reveal(); rt = false; }); } }, { passive: true });
  window.addEventListener('resize', reveal);
  window.addEventListener('load', reveal);
  reveal();

  /* brilho que segue o mouse nos cartões */
  document.querySelectorAll('.feat').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* seção atual no menu do computador */
  var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) so.observe(s); });
  }
})();

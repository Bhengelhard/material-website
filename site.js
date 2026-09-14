/* Material · site behaviour
   The nav on small screens, the header that frosts once the page
   scrolls and turns light once the dark hero has scrolled away,
   and the reveals. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Header: on small screens the nav folds into the hamburger
     ------------------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    var setNav = function (open) {
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };
    navToggle.addEventListener('click', function () { setNav(navToggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.site-header')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Esc') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setNav(false); });
  }

  /* the header floats clear over the top of the hero, frosts dark once
     the page has scrolled, and turns light everywhere after the hero;
     pages without a hero start light */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  var tick = false;
  function headerTone() {
    tick = false;
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    if (!hero) { header.classList.add('is-light'); return; }
    header.classList.toggle('is-light', hero.getBoundingClientRect().bottom <= header.offsetHeight + 1);
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(headerTone); } }, { passive: true });
  window.addEventListener('resize', headerTone);
  headerTone();

  /* ------------------------------------------------------------
     Reveals: each .r rises once when it enters the screen
     ------------------------------------------------------------ */
  var items = document.querySelectorAll('.r');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }
})();

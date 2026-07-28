/* BCA Lux — builds the glassy mobile menu and keeps the nav auto-fit.
   One shared file on every page. Moves the existing language chips + CTA
   into the menu on mobile (preserving their handlers) and back on desktop. */
(function () {
  var nav = document.querySelector('nav');
  if (!nav || document.getElementById('lux-menu')) return;
  var right = nav.querySelector('.nav-right') || nav.querySelector('.nav-inner') || nav;

  var LINKS = [
    ['Home', 'index.html'], ['Why BCA', 'why-bca.html'], ['The Bench', 'the-bench.html'],
    ['Membership', 'membership.html'], ['Coaching', 'coaching-packages.html'], ['Services', 'services.html'],
    ['BCAOnline', 'bca-online.html'], ['Board & Governance', 'governance.html'], ['Insights', 'insights.html']
  ];
  var SUB = [['Podcast', 'podcast.html'], ['Programs', 'programs.html'], ['Sponsorship', 'sponsorship.html'], ['Shop', 'shop.html']];

  // hamburger
  var burger = document.createElement('button');
  burger.className = 'lux-burger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<i></i>';
  right.appendChild(burger);

  // menu shell
  var menu = document.createElement('div');
  menu.id = 'lux-menu';
  var inner = document.createElement('div');
  inner.className = 'lux-inner';
  menu.appendChild(inner);

  var here = (location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html');
  if (here.indexOf('.') === -1) here += '.html';
  LINKS.forEach(function (l) {
    var a = document.createElement('a');
    a.className = 'lux-link'; a.href = l[1]; a.textContent = l[0];
    if (l[1] === here || (here === 'index.html' && l[1] === 'index.html')) a.style.color = 'var(--lux-gold)';
    inner.appendChild(a);
  });
  var sub = document.createElement('div');
  sub.className = 'lux-sub';
  SUB.forEach(function (l, i) {
    var a = document.createElement('a'); a.href = l[1]; a.textContent = l[0];
    sub.appendChild(a);
    if (i < SUB.length - 1) sub.appendChild(document.createTextNode('  ·  '));
  });
  inner.appendChild(sub);

  var tools = document.createElement('div');
  tools.className = 'lux-tools';
  inner.appendChild(tools);
  document.body.appendChild(menu);

  // relocate the real language chips + CTA between bar and menu by breakpoint
  var lang = nav.querySelector('.lang');
  var cta = right.querySelector(':scope > .btn') || nav.querySelector('.nav-inner > .btn');
  var mq = window.matchMedia('(max-width:1080px)');
  function place() {
    if (mq.matches) {
      if (cta && cta.parentNode !== tools) tools.appendChild(cta);
      if (lang && lang.parentNode !== tools) tools.appendChild(lang);
    } else {
      if (cta && cta.parentNode !== right) right.appendChild(cta);
      if (lang && lang.parentNode !== right) right.insertBefore(lang, right.firstChild);
    }
  }
  place();
  if (mq.addEventListener) mq.addEventListener('change', place); else if (mq.addListener) mq.addListener(place);

  function close() { document.body.classList.remove('lux-open'); burger.setAttribute('aria-expanded', 'false'); }
  function toggle() {
    var open = document.body.classList.toggle('lux-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', toggle);
  menu.addEventListener('click', function (e) {
    var t = e.target;
    if (t.classList.contains('lux-link') || (t.closest && t.closest('.lux-sub a')) || t.classList.contains('btn')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

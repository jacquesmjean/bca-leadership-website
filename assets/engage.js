/* BCA Auto-Engage (TechFides) — tasteful, page-aware re-engagement.
   Fires ONE dismissible nudge per session, on the first of: 25s dwell, 55% scroll,
   or exit-intent. Points the visitor to the concierge. Never nags: once shown or
   dismissed, or once the concierge is opened, it stays quiet for the session. */
(function () {
  try { if (sessionStorage.getItem('bca_engaged')) return; } catch (e) {}
  var btn = null, shown = false, done = false;
  var SETTINGS = "https://kdkecrdhjwztrksrgdnr.supabase.co/functions/v1/bca-settings";
  var CFG = { enabled: true, delaySeconds: 25, scrollPct: 55, exitIntent: true }; // fallback; ServiceDesk can override

  var MSG = {
    en: {
      def: { t: "Questions about BCA?", s: "Ask the concierge. It answers in seconds." },
      membership: { t: "Comparing membership tiers?", s: "I can help you pick the right one in under a minute." },
      "the-bench": { t: "Looking for a coach in your market?", s: "Search 45 coaches by country, sector, or name." },
      "coaching-packages": { t: "Not sure which coaching package?", s: "Tell me your goal and I will point you to the right one." },
      services: { t: "Have a project or engagement in mind?", s: "Tell me what you need and I will guide the next step." },
      "why-bca": { t: "Wondering if BCA is your room?", s: "Ask me anything. I know the full picture." },
      exit: { t: "Before you go", s: "One question answered now could save you an email. Ask the concierge." },
      cta: "Ask the concierge"
    },
    fr: {
      def: { t: "Des questions sur BCA ?", s: "Demandez à la conciergerie. Réponse en quelques secondes." },
      membership: { t: "Vous comparez les formules ?", s: "Je vous aide à choisir en moins d'une minute." },
      "the-bench": { t: "Vous cherchez un coach dans votre marché ?", s: "Cherchez parmi 45 coachs par pays, secteur ou nom." },
      "coaching-packages": { t: "Hésitant sur le forfait coaching ?", s: "Dites-moi votre objectif et je vous oriente." },
      services: { t: "Un projet en tête ?", s: "Dites-moi ce qu'il vous faut et je vous guide." },
      "why-bca": { t: "BCA est-il votre salle ?", s: "Demandez-moi ce que vous voulez." },
      exit: { t: "Avant de partir", s: "Une réponse maintenant vous évite un email. Demandez à la conciergerie." },
      cta: "Demander à la conciergerie"
    },
    es: {
      def: { t: "¿Preguntas sobre BCA?", s: "Pregunte al concierge. Responde en segundos." },
      membership: { t: "¿Comparando membresías?", s: "Le ayudo a elegir en menos de un minuto." },
      "the-bench": { t: "¿Busca un coach en su mercado?", s: "Busque entre 45 coaches por país, sector o nombre." },
      "coaching-packages": { t: "¿Duda sobre el paquete?", s: "Dígame su objetivo y le oriento." },
      services: { t: "¿Tiene un proyecto en mente?", s: "Dígame qué necesita y le guío." },
      "why-bca": { t: "¿Es BCA su sala?", s: "Pregúnteme lo que quiera." },
      exit: { t: "Antes de irse", s: "Una respuesta ahora le ahorra un email. Pregunte al concierge." },
      cta: "Preguntar al concierge"
    },
    pt: {
      def: { t: "Perguntas sobre a BCA?", s: "Pergunte ao concierge. Responde em segundos." },
      membership: { t: "A comparar adesões?", s: "Ajudo-o a escolher em menos de um minuto." },
      "the-bench": { t: "Procura um coach no seu mercado?", s: "Pesquise 45 coaches por país, setor ou nome." },
      "coaching-packages": { t: "Em dúvida sobre o pacote?", s: "Diga-me o seu objetivo e oriento-o." },
      services: { t: "Tem um projeto em mente?", s: "Diga-me o que precisa e eu guio-o." },
      "why-bca": { t: "A BCA é a sua sala?", s: "Pergunte-me o que quiser." },
      exit: { t: "Antes de sair", s: "Uma resposta agora poupa-lhe um email. Pergunte ao concierge." },
      cta: "Perguntar ao concierge"
    }
  };
  function lang() { var l = (document.documentElement.lang || "en").slice(0, 2).toLowerCase(); return MSG[l] ? l : "en"; }
  function pageKey() {
    var p = location.pathname.replace(/\/$/, "").split("/").pop().replace(".html", "");
    return p || "index";
  }

  var css = document.createElement("style");
  css.textContent =
    "#bca-nudge{position:fixed;bottom:88px;right:26px;z-index:95;max-width:300px;background:#fff;border:1px solid rgba(36,23,12,.14);border-top:4px solid #F7A61C;box-shadow:0 18px 44px rgba(36,23,12,.28);padding:18px 20px 16px;font-family:'Jost',Helvetica,sans-serif;opacity:0;transform:translateY(10px);transition:.4s;pointer-events:none}" +
    "#bca-nudge.on{opacity:1;transform:translateY(0);pointer-events:auto}" +
    "#bca-nudge .x{position:absolute;top:8px;right:11px;background:none;border:none;font-size:19px;color:#8a8177;cursor:pointer;line-height:1}" +
    "#bca-nudge .t{font-family:'Marcellus',serif;font-size:17px;color:#24170C;margin:0 14px 5px 0;line-height:1.2}" +
    "#bca-nudge .s{font-size:13.5px;color:rgba(36,36,36,.66);line-height:1.45;margin-bottom:13px}" +
    "#bca-nudge .go{display:inline-flex;align-items:center;gap:7px;background:#058D52;color:#fff;border:none;font-family:'Jost',sans-serif;font-size:12.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;padding:9px 15px;cursor:pointer;transition:.2s}" +
    "#bca-nudge .go:hover{background:#23A455}" +
    "@keyframes bcaPulse{0%,100%{box-shadow:0 8px 24px rgba(36,23,12,.35)}50%{box-shadow:0 8px 24px rgba(36,23,12,.35),0 0 0 8px rgba(247,166,28,.25)}}" +
    ".bca-cg-pulse{animation:bcaPulse 1.6s ease-in-out 3}" +
    "@media(prefers-reduced-motion:reduce){.bca-cg-pulse{animation:none}#bca-nudge{transition:opacity .3s}}" +
    "@media(max-width:560px){#bca-nudge{right:12px;left:12px;max-width:none;bottom:78px}}";
  document.head.appendChild(css);

  function mark() { try { sessionStorage.setItem('bca_engaged', '1'); } catch (e) {} done = true; }

  function show(kind) {
    if (shown || done) return;
    btn = document.getElementById('bca-cg-btn');
    if (!btn) return;
    shown = true;
    var m = MSG[lang()];
    var c = (kind === 'exit') ? m.exit : (m[pageKey()] || m.def);
    var n = document.createElement('div');
    n.id = 'bca-nudge';
    n.innerHTML = '<button class="x" aria-label="Dismiss">×</button><div class="t"></div><div class="s"></div><button class="go"></button>';
    n.querySelector('.t').textContent = c.t;
    n.querySelector('.s').textContent = c.s;
    n.querySelector('.go').textContent = m.cta;
    document.body.appendChild(n);
    requestAnimationFrame(function () { n.classList.add('on'); });
    btn.classList.add('bca-cg-pulse');
    n.querySelector('.go').addEventListener('click', function () { mark(); n.remove(); btn.click(); });
    n.querySelector('.x').addEventListener('click', function () { mark(); n.classList.remove('on'); setTimeout(function () { n.remove(); }, 300); });
    // auto-retract if ignored for a while (stays quiet after)
    setTimeout(function () { if (document.getElementById('bca-nudge')) { n.classList.remove('on'); setTimeout(function(){ if(n.parentNode) n.remove(); }, 400); } }, 14000);
  }

  // If the visitor opens the concierge themselves, stay quiet.
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#bca-cg-btn');
    if (b) mark();
  }, true);

  // Wire the triggers using whatever config we end up with (remote or fallback).
  function arm() {
    if (!CFG || CFG.enabled === false) return; // ServiceDesk can switch auto-engage off entirely.

    var delayMs = Math.max(3, +CFG.delaySeconds || 25) * 1000;
    var scrollAt = Math.min(0.95, Math.max(0.10, (+CFG.scrollPct || 55) / 100));

    // Trigger 1: dwell
    setTimeout(function () { show('dwell'); }, delayMs);

    // Trigger 2: scroll depth
    function onScroll() {
      var h = document.documentElement;
      var d = (h.scrollTop || document.body.scrollTop);
      var max = (h.scrollHeight - h.clientHeight) || 1;
      if (d / max > scrollAt) { window.removeEventListener('scroll', onScroll); show('scroll'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Trigger 3: exit intent (desktop) / fast scroll-up (mobile)
    if (CFG.exitIntent !== false) {
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0) show('exit');
      });
      var lastY = 0, upStart = 0;
      window.addEventListener('scroll', function () {
        var y = window.scrollY || 0;
        if (y < lastY) { if (!upStart) upStart = lastY; if (upStart - y > 500 && y < 300) show('exit'); }
        else { upStart = 0; }
        lastY = y;
      }, { passive: true });
    }
  }

  // Fetch the live config once per session; fall back to defaults on any hiccup.
  function boot() {
    var cached = null;
    try { cached = sessionStorage.getItem('bca_engage_cfg'); } catch (e) {}
    if (cached) {
      try { CFG = JSON.parse(cached); } catch (e) {}
      return arm();
    }
    var settled = false;
    var t = setTimeout(function () { if (!settled) { settled = true; arm(); } }, 1500);
    try {
      fetch(SETTINGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get' })
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (d && d.engage) {
            CFG = d.engage;
            try { sessionStorage.setItem('bca_engage_cfg', JSON.stringify(CFG)); } catch (e) {}
          }
        })
        .catch(function () {})
        .then(function () { if (!settled) { settled = true; clearTimeout(t); arm(); } });
    } catch (e) { if (!settled) { settled = true; clearTimeout(t); arm(); } }
  }

  boot();
})();

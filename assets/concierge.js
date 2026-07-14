/* BCA Intelligent Concierge (TechFides) — self-serve, full-catalog, 4 languages.
   Chat brain: bca-concierge-chat edge function (Claude when ANTHROPIC_API_KEY is set,
   deterministic catalog engine otherwise). Actions deep-link into the signing flows.
   Unresolved needs are recorded via bca-concierge and appear on the ServiceDesk. */
(function () {
  var CHAT = "https://kdkecrdhjwztrksrgdnr.supabase.co/functions/v1/bca-concierge-chat";
  var LOG = "https://kdkecrdhjwztrksrgdnr.supabase.co/functions/v1/bca-concierge";

  var STR = {
    en: { btn: "Concierge", h: "BCA Concierge", sub: "Ask anything: membership, coaching, consulting, MLC, sponsorship. I can set you up right here.", ph: "Type your question…", send: "Send", chips: ["Become a member", "Start coaching", "Consulting for my company", "Attend or sponsor MLC"], greet: "Welcome to BCA Leadership. I can help you join as a member, start executive coaching, engage our consultants, sponsor, or attend the Made in Africa Leadership Conference. What do you need?", hoIntro: "Leave your details and the full conversation goes to our team.", hoName: "Full name", hoEmail: "Email", hoSend: "Send to the team", hoOk: "Done. Your request and this conversation are with our team.", hoErr: "That did not go through. Please try again or email admin@bcaleadership.com.", human: "Talk to the team", err: "I lost the connection for a second. Please try again." },
    fr: { btn: "Conciergerie", h: "Conciergerie BCA", sub: "Demandez ce que vous voulez : adhésion, coaching, conseil, MLC, sponsoring. Je peux tout mettre en place ici.", ph: "Écrivez votre question…", send: "Envoyer", chips: ["Devenir membre", "Démarrer un coaching", "Conseil pour mon entreprise", "Participer ou sponsoriser le MLC"], greet: "Bienvenue chez BCA Leadership. Je peux vous aider à devenir membre, démarrer un coaching exécutif, engager nos consultants, sponsoriser ou participer à la Made in Africa Leadership Conference. Que vous faut-il ?", hoIntro: "Laissez vos coordonnées et toute la conversation part à notre équipe.", hoName: "Nom complet", hoEmail: "Email", hoSend: "Envoyer à l'équipe", hoOk: "C'est fait. Votre demande et cette conversation sont chez notre équipe.", hoErr: "L'envoi a échoué. Réessayez ou écrivez à admin@bcaleadership.com.", human: "Parler à l'équipe", err: "J'ai perdu la connexion un instant. Réessayez." },
    es: { btn: "Concierge", h: "Concierge BCA", sub: "Pregunte lo que quiera: membresía, coaching, consultoría, MLC, patrocinio. Puedo dejarlo todo listo aquí.", ph: "Escriba su pregunta…", send: "Enviar", chips: ["Hacerme miembro", "Empezar coaching", "Consultoría para mi empresa", "Asistir o patrocinar el MLC"], greet: "Bienvenido a BCA Leadership. Puedo ayudarle a hacerse miembro, empezar coaching ejecutivo, contratar consultores, patrocinar o asistir a la Made in Africa Leadership Conference. ¿Qué necesita?", hoIntro: "Deje sus datos y la conversación completa irá a nuestro equipo.", hoName: "Nombre completo", hoEmail: "Email", hoSend: "Enviar al equipo", hoOk: "Listo. Su solicitud y esta conversación están con nuestro equipo.", hoErr: "No se pudo enviar. Inténtelo de nuevo o escriba a admin@bcaleadership.com.", human: "Hablar con el equipo", err: "Perdí la conexión un momento. Inténtelo de nuevo." },
    pt: { btn: "Concierge", h: "Concierge BCA", sub: "Pergunte o que quiser: adesão, coaching, consultoria, MLC, patrocínio. Posso deixar tudo pronto aqui.", ph: "Escreva a sua pergunta…", send: "Enviar", chips: ["Tornar-me membro", "Começar coaching", "Consultoria para a minha empresa", "Participar ou patrocinar o MLC"], greet: "Bem-vindo à BCA Leadership. Posso ajudá-lo a tornar-se membro, começar coaching executivo, contratar consultores, patrocinar ou participar na Made in Africa Leadership Conference. O que precisa?", hoIntro: "Deixe os seus dados e a conversa completa segue para a nossa equipa.", hoName: "Nome completo", hoEmail: "Email", hoSend: "Enviar à equipa", hoOk: "Feito. O seu pedido e esta conversa estão com a nossa equipa.", hoErr: "Não foi possível enviar. Tente novamente ou escreva para admin@bcaleadership.com.", human: "Falar com a equipa", err: "Perdi a ligação por um momento. Tente novamente." }
  };
  function lang() { var l = (document.documentElement.lang || "en").slice(0, 2).toLowerCase(); return STR[l] ? l : "en"; }
  function T() { return STR[lang()]; }

  var css = document.createElement("style");
  css.textContent =
    "#bca-cg-btn{position:fixed;bottom:26px;left:26px;z-index:96;display:inline-flex;align-items:center;gap:9px;background:#24170C;color:#F7A61C;border:1px solid rgba(247,166,28,.45);padding:12px 20px;font-family:'Jost',Helvetica,sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:999px;box-shadow:0 8px 24px rgba(36,23,12,.35);transition:.25s}" +
    "#bca-cg-btn:hover{transform:translateY(-2px);background:#F7A61C;color:#24170C}" +
    "#bca-cg-veil{position:fixed;inset:0;background:rgba(33,16,18,.55);backdrop-filter:blur(4px);z-index:160;display:none}" +
    "#bca-cg-veil.open{display:block}" +
    "#bca-cg{position:fixed;bottom:24px;left:24px;z-index:161;width:400px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 48px);background:#FAF6EE;display:none;flex-direction:column;border-top:5px solid #F7A61C;box-shadow:0 24px 64px rgba(36,23,12,.45);font-family:'Jost',Helvetica,sans-serif}" +
    "#bca-cg.open{display:flex}" +
    "#bca-cg .head{padding:18px 20px 14px;border-bottom:1px solid rgba(36,23,12,.12);position:relative;background:#24170C}" +
    "#bca-cg .head h3{font-family:'Marcellus',serif;font-weight:400;font-size:19px;color:#FAF6EE;margin:0}" +
    "#bca-cg .head p{font-size:12.5px;color:rgba(250,246,238,.65);margin:5px 0 0;line-height:1.4}" +
    "#bca-cg .x{position:absolute;top:10px;right:14px;background:none;border:none;font-size:24px;color:rgba(250,246,238,.7);cursor:pointer;line-height:1}" +
    "#bca-cg .log{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:10px}" +
    "#bca-cg .msg{max-width:86%;padding:11px 14px;font-size:14.5px;line-height:1.5;color:#242424}" +
    "#bca-cg .msg.bot{background:#fff;border:1px solid rgba(36,23,12,.12);align-self:flex-start;border-radius:2px 12px 12px 12px}" +
    "#bca-cg .msg.me{background:#058D52;color:#fff;align-self:flex-end;border-radius:12px 2px 12px 12px}" +
    "#bca-cg .msg.typing{color:rgba(36,36,36,.5);font-style:italic}" +
    "#bca-cg .act{align-self:flex-start;display:inline-block;background:#F7A61C;color:#24170C;text-decoration:none;padding:11px 18px;font-size:12.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;border-radius:3px;transition:.2s;border:1px solid #F7A61C}" +
    "#bca-cg .act:hover{background:transparent;color:#8a5c00}" +
    "#bca-cg .chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start}" +
    "#bca-cg .chip{background:transparent;border:1px solid rgba(5,141,82,.5);color:#058D52;padding:8px 13px;font-family:'Jost',sans-serif;font-size:12.5px;border-radius:999px;cursor:pointer;transition:.2s}" +
    "#bca-cg .chip:hover{background:#058D52;color:#fff}" +
    "#bca-cg .bar{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(36,23,12,.12);background:#fff}" +
    "#bca-cg .bar input{flex:1;padding:11px 13px;border:1px solid rgba(36,23,12,.18);background:#FAF6EE;font-family:'Jost',sans-serif;font-size:14.5px;outline:none}" +
    "#bca-cg .bar input:focus{border-color:#058D52}" +
    "#bca-cg .bar button{background:#058D52;color:#fff;border:none;padding:0 18px;font-family:'Jost',sans-serif;font-size:13px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;cursor:pointer}" +
    "#bca-cg .bar button:hover{background:#23A455}" +
    "#bca-cg .ho{align-self:flex-start;background:#fff;border:1px solid rgba(36,23,12,.12);padding:14px;border-radius:2px 12px 12px 12px;width:86%}" +
    "#bca-cg .ho p{font-size:13px;color:rgba(36,36,36,.7);margin:0 0 10px;line-height:1.45}" +
    "#bca-cg .ho input{width:100%;box-sizing:border-box;margin-bottom:8px;padding:10px 12px;border:1px solid rgba(36,23,12,.18);background:#FAF6EE;font-family:'Jost',sans-serif;font-size:14px;outline:none}" +
    "#bca-cg .ho button{width:100%;background:#F7A61C;border:none;color:#24170C;padding:11px;font-family:'Jost',sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;cursor:pointer}" +
    "#bca-cg .hint{align-self:center;font-size:11.5px;color:rgba(36,36,36,.4);cursor:pointer;text-decoration:underline;background:none;border:none;font-family:'Jost',sans-serif;margin-top:2px}" +
    "@media(max-width:560px){#bca-cg{bottom:0;left:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh}#bca-cg-btn{bottom:20px;left:16px;padding:11px 16px}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "bca-cg-btn"; btn.type = "button";
  btn.innerHTML = '<span style="font-size:15px">✦</span><span id="bca-cg-btn-t"></span>';
  document.body.appendChild(btn);

  var veil = document.createElement("div"); veil.id = "bca-cg-veil"; document.body.appendChild(veil);
  var box = document.createElement("div");
  box.id = "bca-cg";
  box.innerHTML =
    '<div class="head"><h3></h3><p></p><button class="x" type="button" aria-label="Close">×</button></div>' +
    '<div class="log" id="cg-log"></div>' +
    '<div class="bar"><input id="cg-in" type="text" autocomplete="off"><button id="cg-send" type="button"></button></div>';
  document.body.appendChild(box);

  var history = [];   // {role, content}
  var started = false;
  var handedOff = false;

  function paint() {
    var t = T();
    document.getElementById("bca-cg-btn-t").textContent = t.btn;
    box.querySelector(".head h3").textContent = t.h;
    box.querySelector(".head p").textContent = t.sub;
    document.getElementById("cg-in").placeholder = t.ph;
    document.getElementById("cg-send").textContent = t.send;
  }

  function log() { return document.getElementById("cg-log"); }
  function scroll() { var l = log(); l.scrollTop = l.scrollHeight; }
  function addMsg(cls, text) {
    var d = document.createElement("div");
    d.className = "msg " + cls; d.textContent = text;
    log().appendChild(d); scroll(); return d;
  }
  function addAction(a) {
    var el = document.createElement("a");
    el.className = "act"; el.href = a.href; el.textContent = a.label + " →";
    log().appendChild(el); scroll();
  }
  function addHumanHint() {
    if (handedOff) return;
    var b = document.createElement("button");
    b.className = "hint"; b.type = "button"; b.textContent = T().human;
    b.addEventListener("click", function () { b.remove(); showHandoff(); });
    log().appendChild(b); scroll();
  }
  function addChips() {
    var t = T();
    var wrap = document.createElement("div"); wrap.className = "chips";
    t.chips.forEach(function (c) {
      var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = c;
      b.addEventListener("click", function () { wrap.remove(); sendText(c); });
      wrap.appendChild(b);
    });
    log().appendChild(wrap); scroll();
  }

  function showHandoff() {
    if (handedOff) return; handedOff = true;
    var t = T();
    var d = document.createElement("div"); d.className = "ho";
    d.innerHTML = '<p></p><input class="ho-n" type="text"><input class="ho-e" type="email"><button type="button"></button>';
    d.querySelector("p").textContent = t.hoIntro;
    d.querySelector(".ho-n").placeholder = t.hoName;
    d.querySelector(".ho-e").placeholder = t.hoEmail;
    var sb = d.querySelector("button"); sb.textContent = t.hoSend;
    sb.addEventListener("click", function () {
      var n = d.querySelector(".ho-n").value.trim(), e = d.querySelector(".ho-e").value.trim();
      if (!n) { d.querySelector(".ho-n").focus(); return; }
      if (!e || e.indexOf("@") < 1) { d.querySelector(".ho-e").focus(); return; }
      sb.disabled = true; sb.style.opacity = .6;
      var transcript = history.map(function (m) { return (m.role === "user" ? "Visitor: " : "Concierge: ") + m.content; }).join("\n");
      fetch(LOG, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: n, email: e, topic: "Concierge chat", message: transcript.slice(0, 3900) || "(no transcript)", page: location.href }) })
        .then(function (r) {
          sb.disabled = false; sb.style.opacity = 1;
          d.remove(); handedOff = r.ok ? true : false;
          addMsg("bot", r.ok ? t.hoOk : t.hoErr);
        }).catch(function () { sb.disabled = false; sb.style.opacity = 1; addMsg("bot", t.hoErr); handedOff = false; });
    });
    log().appendChild(d); scroll();
  }

  var busy = false;
  function sendText(text) {
    if (busy || !text) return;
    busy = true;
    addMsg("me", text);
    history.push({ role: "user", content: text });
    var typing = addMsg("bot typing", "…");
    fetch(CHAT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-10), lang: lang(), page: location.href }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        typing.remove(); busy = false;
        var reply = data.reply || T().err;
        addMsg("bot", reply);
        history.push({ role: "assistant", content: reply });
        if (data.action) addAction(data.action);
        if (data.handoff) showHandoff(); else addHumanHint();
      })
      .catch(function () { typing.remove(); busy = false; addMsg("bot", T().err); });
  }

  function open() {
    paint();
    veil.classList.add("open"); box.classList.add("open");
    if (!started) {
      started = true;
      var g = T().greet;
      addMsg("bot", g);
      history.push({ role: "assistant", content: g });
      addChips();
    }
    document.getElementById("cg-in").focus();
  }
  function close() { veil.classList.remove("open"); box.classList.remove("open"); }

  btn.addEventListener("click", open);
  veil.addEventListener("click", close);
  box.querySelector(".x").addEventListener("click", close);
  document.getElementById("cg-send").addEventListener("click", function () {
    var i = document.getElementById("cg-in"); var v = i.value.trim();
    if (v) { i.value = ""; sendText(v); }
  });
  document.getElementById("cg-in").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var v = this.value.trim(); if (v) { this.value = ""; sendText(v); } }
  });
  paint();
})();

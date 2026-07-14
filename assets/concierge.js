/* BCA Concierge — sitewide request widget (TechFides).
   Any request from a potential client is recorded and routed to the ServiceDesk;
   an email alert to admin@bcaleadership.com activates once RESEND_API_KEY is set. */
(function () {
  var ENDPOINT = "https://kdkecrdhjwztrksrgdnr.supabase.co/functions/v1/bca-concierge";

  var STR = {
    en: { btn: "Concierge", h: "How can we help?", sub: "Membership, coaching, consulting, events, sponsorship: tell us what you need and the right person will come back to you.", name: "Full name", email: "Email", company: "Company (optional)", topic: "Topic", msg: "Your request", send: "Send request", topics: ["Membership", "Coaching", "Consulting", "Events & MLC", "Sponsorship", "Other"], ok: "Received. Your request is with our team, and you will hear from us shortly.", err: "We could not send that just now. Please try again or email admin@bcaleadership.com." },
    fr: { btn: "Conciergerie", h: "Comment pouvons-nous vous aider ?", sub: "Adhésion, coaching, conseil, événements, sponsoring : dites-nous ce qu'il vous faut et la bonne personne vous répondra.", name: "Nom complet", email: "Email", company: "Société (facultatif)", topic: "Sujet", msg: "Votre demande", send: "Envoyer la demande", topics: ["Adhésion", "Coaching", "Conseil", "Événements & MLC", "Sponsoring", "Autre"], ok: "Bien reçu. Votre demande est chez notre équipe, nous revenons vers vous rapidement.", err: "Envoi impossible pour le moment. Réessayez ou écrivez à admin@bcaleadership.com." },
    es: { btn: "Concierge", h: "¿Cómo podemos ayudarle?", sub: "Membresía, coaching, consultoría, eventos, patrocinio: díganos qué necesita y la persona indicada le responderá.", name: "Nombre completo", email: "Email", company: "Empresa (opcional)", topic: "Tema", msg: "Su solicitud", send: "Enviar solicitud", topics: ["Membresía", "Coaching", "Consultoría", "Eventos y MLC", "Patrocinio", "Otro"], ok: "Recibido. Su solicitud está con nuestro equipo y le responderemos pronto.", err: "No pudimos enviarlo. Inténtelo de nuevo o escriba a admin@bcaleadership.com." },
    pt: { btn: "Concierge", h: "Como podemos ajudar?", sub: "Adesão, coaching, consultoria, eventos, patrocínio: diga-nos o que precisa e a pessoa certa entrará em contacto.", name: "Nome completo", email: "Email", company: "Empresa (opcional)", topic: "Assunto", msg: "O seu pedido", send: "Enviar pedido", topics: ["Adesão", "Coaching", "Consultoria", "Eventos e MLC", "Patrocínio", "Outro"], ok: "Recebido. O seu pedido está com a nossa equipa e responderemos em breve.", err: "Não foi possível enviar. Tente novamente ou escreva para admin@bcaleadership.com." }
  };
  function lang() {
    var l = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return STR[l] ? l : "en";
  }

  var css = document.createElement("style");
  css.textContent =
    "#bca-cg-btn{position:fixed;bottom:26px;left:26px;z-index:96;display:inline-flex;align-items:center;gap:9px;background:#24170C;color:#F7A61C;border:1px solid rgba(247,166,28,.45);padding:12px 20px;font-family:'Jost',Helvetica,sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:999px;box-shadow:0 8px 24px rgba(36,23,12,.35);transition:.25s}" +
    "#bca-cg-btn:hover{transform:translateY(-2px);background:#F7A61C;color:#24170C}" +
    "#bca-cg-veil{position:fixed;inset:0;background:rgba(33,16,18,.7);backdrop-filter:blur(6px);z-index:160;display:none;align-items:center;justify-content:center;padding:24px}" +
    "#bca-cg-veil.open{display:flex}" +
    "#bca-cg{background:#FAF6EE;max-width:520px;width:100%;padding:38px 40px;position:relative;max-height:92vh;overflow:auto;border-top:6px solid #F7A61C}" +
    "#bca-cg .x{position:absolute;top:12px;right:16px;background:none;border:none;font-size:26px;color:#452C23;cursor:pointer;line-height:1}" +
    "#bca-cg h3{font-family:'Marcellus',serif;font-weight:400;font-size:24px;color:#24170C;margin:0 0 8px}" +
    "#bca-cg .sub{font-family:'Jost',sans-serif;font-size:14.5px;color:rgba(36,36,36,.65);margin:0 0 22px;line-height:1.5}" +
    "#bca-cg label{display:block;font-family:'Jost',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#452C23;margin:14px 0 6px}" +
    "#bca-cg input,#bca-cg select,#bca-cg textarea{width:100%;padding:12px 14px;border:1px solid rgba(36,23,12,.18);background:#fff;font-family:'Jost',sans-serif;font-size:15px;color:#242424;outline:none;box-sizing:border-box}" +
    "#bca-cg textarea{min-height:96px;resize:vertical}" +
    "#bca-cg input:focus,#bca-cg select:focus,#bca-cg textarea:focus{border-color:#058D52;box-shadow:0 0 0 3px rgba(5,141,82,.12)}" +
    "#bca-cg .send{width:100%;margin-top:20px;padding:14px;background:#F7A61C;border:1px solid #F7A61C;color:#24170C;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:.25s}" +
    "#bca-cg .send:hover{background:transparent;color:#8a5c00}" +
    "#bca-cg .note{display:none;font-family:'Jost',sans-serif;font-size:14px;margin-top:14px;line-height:1.5}" +
    "#bca-cg .note.ok{color:#058D52}#bca-cg .note.err{color:#C14027}" +
    "@media(max-width:560px){#bca-cg{padding:30px 22px}#bca-cg-btn{bottom:20px;left:16px;padding:11px 16px}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "bca-cg-btn";
  btn.type = "button";
  btn.innerHTML = '<span style="font-size:15px">✦</span><span id="bca-cg-btn-t"></span>';
  document.body.appendChild(btn);

  var veil = document.createElement("div");
  veil.id = "bca-cg-veil";
  veil.innerHTML =
    '<div id="bca-cg" role="dialog" aria-modal="true">' +
    '<button class="x" type="button" aria-label="Close">×</button>' +
    "<h3></h3><p class=\"sub\"></p>" +
    '<form novalidate>' +
    '<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">' +
    '<label data-k="name"></label><input id="cg-name" type="text" required>' +
    '<label data-k="email"></label><input id="cg-email" type="email" required>' +
    '<label data-k="company"></label><input id="cg-company" type="text">' +
    '<label data-k="topic"></label><select id="cg-topic"></select>' +
    '<label data-k="msg"></label><textarea id="cg-msg" required></textarea>' +
    '<button class="send" type="submit"></button>' +
    '<p class="note"></p>' +
    "</form></div>";
  document.body.appendChild(veil);

  function paint() {
    var t = STR[lang()];
    document.getElementById("bca-cg-btn-t").textContent = t.btn;
    veil.querySelector("h3").textContent = t.h;
    veil.querySelector(".sub").textContent = t.sub;
    veil.querySelectorAll("label[data-k]").forEach(function (l) { l.textContent = t[l.getAttribute("data-k")]; });
    veil.querySelector(".send").textContent = t.send;
    var sel = document.getElementById("cg-topic");
    sel.innerHTML = t.topics.map(function (o) { return "<option>" + o + "</option>"; }).join("");
  }
  paint();

  btn.addEventListener("click", function () { paint(); veil.classList.add("open"); document.body.style.overflow = "hidden"; });
  function close() { veil.classList.remove("open"); document.body.style.overflow = ""; }
  veil.querySelector(".x").addEventListener("click", close);
  veil.addEventListener("click", function (e) { if (e.target === veil) close(); });

  veil.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = STR[lang()];
    var note = veil.querySelector(".note");
    var name = document.getElementById("cg-name").value.trim();
    var email = document.getElementById("cg-email").value.trim();
    var msg = document.getElementById("cg-msg").value.trim();
    if (!name) { document.getElementById("cg-name").focus(); return; }
    if (!email || email.indexOf("@") < 1) { document.getElementById("cg-email").focus(); return; }
    if (!msg) { document.getElementById("cg-msg").focus(); return; }
    var sendBtn = veil.querySelector(".send");
    sendBtn.disabled = true; sendBtn.style.opacity = 0.6;
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: name, email: email,
        company: document.getElementById("cg-company").value.trim(),
        topic: document.getElementById("cg-topic").value,
        message: msg, page: location.href,
        website: veil.querySelector('input[name="website"]').value
      })
    }).then(function (r) {
      sendBtn.disabled = false; sendBtn.style.opacity = 1;
      note.style.display = "block";
      if (r.ok) {
        note.className = "note ok"; note.textContent = t.ok;
        veil.querySelector("form").reset();
        setTimeout(close, 3200);
      } else { note.className = "note err"; note.textContent = t.err; }
    }).catch(function () {
      sendBtn.disabled = false; sendBtn.style.opacity = 1;
      note.style.display = "block"; note.className = "note err"; note.textContent = t.err;
    });
  });
})();

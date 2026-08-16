/* BCA Leadership — sitewide i18n engine (TechFides)
   EN / FR / ES / PT.

   How it works
   ------------
   1. This file carries SHARED, which holds every string that repeats on
      every page: navigation, footer, legal links, common buttons.
   2. A page that has its own copy defines window.BCA_PAGE_I18N before
      loading this file. Those keys are merged on top of SHARED.
   3. Any element carrying data-t="some.key" gets its innerHTML replaced
      with the value for the active language.
   4. The chosen language is stored in localStorage under "bca-lang" and
      survives navigation between pages.

   GOTCHA (kept from the original build): the dictionary overwrites the
   innerHTML of every [data-t] element on load. Any new content therefore
   needs its key present in all four dictionaries, or it silently keeps
   whatever English is hardcoded in the markup. Missing keys are logged to
   the console in development.

   Pages built before this engine (index, membership, servicedesk) define
   their own setLang. This file detects that and stands down so the two
   engines never fight.
*/
(function () {
  "use strict";

  /* Legacy pages (index, membership, servicedesk) declare their dictionary as
     `const I18N = {...}` at the top level of a classic script. A top-level
     const does NOT become a property of window — it lives in the global
     lexical environment — so checking window.I18N misses it and this engine
     would wrongly take over their switcher. Look it up as a bare identifier. */
  function legacyDict() {
    try { return (typeof I18N !== "undefined" && I18N) ? I18N : null; } catch (e) { return null; }
  }
  var LEGACY = (typeof window.setLang === "function" && !!legacyDict());

  var SHARED = {
    en: {
      "nav.home": "Home",
      "nav.why": "Why BCA",
      "nav.coaches": "The Bench",
      "nav.membership": "Membership",
      "nav.coaching": "Coaching",
      "nav.services": "Services",
      "nav.online": "BCAOnline",
      "nav.governance": "Governance",
      "nav.insights": "Insights",
      "nav.programs": "Programs",
      "nav.podcast": "Podcast",
      "nav.shop": "Shop",
      "nav.sponsorship": "Sponsorship",
      "nav.cta": "Book a Consultation",
      "nav.search": "Search",

      "foot.rights": "© 2026 BCA Leadership. All rights reserved.",
      "foot.terms": "Terms of Use",
      "foot.privacy": "Privacy Policy",
      "foot.address": "BCA Leadership · Suite 113, First Floor, Grand Baie Business Park Phase 1, Grand Baie, Mauritius",
      "foot.powered": "Powered by TechFides",
      "foot.soon": "Coming soon",

      "cta.book": "Book a Consultation",
      "cta.member": "Explore Membership",
      "cta.packages": "See packages",
      "cta.talk": "Talk to the team",
      "cta.back": "← Back",
      "cta.next": "Continue →",
      "cta.more": "Learn more →",
      "cta.send": "Send",

      "form.name": "Full name",
      "form.email": "Work email",
      "form.company": "Company",
      "form.role": "Role",
      "form.country": "Country",
      "form.phone": "Phone",
      "form.message": "Message",
      "form.required": "Please fill in this field.",
      "form.bademail": "Please enter a valid email address.",
      "form.sending": "Sending…",
      "form.ok": "Request received. Our team will reply within one business day.",
      "form.err": "That did not go through. Please try again or email admin@bcaleadership.com.",

      "rt.selectcountry": "Select country",
      "rt.senderr": "We could not send that just now. Please try again or email <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.signerr": "We could not record your signature just now. Please try again, or email <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.reqsent": "Request sent. BCA will be in touch to schedule with ",

      "ct.h": "BCA Leadership Coaching Agreement",
      "ct.parties": "This Agreement is entered into between <b>BCA Leadership</b> and <b>{name}</b>{company}, of {country}.",
      "ct.billing": "<b>Billing address:</b> {addr}",
      "ct.package": "<b>Selected package:</b> {pkg} at <b>{price}</b>.",
      "ct.body": "BCA Leadership will deliver the coaching sessions of the selected package with a certified member of the BCA bench. Coaching is confidential. Payment is due per the invoice issued on countersignature.",
      "ct.sign": "By signing below, the Client accepts these terms and authorizes BCA Leadership to issue an invoice for the amount stated.",
      "ct.binding": "This agreement is shown in your language for convenience. The English version is the version you are signing and governs in the event of any discrepancy."
    },

    fr: {
      "nav.home": "Accueil",
      "nav.why": "Pourquoi BCA",
      "nav.coaches": "Nos Coachs",
      "nav.membership": "Adhésion",
      "nav.coaching": "Coaching",
      "nav.services": "Services",
      "nav.online": "BCAOnline",
      "nav.governance": "Gouvernance",
      "nav.insights": "Analyses",
      "nav.programs": "Programmes",
      "nav.podcast": "Podcast",
      "nav.shop": "Boutique",
      "nav.sponsorship": "Partenariat",
      "nav.cta": "Réserver une consultation",
      "nav.search": "Rechercher",

      "foot.rights": "© 2026 BCA Leadership. Tous droits réservés.",
      "foot.terms": "Conditions d'utilisation",
      "foot.privacy": "Politique de confidentialité",
      "foot.address": "BCA Leadership · Suite 113, First Floor, Grand Baie Business Park Phase 1, Grand Baie, Maurice",
      "foot.powered": "Propulsé par TechFides",
      "foot.soon": "Bientôt disponible",

      "cta.book": "Réserver une consultation",
      "cta.member": "Découvrir l'adhésion",
      "cta.packages": "Voir les formules",
      "cta.talk": "Parler à l'équipe",
      "cta.back": "← Retour",
      "cta.next": "Continuer →",
      "cta.more": "En savoir plus →",
      "cta.send": "Envoyer",

      "form.name": "Nom complet",
      "form.email": "E-mail professionnel",
      "form.company": "Entreprise",
      "form.role": "Fonction",
      "form.country": "Pays",
      "form.phone": "Téléphone",
      "form.message": "Message",
      "form.required": "Veuillez remplir ce champ.",
      "form.bademail": "Veuillez saisir une adresse e-mail valide.",
      "form.sending": "Envoi en cours…",
      "form.ok": "Demande reçue. Notre équipe vous répondra sous un jour ouvrable.",
      "form.err": "L'envoi a échoué. Merci de réessayer ou d'écrire à admin@bcaleadership.com.",

      "rt.selectcountry": "Choisissez un pays",
      "rt.senderr": "L'envoi a échoué. Merci de réessayer ou d'écrire à <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.signerr": "Nous n'avons pas pu enregistrer votre signature. Merci de réessayer ou d'écrire à <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.reqsent": "Demande envoyée. BCA vous contactera pour convenir d'un rendez-vous avec ",

      "ct.h": "Contrat de coaching BCA Leadership",
      "ct.parties": "Le présent contrat est conclu entre <b>BCA Leadership</b> et <b>{name}</b>{company}, domicilié(e) au {country}.",
      "ct.billing": "<b>Adresse de facturation :</b> {addr}",
      "ct.package": "<b>Formule retenue :</b> {pkg} au prix de <b>{price}</b>.",
      "ct.body": "BCA Leadership assurera les séances de coaching de la formule retenue avec un Coach certifié de son réseau. Le coaching est confidentiel. Le paiement est exigible selon la facture émise après contresignature.",
      "ct.sign": "En signant ci-dessous, le Client accepte les présentes conditions et autorise BCA Leadership à émettre une facture du montant indiqué.",
      "ct.binding": "Ce contrat vous est présenté en français à titre indicatif. La version anglaise est celle que vous signez et fait foi en cas de divergence."
    },

    es: {
      "nav.home": "Inicio",
      "nav.why": "Por qué BCA",
      "nav.coaches": "Nuestros Coaches",
      "nav.membership": "Membresía",
      "nav.coaching": "Coaching",
      "nav.services": "Servicios",
      "nav.online": "BCAOnline",
      "nav.governance": "Gobernanza",
      "nav.insights": "Análisis",
      "nav.programs": "Programas",
      "nav.podcast": "Podcast",
      "nav.shop": "Tienda",
      "nav.sponsorship": "Patrocinio",
      "nav.cta": "Reservar una consulta",
      "nav.search": "Buscar",

      "foot.rights": "© 2026 BCA Leadership. Todos los derechos reservados.",
      "foot.terms": "Condiciones de uso",
      "foot.privacy": "Política de privacidad",
      "foot.address": "BCA Leadership · Suite 113, First Floor, Grand Baie Business Park Phase 1, Grand Baie, Mauricio",
      "foot.powered": "Desarrollado por TechFides",
      "foot.soon": "Próximamente",

      "cta.book": "Reservar una consulta",
      "cta.member": "Conocer la membresía",
      "cta.packages": "Ver los paquetes",
      "cta.talk": "Hablar con el equipo",
      "cta.back": "← Volver",
      "cta.next": "Continuar →",
      "cta.more": "Saber más →",
      "cta.send": "Enviar",

      "form.name": "Nombre completo",
      "form.email": "Correo corporativo",
      "form.company": "Empresa",
      "form.role": "Cargo",
      "form.country": "País",
      "form.phone": "Teléfono",
      "form.message": "Mensaje",
      "form.required": "Por favor complete este campo.",
      "form.bademail": "Introduzca un correo electrónico válido.",
      "form.sending": "Enviando…",
      "form.ok": "Solicitud recibida. Nuestro equipo responderá en un día hábil.",
      "form.err": "No se pudo enviar. Inténtelo de nuevo o escriba a admin@bcaleadership.com.",

      "rt.selectcountry": "Seleccione un país",
      "rt.senderr": "No se pudo enviar. Inténtelo de nuevo o escriba a <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.signerr": "No pudimos registrar su firma en este momento. Inténtelo de nuevo o escriba a <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.reqsent": "Solicitud enviada. BCA se pondrá en contacto para agendar con ",

      "ct.h": "Contrato de coaching de BCA Leadership",
      "ct.parties": "El presente contrato se celebra entre <b>BCA Leadership</b> y <b>{name}</b>{company}, con domicilio en {country}.",
      "ct.billing": "<b>Dirección de facturación:</b> {addr}",
      "ct.package": "<b>Paquete seleccionado:</b> {pkg} por <b>{price}</b>.",
      "ct.body": "BCA Leadership impartirá las sesiones de coaching del paquete seleccionado con un coach certificado de su red. El coaching es confidencial. El pago vence según la factura emitida tras la contrafirma.",
      "ct.sign": "Al firmar a continuación, el Cliente acepta estas condiciones y autoriza a BCA Leadership a emitir una factura por el importe indicado.",
      "ct.binding": "Este contrato se muestra en español a título informativo. La versión en inglés es la que usted firma y prevalece en caso de discrepancia."
    },

    pt: {
      "nav.home": "Início",
      "nav.why": "Porquê a BCA",
      "nav.coaches": "Os Nossos Coaches",
      "nav.membership": "Adesão",
      "nav.coaching": "Coaching",
      "nav.services": "Serviços",
      "nav.online": "BCAOnline",
      "nav.governance": "Governação",
      "nav.insights": "Análises",
      "nav.programs": "Programas",
      "nav.podcast": "Podcast",
      "nav.shop": "Loja",
      "nav.sponsorship": "Patrocínio",
      "nav.cta": "Agendar uma consulta",
      "nav.search": "Pesquisar",

      "foot.rights": "© 2026 BCA Leadership. Todos os direitos reservados.",
      "foot.terms": "Termos de utilização",
      "foot.privacy": "Política de privacidade",
      "foot.address": "BCA Leadership · Suite 113, First Floor, Grand Baie Business Park Phase 1, Grand Baie, Maurícia",
      "foot.powered": "Desenvolvido pela TechFides",
      "foot.soon": "Em breve",

      "cta.book": "Agendar uma consulta",
      "cta.member": "Conhecer a adesão",
      "cta.packages": "Ver os pacotes",
      "cta.talk": "Falar com a equipa",
      "cta.back": "← Voltar",
      "cta.next": "Continuar →",
      "cta.more": "Saber mais →",
      "cta.send": "Enviar",

      "form.name": "Nome completo",
      "form.email": "E-mail profissional",
      "form.company": "Empresa",
      "form.role": "Cargo",
      "form.country": "País",
      "form.phone": "Telefone",
      "form.message": "Mensagem",
      "form.required": "Por favor preencha este campo.",
      "form.bademail": "Introduza um e-mail válido.",
      "form.sending": "A enviar…",
      "form.ok": "Pedido recebido. A nossa equipa responderá num dia útil.",
      "form.err": "Não foi possível enviar. Tente novamente ou escreva para admin@bcaleadership.com.",

      "rt.selectcountry": "Seleccione o país",
      "rt.senderr": "Não foi possível enviar. Tente novamente ou escreva para <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.signerr": "Não foi possível registar a sua assinatura neste momento. Tente novamente ou escreva para <a href=\"mailto:admin@bcaleadership.com\">admin@bcaleadership.com</a>.",
      "rt.reqsent": "Pedido enviado. A BCA entrará em contacto para agendar com ",

      "ct.h": "Contrato de coaching da BCA Leadership",
      "ct.parties": "O presente contrato é celebrado entre a <b>BCA Leadership</b> e <b>{name}</b>{company}, com domicílio em {country}.",
      "ct.billing": "<b>Morada de facturação:</b> {addr}",
      "ct.package": "<b>Pacote seleccionado:</b> {pkg} pelo valor de <b>{price}</b>.",
      "ct.body": "A BCA Leadership assegurará as sessões de coaching do pacote seleccionado com um coach certificado da sua rede. O coaching é confidencial. O pagamento é devido nos termos da factura emitida após a contra-assinatura.",
      "ct.sign": "Ao assinar abaixo, o Cliente aceita estas condições e autoriza a BCA Leadership a emitir uma factura pelo montante indicado.",
      "ct.binding": "Este contrato é apresentado em português a título informativo. A versão inglesa é aquela que assina e prevalece em caso de divergência."
    }
  };

  var LANGS = ["en", "fr", "es", "pt"];
  var PAGE = window.BCA_PAGE_I18N || {};
  var DICT = {};
  LANGS.forEach(function (l) {
    DICT[l] = Object.assign({}, SHARED[l] || {}, PAGE[l] || {});
  });

  window.BCA_I18N = DICT;

  /* Runtime lookup for strings that inline scripts generate (contract body,
     country lists, submit errors). Falls back to English, then to whatever
     the caller passed, so a missing key can never blank out a message.
     Works on legacy pages too — those keep their own setLang but still get t(). */
  window.t = function (key, fallback, vars) {
    var l = "en";
    try { l = localStorage.getItem("bca-lang") || "en"; } catch (e) {}
    var lg = legacyDict();
    var s = (DICT[l] && DICT[l][key]);
    if (s === undefined && lg && lg[l]) s = lg[l][key];
    if (s === undefined) s = DICT.en[key];
    if (s === undefined) s = (fallback !== undefined ? fallback : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(vars[k]);
      });
    }
    return s;
  };

  /* Country <select> elements are filled by inline page scripts. Re-label the
     placeholder option whenever the language changes. Country names themselves
     stay in English: they are submitted as data and BCA's records key on them. */
  function relabelCountrySelects() {
    document.querySelectorAll("select[data-countries] option[value='']").forEach(function (o) {
      o.textContent = window.t("rt.selectcountry", "Select country");
    });
  }
  document.addEventListener("bca:lang", relabelCountrySelects);
  window.BCA_relabelCountries = relabelCountrySelects;

  if (LEGACY) {
    // A legacy page owns its own setLang/I18N. Don't run a second engine —
    // just keep t() available and re-label country selects on their switch.
    document.querySelectorAll(".lang button[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setTimeout(relabelCountrySelects, 0); });
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", relabelCountrySelects);
    } else { relabelCountrySelects(); }
    return;
  }

  function apply(l) {
    var d = DICT[l] || DICT.en;
    var missing = [];
    document.querySelectorAll("[data-t]").forEach(function (el) {
      var k = el.getAttribute("data-t");
      var v = d[k];
      if (v === undefined) { missing.push(k); return; }
      el.innerHTML = v;
    });
    // placeholders, titles and aria labels
    document.querySelectorAll("[data-t-ph]").forEach(function (el) {
      var v = d[el.getAttribute("data-t-ph")];
      if (v !== undefined) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-t-aria]").forEach(function (el) {
      var v = d[el.getAttribute("data-t-aria")];
      if (v !== undefined) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-t-title]").forEach(function (el) {
      var v = d[el.getAttribute("data-t-title")];
      if (v !== undefined) el.setAttribute("title", v);
    });
    if (missing.length && /localhost|vercel\.app/.test(location.host)) {
      console.warn("[BCA i18n] " + l + " missing " + missing.length + " key(s):", missing);
    }
  }

  function setLang(l) {
    if (LANGS.indexOf(l) === -1) l = "en";
    document.documentElement.lang = l;
    try { localStorage.setItem("bca-lang", l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === l);
    });
    apply(l);
    relabelCountrySelects();
    document.dispatchEvent(new CustomEvent("bca:lang", { detail: { lang: l } }));
  }

  window.setLang = setLang;
  window.BCA_LANG = function () {
    try { return localStorage.getItem("bca-lang") || "en"; } catch (e) { return "en"; }
  };

  function wire() {
    document.querySelectorAll(".lang button[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    var saved = "en";
    try { saved = localStorage.getItem("bca-lang") || "en"; } catch (e) {}
    if (LANGS.indexOf(saved) === -1) saved = "en";
    setLang(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();

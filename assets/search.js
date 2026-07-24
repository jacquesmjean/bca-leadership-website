/* BCA site search (TechFides) — instant client-side search over pages + the 44 coaches.
   Injects a search icon into the nav; no backend. */
(function(){
  var PAGES=[
    {t:"Why BCA",u:"why-bca.html",d:"What makes BCA different: built for Africa, by operators who have led here."},
    {t:"The Bench",u:"the-bench.html",d:"44 certified coaches and trainers across all five regions of Africa."},
    {t:"Membership",u:"membership.html",d:"Basic, Executive, and Platinum membership. Annual billing, signed on the site."},
    {t:"Coaching Packages",u:"coaching-packages.html",d:"Standalone coaching: 4, 6, or 12 sessions with a certified coach."},
    {t:"Services",u:"services.html",d:"Consulting, project management, and business matching."},
    {t:"BCAOnline",u:"bca-online.html",d:"The members-only online boardroom."},
    {t:"Board & Governance",u:"governance.html",d:"BCA's board of directors."},
    {t:"Programs",u:"programs.html",d:"Special programs including Legacies of Africa."},
    {t:"Insights",u:"insights.html",d:"Articles and ideas from the BCA network."},
    {t:"Podcast",u:"podcast.html",d:"The Success in Africa Podcast."},
    {t:"Sponsorship",u:"sponsorship.html",d:"Podcast, MLC conference, and network sponsorship."},
    {t:"Shop",u:"shop.html",d:"Ebooks, toolkits, recordings, and merch."}
  ];
  var COACHES=[{"n": "Jeanne-Elvire Adotevi Billies", "w": "France · Europe", "c": "English / French · Private, Public, Social", "t": "coach global"}, {"n": "Doris Ahiati", "w": "Ghana · West", "c": "English · Financial", "t": "coach west"}, {"n": "Titilayo Akinsanya", "w": "Nigeria · West", "c": "English · Financial", "t": "coach west"}, {"n": "Dr. Mbithe Anzaya", "w": "Kenya · East", "c": "English", "t": "coach east"}, {"n": "Sarah Jessie Appiah", "w": "Ghana / Switzerland · West / Europe", "c": "English / French", "t": "coach west global"}, {"n": "Samuel Ayim", "w": "Ghana · West", "c": "English · Financial, Law", "t": "coach west"}, {"n": "Susan Banda-Mudiwa", "w": "Kenya · East", "c": "English", "t": "coach east"}, {"n": "Stephanie Weinzierl", "w": "Burkina Faso · West", "c": "French / English / German", "t": "coach west"}, {"n": "Norah Bwaya", "w": "Uganda · East", "c": "English · Petroleum, Health, Banking, Hospitality, Insurance, Beverages, Development", "t": "coach east"}, {"n": "Nankhonde Kasonde van den Broek", "w": "Zambia · East", "c": "English / French", "t": "coach east"}, {"n": "Catherine Engmann", "w": "Ghana · West", "c": "English", "t": "coach west"}, {"n": "Wilben Short", "w": "The Gambia · West", "c": "English", "t": "coach west"}, {"n": "Hugh Kweku Fraser", "w": "Sierra Leone · West", "c": "English · Financial", "t": "coach west"}, {"n": "Amal Hihi", "w": "Morocco · North", "c": "English / French / Arabic", "t": "coach north"}, {"n": "Dr. Terry Jackson", "w": "USA · Global", "c": "English", "t": "coach global"}, {"n": "Anne Wangondu", "w": "Kenya · East", "c": "English · Financial, Telecommunications, Food Technology", "t": "coach east"}, {"n": "Simon Kibe", "w": "Rwanda · East", "c": "English", "t": "coach east"}, {"n": "Daisy Kopolo", "w": "Zambia · East", "c": "English · Private, Public", "t": "coach east"}, {"n": "Sonia Kubwimana", "w": "Rwanda · East", "c": "English / French / Kinyarwanda / Swahili / Lingala", "t": "coach east"}, {"n": "Maurice Toroitich", "w": "Rwanda · East", "c": "English · Financial, Telecommunications, Power, Consumer, Food Products, Airlines", "t": "coach east"}, {"n": "Barbara Lawrence", "w": "Nigeria · West", "c": "English", "t": "coach west"}, {"n": "Dr. Dumi Magadlela", "w": "South Africa · Southern", "c": "English", "t": "coach southern"}, {"n": "Adeboye Martins", "w": "Nigeria · West", "c": "English · Food & Beverages, Oil Service", "t": "coach west"}, {"n": "Dr. Martin Oduor-Otieno", "w": "Kenya · East", "c": "English · Financial, Public, Private", "t": "coach east"}, {"n": "Miriam von Borcke Matutu", "w": "Zambia · East", "c": "Nonprofit", "t": "coach east"}, {"n": "Price Alan Mbida", "w": "Côte d’Ivoire · West", "c": "French / English", "t": "coach west"}, {"n": "Dr. David Thuku", "w": "Kenya · East", "c": "English · Financial", "t": "coach east"}, {"n": "Dudun Peterside", "w": "Nigeria · West", "c": "English", "t": "coach west"}, {"n": "Flora Mutahi", "w": "Kenya · East", "c": "English", "t": "coach east"}, {"n": "Sibongile Muwamba", "w": "Malawi · Southern", "c": "English", "t": "coach southern"}, {"n": "Anne Ngethe", "w": "Kenya · East", "c": "English", "t": "coach east"}, {"n": "Dr. Yaw Perbi", "w": "Ghana · West", "c": "English", "t": "coach west"}, {"n": "Anyima Okundi", "w": "Kenya · East", "c": "English", "t": "coach east"}, {"n": "Loubna El Ouardighi", "w": "Morocco · North", "c": "English", "t": "coach north"}, {"n": "Alice Rwigema", "w": "Rwanda · East", "c": "English / French · Telecommunications", "t": "coach east"}, {"n": "Dr. Modupe Taylor-Pearce", "w": "Sierra Leone · West", "c": "English · CEO, BCA Leadership", "t": "coach west"}, {"n": "Mulalo Rambau", "w": "Zambia · East", "c": "English", "t": "coach east"}, {"n": "Esther Lehmann-Sow", "w": "Senegal · West", "c": "English / French", "t": "coach west"}, {"n": "Philippe Futa", "w": "USA / DR Congo · Central", "c": "English / French · Law", "t": "coach central"}, {"n": "Juliet Ntabgoba", "w": "Uganda · East", "c": "English", "t": "coach east"}, {"n": "Naoufel Aissa", "w": "Morocco · North", "c": "English / French / Arabic", "t": "coach north"}, {"n": "Jacqueline Williams", "w": "Sierra Leone · West", "c": "English", "t": "coach west"}, {"n": "Cecellia Shammim Saidi", "w": "Malawi · East", "c": "English", "t": "trainer east"}, {"n": "Maya Ng'ombe-Jere", "w": "Malawi · East", "c": "Certified facilitator (IAF) and leadership trainer (LMI). 30+ years in executive development and organisational transformation.", "t": "trainer east"}];
  var STR={
    en:{ph:"Search coaches, pages, topics…",coaches:"Coaches",pages:"Pages",none:"No results. Try a name, country, sector, or topic."},
    fr:{ph:"Rechercher coachs, pages, sujets…",coaches:"Coachs",pages:"Pages",none:"Aucun résultat. Essayez un nom, pays, secteur ou sujet."},
    es:{ph:"Buscar coaches, páginas, temas…",coaches:"Coaches",pages:"Páginas",none:"Sin resultados. Pruebe un nombre, país, sector o tema."},
    pt:{ph:"Pesquisar coaches, páginas, temas…",coaches:"Coaches",pages:"Páginas",none:"Sem resultados. Tente um nome, país, setor ou tema."}
  };
  function lang(){var l=(document.documentElement.lang||"en").slice(0,2).toLowerCase();return STR[l]?l:"en";}

  var css=document.createElement("style");
  css.textContent=
    ".bca-search-btn{background:none;border:none;cursor:pointer;color:inherit;display:inline-flex;align-items:center;padding:6px;color:var(--bca-espresso,#452C23)}"+
    ".bca-search-btn svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}"+
    "#bca-sv{position:fixed;inset:0;background:rgba(33,16,18,.55);backdrop-filter:blur(4px);z-index:170;display:none;justify-content:center;align-items:flex-start;padding:12vh 20px 20px}"+
    "#bca-sv.open{display:flex}"+
    "#bca-sbox{background:#FAF6EE;width:100%;max-width:620px;border-top:5px solid #F7A61C;box-shadow:0 24px 64px rgba(36,23,12,.4);max-height:76vh;display:flex;flex-direction:column;font-family:'Jost',sans-serif}"+
    "#bca-sbox .top{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(36,23,12,.12)}"+
    "#bca-sbox .top svg{width:20px;height:20px;stroke:#8a8177;fill:none;stroke-width:2;flex-shrink:0}"+
    "#bca-sbox input{flex:1;border:none;background:none;font-family:'Jost',sans-serif;font-size:17px;color:#242424;outline:none}"+
    "#bca-sbox .x{background:none;border:none;font-size:22px;color:#452C23;cursor:pointer;line-height:1}"+
    "#bca-sres{overflow-y:auto;padding:8px 0}"+
    "#bca-sres .grp{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8a8177;padding:12px 20px 6px;font-weight:600}"+
    "#bca-sres a{display:block;padding:10px 20px;text-decoration:none;color:#242424;border-left:3px solid transparent}"+
    "#bca-sres a:hover,#bca-sres a.on{background:#F2EBDD;border-left-color:#058D52}"+
    "#bca-sres a .rt{font-weight:500;font-size:15px}"+
    "#bca-sres a .rd{font-size:12.5px;color:rgba(36,36,36,.6);margin-top:2px}"+
    "#bca-sres .none{padding:24px 20px;color:#8a8177;font-size:14px}";
  document.head.appendChild(css);

  // inject a search icon into each nav's right cluster
  var ICON='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
  function injectBtn(){
    var host=document.querySelector(".nav-right");
    if(host && !host.querySelector(".bca-search-btn")){
      var b=document.createElement("button");b.className="bca-search-btn";b.type="button";b.setAttribute("aria-label","Search");b.innerHTML=ICON;
      b.addEventListener("click",openS); host.insertBefore(b, host.firstChild);
    }
  }
  var veil=document.createElement("div");veil.id="bca-sv";
  veil.innerHTML='<div id="bca-sbox"><div class="top">'+ICON.replace('width:20px','')+'<input id="bca-sin" type="text" autocomplete="off"><button class="x" aria-label="Close">×</button></div><div id="bca-sres"></div></div>';
  document.body.appendChild(veil);
  var input=veil.querySelector("#bca-sin"), res=veil.querySelector("#bca-sres");

  function norm(s){return (s||"").toLowerCase();}
  function render(q){
    q=norm(q).trim();
    var t=STR[lang()];
    if(!q){res.innerHTML='<div class="grp">'+t.pages+'</div>'+PAGES.map(function(p){return link(p.u,p.t,p.d)}).join("");return;}
    var pg=PAGES.filter(function(p){return norm(p.t+" "+p.d+" "+p.u).indexOf(q)>-1;});
    var co=COACHES.filter(function(c){return norm(c.n+" "+c.w+" "+c.c+" "+c.t).indexOf(q)>-1;});
    var html="";
    if(co.length) html+='<div class="grp">'+t.coaches+' ('+co.length+')</div>'+co.slice(0,20).map(function(c){return link("the-bench.html",c.n,c.w+" · "+c.c)}).join("");
    if(pg.length) html+='<div class="grp">'+t.pages+'</div>'+pg.map(function(p){return link(p.u,p.t,p.d)}).join("");
    if(!html) html='<div class="none">'+t.none+'</div>';
    res.innerHTML=html;
  }
  function link(u,tt,dd){return '<a href="'+u+'"><div class="rt">'+esc(tt)+'</div><div class="rd">'+esc(dd)+'</div></a>';}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  function openS(){var t=STR[lang()];input.placeholder=t.ph;veil.classList.add("open");document.body.style.overflow="hidden";render("");input.focus();}
  function closeS(){veil.classList.remove("open");document.body.style.overflow="";input.value="";}
  veil.addEventListener("click",function(e){if(e.target===veil)closeS();});
  veil.querySelector(".x").addEventListener("click",closeS);
  input.addEventListener("input",function(){render(this.value);});
  input.addEventListener("keydown",function(e){if(e.key==="Escape")closeS();if(e.key==="Enter"){var a=res.querySelector("a");if(a)location.href=a.getAttribute("href");}});
  document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();openS();}});

  if(document.readyState!=="loading")injectBtn();else document.addEventListener("DOMContentLoaded",injectBtn);
})();

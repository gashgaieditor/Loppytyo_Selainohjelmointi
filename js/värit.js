/* Värien testaus: realistisempi huonemalli (SVG) + värinapit
   Vaatii: jQuery sekä HTML:ssä #huone, #seinanavetta-ala, #jalkalistanavetta-ala,
   #seina-otanto, #jalkalista-otanto (+ niiden vieressä .otanto-teksti) */

$(function () {
  var seinaVarit = [
    { nimi: 'Luonnonvalkoinen', hex: '#F3EFE6' },
    { nimi: 'Lämmin harmaa',    hex: '#CFCAC2' },
    { nimi: 'Vaaleanharmaa',    hex: '#D9DDE0' },
    { nimi: 'Vaaleansininen',   hex: '#BFD6E6' },
    { nimi: 'Sumunsininen',     hex: '#8FAFC4' },
    { nimi: 'Salvia',           hex: '#A9B8A0' },
    { nimi: 'Beige',            hex: '#D8C7AC' },
    { nimi: 'Persikka',         hex: '#EBC3A8' },
    { nimi: 'Terrakotta',       hex: '#C47A5A' },
    { nimi: 'Syvä petrooli',    hex: '#2F5D62' }
  ];

  var jalkalistaVarit = [
    { nimi: 'Valkoinen',        hex: '#FFFFFF' },
    { nimi: 'Luonnonvalkoinen', hex: '#EFE9DC' },
    { nimi: 'Vaaleanharmaa',    hex: '#BDBDBD' },
    { nimi: 'Grafiitti',        hex: '#4A4D52' },
    { nimi: 'Tammi',            hex: '#A97C50' },
    { nimi: 'Musta',            hex: '#1E1E1E' }
  ];

  var $huone = $('#huone');

  /* Lattialankut: viivat kohtaavat katoamispisteessä (400,190) */
  var lankut = '';
  for (var x = -600; x <= 1400; x += 90) {
    lankut += '<line x1="400" y1="190" x2="' + x + '" y2="500"/>';
  }
  /* Lankkujen päätysaumat porrastettuina */
  var saumat = '';
  var rivit = [352, 366, 384, 408, 440, 484];
  $.each(rivit, function (r, y) {
    var t = (y - 190) / 310;
    for (var i = -6; i <= 14; i++) {
      var px = 400 + ((i * 90 + (r % 2 ? 45 : 0) - 400) * t);
      saumat += '<line x1="' + px + '" y1="' + y + '" x2="' + (px + 6 * t) + '" y2="' + (y + 0) + '"/>';
    }
  });

  var svg = [
  '<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Huonemalli" ',
  'style="width:100%;height:auto;display:block;border-radius:12px;overflow:hidden">',
  '<defs>',
    /* pehmeät sumennukset varjoille */
    '<filter id="b4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>',
    '<filter id="b10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>',
    '<filter id="b22" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>',
    /* hienorakeinen rappaus-/maalipintatekstuuri */
    '<filter id="tex" x="0" y="0" width="100%" height="100%">',
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/>',
      '<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.35"/>',
    '</filter>',
    /* puun syykuvio lattiaan */
    '<filter id="syy" x="0" y="0" width="100%" height="100%">',
      '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.35" numOctaves="3" seed="9"/>',
      '<feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.14  0 0 0 0 0.05  0 0 0 1.1 -0.45"/>',
    '</filter>',
    '<clipPath id="lattiaClip"><polygon points="0,400 100,340 700,340 800,400 800,500 0,500"/></clipPath>',
    '<clipPath id="takaseinaClip"><rect x="100" y="40" width="600" height="300"/></clipPath>',

    /* valo ikkunasta: oikealta vasemmalle himmenevä */
    '<linearGradient id="valoSeina" x1="1" y1="0" x2="0" y2="0">',
      '<stop offset="0" stop-color="#fff" stop-opacity="0.22"/>',
      '<stop offset="0.55" stop-color="#fff" stop-opacity="0.04"/>',
      '<stop offset="1" stop-color="#000" stop-opacity="0.16"/>',
    '</linearGradient>',
    '<radialGradient id="ikkunaHehku" cx="565" cy="160" r="260" gradientUnits="userSpaceOnUse">',
      '<stop offset="0" stop-color="#fff" stop-opacity="0.32"/>',
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/>',
    '</radialGradient>',
    /* kulmien ja katon varjostus (ambient occlusion) */
    '<linearGradient id="aoV" x1="0" y1="0" x2="1" y2="0">',
      '<stop offset="0" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/>',
    '</linearGradient>',
    '<linearGradient id="aoO" x1="1" y1="0" x2="0" y2="0">',
      '<stop offset="0" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/>',
    '</linearGradient>',
    '<linearGradient id="aoY" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#000" stop-opacity="0.30"/><stop offset="1" stop-color="#000" stop-opacity="0"/>',
    '</linearGradient>',
    '<linearGradient id="aoA" x1="0" y1="1" x2="0" y2="0">',
      '<stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/>',
    '</linearGradient>',
    /* lattia: kauempana tummempi, lähellä vaaleampi */
    '<linearGradient id="lattiaVari" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#9C7249"/><stop offset="1" stop-color="#C9A06E"/>',
    '</linearGradient>',
    /* heijastus lattiassa */
    '<linearGradient id="kiilto" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/>',
    '</linearGradient>',
    /* sohva */
    '<linearGradient id="sohvaSelka" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#7A8997"/><stop offset="1" stop-color="#56636F"/>',
    '</linearGradient>',
    '<linearGradient id="sohvaIstuin" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#7F8E9C"/><stop offset="1" stop-color="#627080"/>',
    '</linearGradient>',
    '<linearGradient id="sohvaKahva" x1="0" y1="0" x2="1" y2="0">',
      '<stop offset="0" stop-color="#4A5560"/><stop offset="0.5" stop-color="#5F6C79"/><stop offset="1" stop-color="#4A5560"/>',
    '</linearGradient>',
    '<linearGradient id="tyyny" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="#EDC76E"/><stop offset="1" stop-color="#C9A04A"/>',
    '</linearGradient>',
    /* verho */
    '<linearGradient id="verho" x1="0" y1="0" x2="1" y2="0">',
      '<stop offset="0" stop-color="#EDE7DA"/><stop offset="0.3" stop-color="#D9D1C0"/>',
      '<stop offset="0.6" stop-color="#EDE7DA"/><stop offset="1" stop-color="#D4CBB8"/>',
    '</linearGradient>',
    /* ikkunan näkymä */
    '<linearGradient id="taivas" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#9CCBEA"/><stop offset="1" stop-color="#E4F2FA"/>',
    '</linearGradient>',
    /* lampun valo */
    '<radialGradient id="lamppuHehku" cx="0.5" cy="0.5" r="0.5">',
      '<stop offset="0" stop-color="#FFE9A8" stop-opacity="0.75"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/>',
    '</radialGradient>',
    /* reunavinjetti */
    '<radialGradient id="vinjetti" cx="0.5" cy="0.45" r="0.75">',
      '<stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/>',
    '</radialGradient>',
  '</defs>',

  /* ---------- KATTO ---------- */
  '<polygon points="0,0 800,0 700,40 100,40" fill="#F4F4F1"/>',
  '<polygon points="0,0 800,0 700,40 100,40" fill="url(#aoY)" opacity="0.4"/>',

  /* ---------- SEINÄT ---------- */
  '<rect x="100" y="40" width="600" height="300" style="fill:var(--seina)"/>',
  '<polygon points="0,0 100,40 100,340 0,400" style="fill:var(--seina)"/>',
  '<polygon points="800,0 700,40 700,340 800,400" style="fill:var(--seina)"/>',
  /* seinien valaistus: vasen sivuseinä varjossa, oikea saa valoa ikkunasta */
  '<polygon points="0,0 100,40 100,340 0,400" fill="#000" opacity="0.16"/>',
  '<polygon points="800,0 700,40 700,340 800,400" fill="#000" opacity="0.07"/>',
  '<rect x="100" y="40" width="600" height="300" fill="url(#valoSeina)"/>',
  '<rect x="100" y="40" width="600" height="300" fill="url(#ikkunaHehku)"/>',
  /* kulmavarjot */
  '<rect x="100" y="40" width="60" height="300" fill="url(#aoV)"/>',
  '<rect x="640" y="40" width="60" height="300" fill="url(#aoO)"/>',
  '<rect x="100" y="40" width="600" height="46" fill="url(#aoY)"/>',
  /* maalipinnan tekstuuri */
  '<rect x="100" y="40" width="600" height="300" filter="url(#tex)" opacity="0.07"/>',

  /* ---------- LATTIA ---------- */
  '<g clip-path="url(#lattiaClip)">',
    '<rect x="0" y="330" width="800" height="180" fill="url(#lattiaVari)"/>',
    '<rect x="0" y="330" width="800" height="180" filter="url(#syy)" opacity="0.55"/>',
    '<g stroke="#5A3C20" stroke-width="1.4" opacity="0.45">' + lankut + '</g>',
    '<g stroke="#5A3C20" stroke-width="1.2" opacity="0.4">' + saumat + '</g>',
    '<rect x="0" y="330" width="800" height="180" fill="url(#kiilto)"/>',
    /* ikkunasta tuleva valolaikku */
    '<polygon points="560,346 700,346 650,470 400,470" fill="#FFF6D8" opacity="0.30" filter="url(#b10)"/>',
    '<polygon points="575,350 640,350 600,440 470,440" fill="#fff" opacity="0.18" filter="url(#b4)"/>',
    /* varjo seinän vierellä */
    '<rect x="100" y="340" width="600" height="18" fill="url(#aoY)"/>',
  '</g>',

  /* ---------- JALKALISTAT ---------- */
  '<rect x="100" y="318" width="600" height="22" style="fill:var(--jalkalista)"/>',
  '<polygon points="0,378 100,318 100,340 0,400" style="fill:var(--jalkalista)"/>',
  '<polygon points="800,378 700,318 700,340 800,400" style="fill:var(--jalkalista)"/>',
  /* listan varjostus: ylälaidassa kohokohta, alareunassa varjo */
  '<rect x="100" y="318" width="600" height="2.5" fill="#fff" opacity="0.45"/>',
  '<rect x="100" y="334" width="600" height="6" fill="#000" opacity="0.14"/>',
  '<polygon points="0,378 100,318 100,340 0,400" fill="#000" opacity="0.14"/>',
  '<polygon points="800,378 700,318 700,340 800,400" fill="#000" opacity="0.06"/>',
  '<rect x="100" y="320" width="600" height="1.5" fill="#000" opacity="0.18"/>',

  /* ---------- IKKUNA ---------- */
  '<rect x="458" y="76" width="214" height="172" rx="3" fill="#000" opacity="0.18" filter="url(#b4)"/>',
  '<rect x="460" y="78" width="210" height="166" rx="3" fill="#F8F8F6"/>',
  '<rect x="470" y="88" width="190" height="146" fill="url(#taivas)"/>',
  /* maisema: horisontti ja puut */
  '<g clip-path="inset(0)"><rect x="470" y="190" width="190" height="44" fill="#8DAE86"/>',
  '<ellipse cx="505" cy="192" rx="26" ry="16" fill="#6F9570"/>',
  '<ellipse cx="620" cy="195" rx="34" ry="18" fill="#7BA07A"/>',
  '<ellipse cx="540" cy="115" rx="26" ry="9" fill="#fff" opacity="0.8"/>',
  '<ellipse cx="610" cy="130" rx="20" ry="7" fill="#fff" opacity="0.7"/></g>',
  /* karmit */
  '<rect x="561" y="88" width="8" height="146" fill="#F8F8F6"/>',
  '<rect x="470" y="156" width="190" height="7" fill="#F8F8F6"/>',
  '<polygon points="470,88 520,88 470,150" fill="#fff" opacity="0.22"/>',
  '<polygon points="569,88 620,88 569,150" fill="#fff" opacity="0.22"/>',
  /* ikkunalauta */
  '<rect x="450" y="244" width="230" height="9" rx="2" fill="#FBFBF9"/>',
  '<rect x="450" y="251" width="230" height="4" fill="#000" opacity="0.18"/>',
  /* verhot */
  '<rect x="436" y="64" width="248" height="6" rx="3" fill="#6B5A47"/>',
  '<path d="M440 70 H470 V236 Q455 240 440 236 Z" fill="url(#verho)"/>',
  '<path d="M660 70 H684 V236 Q672 240 660 236 Z" fill="url(#verho)"/>',
  '<path d="M452 70 V236 M461 70 V236" stroke="#000" opacity="0.09"/>',
  '<path d="M668 70 V236 M677 70 V236" stroke="#000" opacity="0.09"/>',

  /* ---------- TAULU ---------- */
  '<rect x="186" y="98" width="124" height="84" fill="#000" opacity="0.22" filter="url(#b4)"/>',
  '<rect x="182" y="92" width="124" height="84" fill="#3A3A3A"/>',
  '<rect x="188" y="98" width="112" height="72" fill="#F6F4EE"/>',
  '<polygon points="192,166 226,128 248,150 268,132 296,166" fill="#7C9A8B"/>',
  '<polygon points="226,128 238,140 218,146" fill="#A9C3B6"/>',
  '<circle cx="270" cy="114" r="9" fill="#E3B95A"/>',

  /* ---------- MATTO ---------- */
  '<ellipse cx="402" cy="446" rx="236" ry="40" fill="#000" opacity="0.28" filter="url(#b4)"/>',
  '<ellipse cx="400" cy="440" rx="232" ry="38" fill="#7B8C99"/>',
  '<ellipse cx="400" cy="440" rx="196" ry="31" fill="none" stroke="#E9EEF1" stroke-width="3" opacity="0.65"/>',
  '<ellipse cx="400" cy="440" rx="160" ry="24" fill="none" stroke="#5F7080" stroke-width="2" opacity="0.7"/>',
  '<ellipse cx="400" cy="432" rx="232" ry="30" fill="#fff" opacity="0.06"/>',

  /* ---------- SOHVA ---------- */
  /* varjo lattialla ja seinällä */
  '<ellipse cx="282" cy="356" rx="175" ry="14" fill="#000" opacity="0.45" filter="url(#b10)"/>',
  '<rect x="118" y="212" width="320" height="110" fill="#000" opacity="0.14" filter="url(#b22)"/>',
  /* jalat */
  '<path d="M140 340 h10 l-2 16 h-6z M410 340 h10 l-2 16 h-6z" fill="#2E2A26"/>',
  /* selkänoja */
  '<rect x="136" y="220" width="282" height="92" rx="18" fill="url(#sohvaSelka)"/>',
  '<rect x="136" y="220" width="282" height="5" rx="2.5" fill="#fff" opacity="0.22"/>',
  /* kahvat */
  '<rect x="112" y="256" width="46" height="92" rx="14" fill="url(#sohvaKahva)"/>',
  '<rect x="396" y="256" width="46" height="92" rx="14" fill="url(#sohvaKahva)"/>',
  '<rect x="112" y="256" width="46" height="4" rx="2" fill="#fff" opacity="0.2"/>',
  '<rect x="396" y="256" width="46" height="4" rx="2" fill="#fff" opacity="0.2"/>',
  /* istuinpehmusteet */
  '<rect x="156" y="278" width="118" height="66" rx="12" fill="url(#sohvaIstuin)"/>',
  '<rect x="280" y="278" width="118" height="66" rx="12" fill="url(#sohvaIstuin)"/>',
  '<rect x="156" y="278" width="118" height="4" rx="2" fill="#fff" opacity="0.22"/>',
  '<rect x="280" y="278" width="118" height="4" rx="2" fill="#fff" opacity="0.22"/>',
  '<rect x="156" y="336" width="242" height="8" rx="4" fill="#000" opacity="0.18"/>',
  /* tyynyt */
  '<g transform="rotate(-8 190 280)"><rect x="162" y="246" width="56" height="50" rx="10" fill="url(#tyyny)"/>',
  '<path d="M170 252 L210 290" stroke="#fff" opacity="0.18" stroke-width="2"/></g>',
  '<g transform="rotate(7 372 282)"><rect x="346" y="250" width="50" height="46" rx="10" fill="#B9C4CC"/></g>',

  /* ---------- LAMPPU ---------- */
  '<circle cx="672" cy="205" r="110" fill="url(#lamppuHehku)"/>',
  '<ellipse cx="676" cy="404" rx="26" ry="7" fill="#000" opacity="0.4" filter="url(#b4)"/>',
  '<ellipse cx="672" cy="402" rx="20" ry="5" fill="#2B2B2B"/>',
  '<rect x="669.5" y="248" width="5" height="154" fill="#3A3A3A"/>',
  '<polygon points="640,250 704,250 690,200 654,200" fill="#F5E6BD"/>',
  '<polygon points="640,250 704,250 690,200 654,200" fill="#fff" opacity="0.25"/>',
  '<rect x="654" y="200" width="36" height="3" fill="#fff" opacity="0.4"/>',

  /* ---------- KOKONAISVALAISU ---------- */
  '<rect width="800" height="500" fill="url(#vinjetti)"/>',
  '</svg>'
  ].join('');

  $huone.empty().html(svg);

  /* Värinapit */
  function rakennaNapit(kohde, varit, muuttuja, otantoId, oletus) {
    var $ala = $(kohde).empty();
    var $otanto = $(otantoId);

    function valitse(v, $nappi) {
      $huone[0].style.setProperty(muuttuja, v.hex);
      $otanto.css('background', v.hex);
      $otanto.siblings('.otanto-teksti').text(' ' + v.nimi);
      $ala.find('button').removeClass('valittu').attr('aria-pressed', 'false');
      $nappi.addClass('valittu').attr('aria-pressed', 'true');
    }

    $.each(varit, function (i, v) {
      var $nappi = $('<button type="button" class="vari-nappi"></button>')
        .attr({ title: v.nimi, 'aria-label': v.nimi, 'aria-pressed': 'false' })
        .css({
          background: v.hex, width: '40px', height: '40px', borderRadius: '50%',
          border: '2px solid #bbb', margin: '4px', cursor: 'pointer'
        })
        .on('click', function () { valitse(v, $(this)); });
      $ala.append($nappi);
      if (i === oletus) { valitse(v, $nappi); }
    });
  }

  rakennaNapit('#seinanavetta-ala', seinaVarit, '--seina', '#seina-otanto', 0);
  rakennaNapit('#jalkalistanavetta-ala', jalkalistaVarit, '--jalkalista', '#jalkalista-otanto', 0);

  $('<style>' +
    '.vari-nappi.valittu{outline:3px solid #0d6efd;outline-offset:2px}' +
    '.vari-otanto{display:inline-block;width:18px;height:18px;border-radius:4px;' +
    'border:1px solid #999;vertical-align:middle}' +
  '</style>').appendTo('head');
});
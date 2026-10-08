/* ============================================================
   Värien testaus – seinälle maalaustyökalu
   Napsauta navettaa, niin huoneen seinä / jalkalista maalaantuu.
   ============================================================ */

$(function () {
  // ---------- Väripaletit ----------

  var seinavorit = [
    { nimi: "Puuvillavalko", hex: "#f2f0ea" },
    { nimi: "Savuharmaa",    hex: "#b9bdc1" },
    { nimi: "Ihantesinis",   hex: "#8fa8c4" },
    { nimi: "Salviagreeni",  hex: "#8ba888" },
    { nimi: "Pihlajankulta", hex: "#e6c878" },
    { nimi: "Terrakotta",    hex: "#c98a6b" },
    { nimi: "Vadelma",       hex: "#b9768a" },
    { nimi: "Grafiitti",     hex: "#5c6470" }
  ];

  var jalkistavorit = [
    { nimi: "Valkoinen",     hex: "#ffffff" },
    { nimi: "Tummaharmaa",   hex: "#4a4f55" },
    { nimi: "Maanruskea",    hex: "#8a6d52" },
    { nimi: "Syvän sininen", hex: "#1f3a4d" }
  ];

  var $huone = $("#huone");

  // ---------- Navettien rakentaminen ----------

  rakennaNavetat(seinavorit, "#seinanavetta-ala", "seinä");
  rakennaNavetat(jalkistavorit, "#jalkalistanavetta-ala", "jalkalista");

  function rakennaNavetat(paletti, alaSelektori, tyyppi) {
    var $ala = $(alaSelektori);
    $.each(paletti, function (i, vari) {
      var $navetta = $("<button>", {
        "type": "button",
        "class": "navetta",
        "style": "background-color:" + vari.hex,
        "title": vari.nimi + " (" + vari.hex + ")",
        "data-tyyppi": tyyppi,
        "data-nimi": vari.nimi,
        "data-hex": vari.hex
      });
      $ala.append($navetta);
    });

    // Omalta väritekstiltä (natiivi väripalikka)
    var $oma = $(
      '<button type="button" class="navetta navetta-oma" title="Valitse oma väri">' +
        '<input type="color" value="#cccccc" aria-label="Valitse oma väri">' +
      "</button>"
    );
    $ala.append($oma);

    $oma.find("input").on("input", function () {
      soveltaVari(tyyppi, "Oma väri", $(this).val());
    });
  }

  // ---------- Navettanapsautukset ----------

  $(document).on("click", ".navetta[data-hex]", function () {
    var tyyppi = $(this).data("tyyppi");
    var nimi = $(this).data("nimi");
    var hex = $(this).data("hex");

    // Merkitse valinta aktiiviseksi
    $(".navetta[data-tyyppi='" + tyyppi + "']").removeClass("aktiivinen");
    $(this).addClass("aktiivinen");

    soveltaVari(tyyppi, nimi, hex);
  });

  // ---------- Väri sovelletaan huoneeseen ----------

  function soveltaVari(tyyppi, nimi, hex) {
    if (tyyppi === "seinä") {
      $huone.css("--seinavari", hex);
      asetaOtonTo("#seina-otanto", nimi, hex);
    } else {
      $huone.css("--jalkalistavari", hex);
      asetaOtonTo("#jalkalista-otanto", nimi, hex);
    }
  }

  function asetaOtonTo(selektori, nimi, hex) {
    $(selektori)
      .css("background-color", hex)
      .parent()
      .find(".otanto-teksti")
      .text(nimi + " (" + hex + ")");
  }

  // ---------- Alkuvalinnat ----------

  soveltaVari("seinä", "Puuvillavalko", "#f2f0ea");
  soveltaVari("jalkalista", "Valkoinen", "#ffffff");

  // Merkitse alun navetat aktiivisiksi
  $(".navetta[data-tyyppi='seinä'][data-hex='#f2f0ea']").addClass("aktiivinen");
  $(".navetta[data-tyyppi='jalkalista'][data-hex='#ffffff']").addClass("aktiivinen");
});

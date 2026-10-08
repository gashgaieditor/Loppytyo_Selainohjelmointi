/* ============================================================
   Yhteiset skriptit – Kotkantie Maalaus & Tapetointi
   ============================================================ */

$(function () {
  // Alatunnisteen vuosi päivittyy automaattisesti
  var vuosi = new Date().getFullYear();
  $("#vuosi").text("© " + vuosi + " Kotkantie Maalaus & Tapetointi. Kaikki oikeudet pidätetään.");

  // ---------- Yhteystietolomake: asiakkaanpuoleinen validointi ----------
  var $muoto = $("#yhteystietolomake");

  $muoto.on("submit", function (tapaukset) {
    tapaukset.preventDefault();

    var nimi = $.trim($("#nimi").val());
    var sahkoposti = $.trim($("#sahkoposti").val());
    var puhelin = $.trim($("#puhelin").val());
    var viesti = $.trim($("#viesti").val());

    var ok = true;

    // Nimi: vähintään 2 merkkiä
    if (nimi.length < 2) {
      merkitseVirheellinen("#nimi", "Kirjoita nimesi (vähintään 2 merkkiä).");
      ok = false;
    } else {
      merkitseKelvollinen("#nimi");
    }

    // Sähköposti: yksinkertainen tarkistus
    var postiyhteys = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!postiyhteys.test(sahkoposti)) {
      merkitseVirheellinen("#sahkoposti", "Kirjoita kelvollinen sähköpostiosoite.");
      ok = false;
    } else {
      merkitseKelvollinen("#sahkoposti");
    }

    // Puhelin: valinnainen, mutta jos täytetty, tarkista muoto (0x... tai +...)
    if (puhelin !== "") {
      var puhelimiyhteys = /^(\+358|0)\d{2,9}$/;
      if (!puhelimiyhteys.test(puhelin)) {
        merkitseVirheellinen("#puhelin", "Tarkista puhelinnumero (esim. 040 123 4567).");
        ok = false;
      } else {
        merkitseKelvollinen("#puhelin");
      }
    } else {
      merkitseKelvollinen("#puhelin");
    }

    // Viesti: vähintään 10 merkkiä
    if (viesti.length < 10) {
      merkitseVirheellinen("#viesti", "Kerro vähintään 10 merkillä, mistä on kyse.");
      ok = false;
    } else {
      merkitseKelvollinen("#viesti");
    }

    if (!ok) {
      $muoto.find(".was-validated .is-invalid, .is-invalid")
        .first()
        .trigger("focus");
      return;
    }

    // Validointi onnistui – ei palvelinta, joten näytetään vain vahvistus
    $muoto.hide();
    $("#lomake-vahvistus").removeClass("d-none");
    $("#lomake-vahvistus").alert("toggle");
  });

  function merkitseVirheellinen(selektori, viesti) {
    $(selektori)
      .addClass("is-invalid")
      .siblings(".invalid-feedback")
      .first()
      .text(viesti);
  }

  function merkitseKelvollinen(selektori) {
    $(selektori)
      .removeClass("is-invalid")
      .addClass("is-valid");
  }

  // Poista validointimerkinnät, kun käyttäjä alkaa kirjoittaa uudestaan
  $muoto.find("input, textarea").on("input", function () {
    $(this).removeClass("is-invalid");
  });

  // ---------- Pienet parantelut ----------

  // Sileä vieritys ankuroitaviin linkeihin
  $('a[href*="#"]').on("click", function (tapaukset) {
    var kohde = $(this).attr("href");
    if (kohde.length > 1 && $(kohde).length) {
      tapaukset.preventDefault();
      $("html, body").animate(
        { scrollTop: $(kohde).offset().top - 80 },
        400
      );
    }
  });
});

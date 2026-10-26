/* ============================================================
   Yhteiset skriptit – Kotkantie Maalaus & Tapetointi
   ============================================================ */

$(function () {
  // Alatunnisteen vuosi päivittyy automaattisesti
  var vuosi = new Date().getFullYear();
  $("#vuosi").text("© " + vuosi + " Kotkantie Maalaus & Tapetointi. Kaikki oikeudet pidätetään.");

  // ---------- Yhteystietolomake: asiakkaanpuoleinen validointi ----------
  var $lomake = $("#yhteystietolomake");

  var SAHKOPOSTI_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PUHELIN_RE = /^(\+358|0)\d{2,9}$/;

  $lomake.on("submit", function (e) {
    e.preventDefault();

    var nimi = $.trim($("#nimi").val());
    var sahkoposti = $.trim($("#sahkoposti").val());
    // Poistetaan välilyönnit ja viivat, jotta "040 123 4567" hyväksytään
    var puhelin = $.trim($("#puhelin").val()).replace(/[\s-]/g, "");
    var viesti = $.trim($("#viesti").val());

    var ok = true;

    // Nimi: vähintään 2 merkkiä
    if (nimi.length < 2) {
      merkitseVirheellinen("#nimi", "Kirjoita nimesi (vähintään 2 merkkiä).");
      ok = false;
    } else {
      merkitseKelvollinen("#nimi");
    }

    // Sähköposti
    if (!SAHKOPOSTI_RE.test(sahkoposti)) {
      merkitseVirheellinen("#sahkoposti", "Kirjoita kelvollinen sähköpostiosoite.");
      ok = false;
    } else {
      merkitseKelvollinen("#sahkoposti");
    }

    // Puhelin: valinnainen, mutta jos täytetty, tarkista muoto
    if (puhelin !== "") {
      if (!PUHELIN_RE.test(puhelin)) {
        merkitseVirheellinen("#puhelin", "Tarkista puhelinnumero (esim. 040 123 4567).");
        ok = false;
      } else {
        merkitseKelvollinen("#puhelin");
      }
    } else {
      // Tyhjä valinnainen kenttä ei saa näkyä vihreänä
      $("#puhelin").removeClass("is-invalid is-valid");
    }

    // Viesti: vähintään 10 merkkiä
    if (viesti.length < 10) {
      merkitseVirheellinen("#viesti", "Kerro vähintään 10 merkillä, mistä on kyse.");
      ok = false;
    } else {
      merkitseKelvollinen("#viesti");
    }

    if (!ok) {
      $lomake.find(".is-invalid").first().trigger("focus");
      return;
    }

    // Validointi onnistui – ei palvelinta, joten näytetään vain vahvistus
    $lomake.hide();
    $("#lomake-vahvistus").removeClass("d-none");
  });

  function merkitseVirheellinen(selektori, viesti) {
    $(selektori)
      .removeClass("is-valid")
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
  $lomake.find("input, textarea").on("input", function () {
    $(this).removeClass("is-invalid is-valid");
  });

  // ---------- Pienet parantelut ----------

  // Sileä vieritys saman sivun ankkurilinkkeihin
  $('a[href*="#"]').on("click", function (e) {
    // Vain saman sivun ankkurit (ei esim. index.html#osio toiselta sivulta)
    if (this.pathname !== window.location.pathname || this.hostname !== window.location.hostname) {
      return;
    }
    if (this.hash.length < 2) { return; }

    var kohde = document.getElementById(this.hash.slice(1));
    if (kohde) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: $(kohde).offset().top - 80 }, 400);
    }
  });
});
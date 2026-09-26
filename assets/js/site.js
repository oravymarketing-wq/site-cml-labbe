/* Constructions Michel Labbé — interactions du site
   Aucune dépendance. Toute l'information reste dans le DOM sans JS. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Navigation mobile ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    var desktop = window.matchMedia("(min-width: 901px)");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Fermer" : "Menu";
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    }
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Scène signature : la coupe ---------- */
  function initCoupe() {
    var scene = document.querySelector("[data-coupe]");
    if (!scene) return;
    var track = scene.querySelector(".coupe__track");
    var sticky = scene.querySelector(".coupe__sticky");
    var layers = Array.prototype.slice.call(scene.querySelectorAll(".layer"));
    var steps = Array.prototype.slice.call(scene.querySelectorAll(".coupe__steps li"));
    var n = layers.length;
    var interactive = window.matchMedia("(min-width: 861px) and (min-height: 561px)");
    var ticking = false;
    var listening = false;
    var lastActive = -1;

    function showFinal() {
      layers.forEach(function (l) { l.style.setProperty("--lp", "1"); l.classList.remove("is-active"); });
      steps.forEach(function (s) { s.classList.remove("is-active"); s.classList.add("is-done"); });
      lastActive = -1;
    }

    function render() {
      ticking = false;
      var rect = track.getBoundingClientRect();
      var travel = track.offsetHeight - sticky.offsetHeight;
      var headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      var p = travel > 0 ? (headerH - rect.top) / travel : 1;
      p = Math.min(1, Math.max(0, p / 0.88)); // tenue finale sur les derniers 12 %
      var active = Math.min(n - 1, Math.floor(p * n));
      layers.forEach(function (l, i) {
        var lp = Math.min(1, Math.max(0, p * n - i));
        l.style.setProperty("--lp", lp.toFixed(3));
        l.classList.toggle("is-active", i === active);
      });
      if (active !== lastActive) {
        steps.forEach(function (s, i) {
          s.classList.toggle("is-active", i === active);
          s.classList.toggle("is-done", i < active || p >= 1);
        });
        lastActive = active;
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(render); }
    }
    function listen(on) {
      if (on === listening) return;
      listening = on;
      if (on) { window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll(); }
      else { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    }

    var inView = false;
    function update() {
      if (reduceMotion.matches || !interactive.matches) { listen(false); showFinal(); return; }
      if (inView) listen(true); else listen(false);
      render();
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        update();
      }, { rootMargin: "100px 0px" }).observe(scene);
    } else {
      inView = true;
    }
    [reduceMotion, interactive].forEach(function (mq) {
      if (mq.addEventListener) mq.addEventListener("change", update);
      else if (mq.addListener) mq.addListener(update);
    });
    update();
  }

  /* ---------- Index d'ancrages (page Expertises) ---------- */
  function initIndexNav() {
    var nav = document.querySelector(".index-nav");
    if (!nav || !("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
    var map = {};
    links.forEach(function (a) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) map[t.id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
          map[e.target.id].classList.add("is-current");
          map[e.target.id].setAttribute("aria-current", "location");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---------- Formulaire de soumission ---------- */
  function initForm() {
    var form = document.querySelector("[data-quote-form]");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var submit = form.querySelector("[type='submit']");
    var submitLabel = submit.querySelector(".btn__label");
    var DEST = form.getAttribute("data-mailto") || "cml@cmlabbe.com";
    var PHONE = "450 589-3268";

    function setError(field, msg) {
      var input = form.elements[field];
      var holder = form.querySelector("[data-error-for='" + field + "']");
      if (!holder) return;
      holder.textContent = msg || "";
      var el = input && input.length && !input.tagName ? input[0] : input;
      if (el && el.setAttribute) {
        if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      }
    }
    function showStatus(kind, title, body, noFocus) {
      status.className = "form-status form-status--" + kind + " is-visible";
      status.innerHTML = "";
      var strong = document.createElement("strong");
      strong.textContent = title;
      status.appendChild(strong);
      if (body) { var p = document.createElement("p"); p.innerHTML = body; status.appendChild(p); }
      if (!noFocus) status.focus();
    }
    function value(name) {
      var el = form.elements[name];
      if (!el) return "";
      if (el.length && !el.tagName) {
        var out = [];
        Array.prototype.forEach.call(el, function (i) { if (i.checked) out.push(i.value); });
        return out.join(", ");
      }
      return (el.value || "").trim();
    }
    function validate() {
      var ok = true;
      var firstBad = null;
      function check(name, cond, msg) {
        if (!cond) { setError(name, msg); ok = false; if (!firstBad) firstBad = name; }
        else setError(name, "");
      }
      check("nom", value("nom").length > 1, "Indiquez votre nom.");
      var email = value("courriel");
      var tel = value("telephone");
      check("courriel", email === "" ? tel !== "" : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
        email === "" ? "Indiquez un courriel ou un numéro de téléphone." : "Ce courriel semble incomplet (ex. nom@entreprise.com).");
      check("telephone", tel === "" || tel.replace(/\D/g, "").length >= 10, "Le numéro doit contenir au moins 10 chiffres.");
      check("type", value("type") !== "", "Choisissez le type de bâtiment.");
      check("description", value("description").length >= 15, "Décrivez les travaux en quelques mots (15 caractères minimum).");
      if (firstBad) {
        var el = form.elements[firstBad];
        (el.length && !el.tagName ? el[0] : el).focus();
      }
      return ok;
    }
    function buildBody() {
      var lines = [
        "Nom : " + value("nom"),
        "Organisation : " + (value("organisation") || "—"),
        "Courriel : " + (value("courriel") || "—"),
        "Téléphone : " + (value("telephone") || "—"),
        "Type de bâtiment : " + value("type"),
        "Nature des travaux : " + (value("nature") || "—"),
        "Formule souhaitée : " + (value("formule") || "À déterminer"),
        "Ville du chantier : " + (value("ville") || "—"),
        "Échéance : " + (value("echeance") || "—"),
        "",
        "Description :",
        value("description")
      ];
      return lines.join("\n");
    }
    function setLoading(on) {
      submit.disabled = on;
      submit.classList.toggle("is-loading", on);
      submitLabel.textContent = on ? "Envoi en cours…" : "Envoyer ma demande";
      form.setAttribute("aria-busy", String(on));
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (value("site_web")) return; // piège à robots
      if (!validate()) {
        showStatus("error", "Quelques champs sont à corriger.", "Les champs à revoir sont indiqués en rouge.", true);
        return;
      }
      var endpoint = form.getAttribute("data-endpoint");
      var subject = "Demande de soumission — " + value("type") + (value("organisation") ? " — " + value("organisation") : "");

      if (!endpoint) {
        // Aucun service d'envoi configuré : on ouvre le courriel de l'utilisateur avec la demande pré-remplie.
        var href = "mailto:" + DEST + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildBody());
        window.location.href = href;
        showStatus("info", "Votre application de courriel devrait s'ouvrir avec votre demande.",
          "Cliquez sur « Envoyer » dans ce courriel pour nous la transmettre. Rien ne s'est ouvert? Écrivez à <a href=\"mailto:" + DEST + "\">" + DEST + "</a> ou appelez le <a href=\"tel:+14505893268\">" + PHONE + "</a>.");
        return;
      }

      setLoading(true);
      var data = new FormData(form);
      data.append("_subject", subject);
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res; })
        .then(function () {
          form.reset();
          showStatus("success", "Merci, votre demande est envoyée.",
            "Un membre de l'équipe vous recontactera. Pour un besoin pressant, appelez le <a href=\"tel:+14505893268\">" + PHONE + "</a>.");
        })
        .catch(function () {
          showStatus("error", "L'envoi n'a pas fonctionné.",
            "Vos informations sont toujours dans le formulaire. Réessayez, ou joignez-nous au <a href=\"tel:+14505893268\">" + PHONE + "</a> ou à <a href=\"mailto:" + DEST + "\">" + DEST + "</a>.");
        })
        .then(function () { setLoading(false); });
    });

    // Effacer l'erreur dès que le champ est corrigé
    form.addEventListener("input", function (e) {
      var name = e.target.name;
      if (name && e.target.getAttribute("aria-invalid") === "true") setError(name, "");
      if (name === "telephone") setError("courriel", "");
    });
    form.addEventListener("change", function (e) {
      if (e.target.name === "type") setError("type", "");
    });
  }

  /* ---------- Année du pied de page ---------- */
  function initYear() {
    var y = document.querySelectorAll("[data-year]");
    Array.prototype.forEach.call(y, function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  function init() { initNav(); initCoupe(); initIndexNav(); initForm(); initYear(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

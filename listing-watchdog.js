/* Eagle-J Connect: listing page watchdog. This is intentionally independent of script.js
   so it can show a useful message even when script.js fails to parse or initialize. */
(function () {
  "use strict";
  function showMessage(target, title, detail) {
    if (!target || target.dataset.eagleWatchdogShown === "1") return;
    target.dataset.eagleWatchdogShown = "1";
    target.innerHTML = '<div class="notice" role="alert"><span>⚠️</span><h3>' + title + '</h3><p>' + detail + '</p><p>Pa gen okenn chanjman ki fèt nan Supabase. Voye mesaj sa a bay administratè a pou dyagnostik.</p></div>';
  }
  window.addEventListener("error", function (event) {
    var target = document.getElementById("businessListings") || document.getElementById("businessDetail");
    if (!target) return;
    var message = event && event.message ? String(event.message) : "Erè JavaScript oswa fichye pa t chaje";
    showMessage(target, "Paj la rankontre yon erè JavaScript", message.slice(0, 300));
  });
  window.addEventListener("unhandledrejection", function (event) {
    var target = document.getElementById("businessListings") || document.getElementById("businessDetail");
    if (!target) return;
    var reason = event && event.reason;
    var message = reason && reason.message ? reason.message : String(reason || "Demann lan echwe");
    showMessage(target, "Paj la pa t kapab fini chaje", message.slice(0, 300));
  });
  document.addEventListener("DOMContentLoaded", function () {
    window.setTimeout(function () {
      var target = document.getElementById("businessListings") || document.getElementById("businessDetail");
      if (!target) return;
      var loading = target.querySelector(".loading-state, .notice");
      if (loading && /ap chaje|loading|⏳/i.test(loading.textContent || "")) {
        showMessage(target, "Anons yo pran twòp tan pou chaje", "Tcheke koneksyon entènèt la, epi verifye erè JavaScript ak repons Supabase. Si paj la rete konsa, voye screenshot la bay administratè a.");
      }
    }, 15000);
  });
})();

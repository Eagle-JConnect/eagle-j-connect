/* Eagle-J Connect independent recovery for a stuck public business listing. */
(function () {
  "use strict";
  var URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
  var KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  var recovered = false;

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function isLoading(box) {
    return !!(box && box.querySelector(".loading-state") &&
      /chaje|loading|⏳/i.test(box.querySelector(".loading-state").textContent || ""));
  }
  function categoryType(value) {
    var s = String(value || "").trim().toLowerCase();
    if (s.indexOf(":") >= 0) s = s.split(":")[0];
    return ["employee","employer","professional","service","business","property"].indexOf(s) >= 0 ? s : "business";
  }
  function render(box, rows) {
    var tab = document.querySelector(".market-tab.active");
    var filter = tab && tab.dataset.filter || "all";
    var search = (document.getElementById("marketSearch") || {}).value || "";
    var location = (document.getElementById("marketLocation") || {}).value || "";
    search = search.trim().toLowerCase();
    location = location.trim().toLowerCase();

    var visible = rows.filter(function (b) {
      if (filter !== "all" && categoryType(b.category) !== filter) return false;
      var searchable = [b.business_name,b.category,b.location,b.description,b.price].filter(Boolean).join(" ").toLowerCase();
      if (search && searchable.indexOf(search) < 0) return false;
      if (location) {
        var loc = String(b.location || "").toLowerCase();
        var terms = location === "bahamas" ? ["bahamas","nassau","new providence"] :
                    location === "ayiti" ? ["ayiti","haiti","haïti"] : [location];
        if (!terms.some(function (term) { return loc.indexOf(term) >= 0; })) return false;
      }
      return true;
    });

    var count = document.getElementById("marketResultCount");
    if (count) count.textContent = visible.length + " anons disponib";

    if (!visible.length) {
      box.innerHTML = "<div class='empty-state'><span>🔎</span><h3>Pa gen anons ki disponib</h3><p>Eseye chanje rechèch ou oswa filtre a.</p></div>";
      return;
    }

    box.innerHTML = visible.map(function (b) {
      var title = esc(b.business_name || "Anons");
      var img = b.image_url
        ? "<img src='" + esc(b.image_url) + "' alt='" + title + "' loading='lazy' style='width:100%;max-height:220px;object-fit:cover;border-radius:12px' onerror='this.style.display=\"none\"'>"
        : "<div class='business-card-placeholder'>🏢</div>";
      var phone = String(b.phone || "").replace(/[^0-9+]/g, "");
      var wa = String(b.whatsapp || "").replace(/\D/g, "");
      var rawCategory = String(b.category || "").split(":").slice(1).join(":") || String(b.category || "");
      var labels = {employee:"👷 Anplwaye",employer:"🏢 Anplwayè",professional:"🧑🏾‍🔧 Pwofesyonèl",service:"🛠️ Sèvis",business:"🛍️ Biznis",property:"🏠 Byen"};
      return "<article class='business-card card'>" + img +
        "<div class='business-card-body'><div class='card-kicker'>" + (labels[categoryType(b.category)] || "📌 Anons") + "</div>" +
        "<h3>" + title + "</h3><div class='meta'><span class='badge'>📍 " + esc(b.location || "—") + "</span>" +
        (rawCategory ? "<span class='badge'>" + esc(rawCategory) + "</span>" : "") + "</div>" +
        (b.price ? "<p class='price-line'>💰 " + esc(b.price) + "</p>" : "") +
        "<p class='card-description'>" + esc(b.description || "") + "</p><div class='actions'>" +
        (phone ? "<a class='btn btn-small btn-primary' href='tel:" + esc(phone) + "'>📞 Rele</a>" : "") +
        (wa ? "<a class='btn btn-small btn-secondary' target='_blank' rel='noopener' href='https://wa.me/" + esc(wa) + "'>💬 WhatsApp</a>" : "") +
        "</div><div class='view-link'><a href='anons.html?id=" + encodeURIComponent(b.id) + "'>Wè detay →</a></div></div></article>";
    }).join("");
  }

  async function recover() {
    var box = document.getElementById("businessListings");
    if (recovered || !box || !isLoading(box)) return;
    recovered = true;
    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 12000);
    try {
      var response = await fetch(URL + "/rest/v1/businesses?status=eq.approved&select=*&order=created_at.desc&limit=100", {
        method: "GET",
        headers: {"apikey": KEY, "Accept": "application/json"},
        cache: "no-store",
        signal: controller.signal
      });
      var raw = await response.text();
      var data;
      try { data = raw ? JSON.parse(raw) : []; } catch (_) { data = []; }
      if (!response.ok) throw new Error((data && (data.message || data.details || data.hint)) || ("HTTP " + response.status));
      if (!Array.isArray(data)) throw new Error("Supabase pa retounen yon lis anons.");
      window.__businessRows = data;
      render(box, data);

      ["marketSearch", "marketLocation"].forEach(function (id) {
        var node = document.getElementById(id);
        if (node && !node.dataset.eagleRecoveryBound) {
          node.dataset.eagleRecoveryBound = "1";
          node.addEventListener(id === "marketSearch" ? "input" : "change", function () { render(box, data); });
        }
      });
      document.querySelectorAll(".market-tab").forEach(function (node) {
        if (!node.dataset.eagleRecoveryBound) {
          node.dataset.eagleRecoveryBound = "1";
          node.addEventListener("click", function () {
            document.querySelectorAll(".market-tab").forEach(function (tab) { tab.classList.toggle("active", tab === node); });
            render(box, data);
          });
        }
      });
    } catch (err) {
      console.error("Eagle-J recovery fetch failed:", err);
      box.innerHTML = "<div class='notice' role='alert'><h3>Nou pa kapab chaje biznis yo.</h3><p>" +
        esc(err && err.name === "AbortError" ? "Demann nan pran twòp tan. Verifye koneksyon an epi eseye ankò." : (err.message || "Erè rezo")) +
        "</p><button type='button' class='btn btn-primary' onclick='location.reload()'>Eseye ankò</button></div>";
    } finally {
      window.clearTimeout(timeout);
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    window.setTimeout(recover, 3000);
  });
})();

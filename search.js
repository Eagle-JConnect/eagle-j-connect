/* Eagle-J Connect — Global Search */
(function(){
  "use strict";
  let jobs = [];
  let businesses = [];
  let currentType = "all";
  let lastQuery = "";

  const q = id => document.getElementById(id);
  const escHtml = value => (typeof esc === "function" ? esc(value) : String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));

  function normalize(value){
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  function searchable(row){
    return normalize([
      row.title,row.job_title,row.position,row.company,row.company_name,row.business_name,
      row.category,row.business_type,row.location,row.description,row.skills,row.full_name
    ].join(" "));
  }

  function card(item, type){
    if(type === "jobs"){
      const title = escHtml(item.title || item.job_title || item.position || "Job");
      const company = escHtml(item.company || item.company_name || "");
      const location = escHtml(item.location || "—");
      const kind = escHtml(String(item.job_type || "").replace(/_/g," "));
      return `<article class="card search-result-card">
        <div class="card-kicker">💼 JOB</div>
        <h3>${title}</h3>
        ${company ? `<p><strong>${company}</strong></p>` : ""}
        <p>📍 ${location}</p>
        ${kind ? `<span class="badge">${kind}</span>` : ""}
        <a class="btn btn-primary" href="travay.html" data-i18n="view-jobs">View Jobs →</a>
      </article>`;
    }
    const name = escHtml(item.business_name || item.title || "Business");
    const location = escHtml(item.location || "—");
    const category = escHtml(item.category || item.business_type || "Business / Service");
    return `<article class="card search-result-card">
      <div class="card-kicker">🏢 BUSINESS</div>
      <h3>${name}</h3>
      <p><strong>${category}</strong></p>
      <p>📍 ${location}</p>
      <a class="btn btn-primary" href="anons.html?id=${encodeURIComponent(item.id || "")}" data-i18n="view-business">View Details →</a>
    </article>`;
  }

  function render(){
    const box = q("searchResults");
    if(!box) return;
    const query = normalize(lastQuery);
    const match = row => !query || searchable(row).includes(query);
    const jobRows = (currentType === "all" || currentType === "jobs") ? jobs.filter(match) : [];
    const businessRows = (currentType === "all" || currentType === "businesses") ? businesses.filter(match) : [];
    const total = jobRows.length + businessRows.length;

    if(q("searchStatus")) q("searchStatus").textContent = lastQuery ? `${total} result${total === 1 ? "" : "s"}` : "";
    if(!lastQuery){
      box.innerHTML = `<div class="empty-state"><div class="empty-icon">🔎</div><h3 data-i18n="search-start-title">Start your search</h3><p data-i18n="search-start-text">Enter a keyword above to discover what is available.</p></div>`;
      if(window.EagleJLanguage?.apply) window.EagleJLanguage.apply();
      return;
    }
    if(!total){
      box.innerHTML = `<div class="empty-state"><div class="empty-icon">😕</div><h3 data-i18n="search-no-results">No results found</h3><p data-i18n="search-no-results-text">Try another keyword or choose a different category.</p></div>`;
      if(window.EagleJLanguage?.apply) window.EagleJLanguage.apply();
      return;
    }
    box.innerHTML = jobRows.map(x=>card(x,"jobs")).concat(businessRows.map(x=>card(x,"businesses"))).join("");
  }

  async function runSearch(term){
    lastQuery = String(term || "").trim();
    const box = q("searchResults");
    if(!box || !lastQuery) { render(); return; }
    box.innerHTML = `<div class="loading-state"><span>⏳</span><p>Searching...</p></div>`;
    try{
      const [jobRows, businessRows] = await Promise.all([
        api("/rest/v1/jobs?status=eq.approved&select=*&order=created_at.desc"),
        api("/rest/v1/businesses?status=eq.approved&select=*&order=created_at.desc")
      ]);
      jobs = Array.isArray(jobRows) ? jobRows : [];
      businesses = Array.isArray(businessRows) ? businessRows : [];
      render();
    }catch(error){
      console.error("Global search:", error);
      box.innerHTML = `<div class="notice">⚠️ ${escHtml(error.message || "Search failed.")}</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    const form = q("globalSearchForm");
    const input = q("globalSearchInput");
    form?.addEventListener("submit", function(e){
      e.preventDefault();
      runSearch(input?.value);
    });
    document.querySelectorAll(".search-filter").forEach(btn=>{
      btn.addEventListener("click", function(){
        document.querySelectorAll(".search-filter").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
        currentType = btn.dataset.type || "all";
        render();
      });
    });
    const params = new URLSearchParams(location.search);
    const initial = params.get("q") || "";
    if(initial && input){
      input.value = initial;
      runSearch(initial);
    }
  });
})();
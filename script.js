
/* =========================================================
   BUSINESS LISTINGS — LIGHTER AND SAFER LOADING
========================================================= */

async function loadBusinesses() {
  const box = qs("businessListings");
  if (!box) return;

  box.innerHTML = `
    <div class="loading-state">
      <span>⏳</span>
      <p>Anons yo ap chaje...</p>
    </div>
  `;

  try {
    const rows = await publicApi(
      "/rest/v1/businesses?status=eq.approved&select=id,business_name,category,location,phone,whatsapp,price,description,image_url,created_at&order=created_at.desc&limit=20"
    );

    window.__businessRows = Array.isArray(rows) ? rows : [];

    renderBusinesses();

  } catch (err) {
    console.error("Public businesses:", err);

    window.__businessRows = [];

    box.innerHTML = `
      <div class="notice" role="alert">
        <h3>Nou pa kapab chaje anons yo kounye a.</h3>
        <p>Tanpri eseye rafrechi paj la.</p>
        <small>${esc(err?.message || "Erè enkoni")}</small>
        <p>
          <button type="button" class="btn btn-primary"
            onclick="loadBusinesses()">
            Eseye ankò
          </button>
        </p>
      </div>
    `;
  }
}

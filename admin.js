/* Eagle-J Connect — Admin Dashboard v8 */

(function () {
  const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";

  let users = [];
  let jobs = [];
  let businesses = [];

  const $ = id => document.getElementById(id);

  const esc = value => {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  };

  function getSession() {
    const token = localStorage.getItem("supabase_access_token");
    const rawUser = localStorage.getItem("supabase_user");

    if (!token || !rawUser) return null;

    try {
      const user = JSON.parse(rawUser);

      if (!user?.id) return null;

      return {
        token,
        user
      };
    } catch (error) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem("supabase_access_token");
    localStorage.removeItem("supabase_refresh_token");
    localStorage.removeItem("supabase_user");
    localStorage.removeItem("supabase_user_id");
    localStorage.removeItem("supabase_user_email");
    localStorage.removeItem("supabase_full_name");
    localStorage.removeItem("supabase_phone");
    localStorage.removeItem("supabase_account_type");
  }

  function showMessage(text, type = "error") {
    const el = $("adminMessage");

    if (!el) return;

    el.textContent = text;
    el.className = "notice-admin " + type;
    el.classList.remove("hidden");
  }

  function hideAdminApp() {
    $("adminApp")?.classList.add("hidden");
  }

  function showAdminApp() {
    $("adminApp")?.classList.remove("hidden");
  }

  async function api(path, options = {}) {
    const session = getSession();

    const headers = {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    const response = await fetch(SUPABASE_URL + path, {
      ...options,
      headers
    });

    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.msg ||
        data?.error_description ||
        data?.details ||
        `Request failed (${response.status})`
      );
    }

    return data;
  }

  function statusLabel(status) {
    const labels = {
      pending: "⏳ Pending",
      approved: "✅ Piblik",
      rejected: "❌ Refize",
      unavailable: "🚫 Pa disponib",
      active: "✅ Aktif",
      disabled: "🚫 Dezaktive"
    };

    return labels[status] || status || "—";
  }

  /*
   * ADMIN SECURITY
   *
   * Admin UID la dwe egziste nan public.admin_users.
   * Nou verifye user_id a dirèkteman.
   */
  async function checkAdmin() {
    const session = getSession();

    hideAdminApp();

    if (!session) {
      showMessage("❌ Ou dwe konekte anvan ou antre nan Admin Dashboard.", "error");

      setTimeout(() => {
        location.href = "login.html";
      }, 1200);

      return false;
    }

    if (!session.user.id) {
      clearSession();

      showMessage("❌ Sesyon itilizatè a pa valab.", "error");

      setTimeout(() => {
        location.href = "login.html";
      }, 1200);

      return false;
    }

    try {
      const rows = await api(
        `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(
          session.user.id
        )}&select=user_id`
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        hideAdminApp();

        showMessage(
          "❌ Aksè refize. Kont sa a pa gen dwa administratè.",
          "error"
        );

        return false;
      }

      showAdminApp();

      await Promise.all([
        loadAdminUsers(),
        loadAdminJobs(),
        loadAdminBusinesses()
      ]);

      return true;

    } catch (error) {
      console.error("Admin verification error:", error);

      hideAdminApp();

      showMessage(
        "❌ Nou pa kapab verifye aksè administratè a: " +
        error.message,
        "error"
      );

      return false;
    }
  }

  /* =========================
     USERS
  ========================= */

  window.loadAdminUsers = async function () {
    const body = $("adminUsersBody");

    if (body) {
      body.innerHTML =
        '<tr><td colspan="6">⏳ Nap chaje itilizatè yo...</td></tr>';
    }

    try {
      users = await api(
        "/rest/v1/profiles" +
        "?select=id,full_name,email,phone,account_type,account_status" +
        "&order=full_name.asc"
      );

      users = Array.isArray(users) ? users : [];

      renderUsers();

    } catch (error) {
      console.error(error);

      if (body) {
        body.innerHTML =
          `<tr><td colspan="6">❌ ${esc(error.message)}</td></tr>`;
      }

      showMessage(
        "❌ Nou pa kapab chaje itilizatè yo. Verifye RLS admin lan.",
        "error"
      );
    }
  };

  function renderUsers() {
    const query =
      ($("adminUserSearch")?.value || "")
        .toLowerCase()
        .trim();

    const type =
      $("adminTypeFilter")?.value || "";

    const accountStatus =
      $("adminAccountStatusFilter")?.value || "";

    const filtered = users.filter(user => {
      const haystack = [
        user.full_name,
        user.phone,
        user.id,
        user.email
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || haystack.includes(query)) &&
        (!type || user.account_type === type) &&
        (!accountStatus || user.account_status === accountStatus)
      );
    });

    if ($("adminUserCount")) {
      $("adminUserCount").textContent = users.length;
    }

    if ($("adminDisabledUserCount")) {
      $("adminDisabledUserCount").textContent =
        users.filter(
          user => user.account_status === "disabled"
        ).length;
    }

    const body = $("adminUsersBody");

    if (!body) return;

    if (!filtered.length) {
      body.innerHTML =
        '<tr><td colspan="6">Pa gen itilizatè ki koresponn.</td></tr>';
      return;
    }

    const currentUserId = getSession()?.user?.id;

    body.innerHTML = filtered.map(user => {
      const isSelf = currentUserId === user.id;
      const disabled = user.account_status === "disabled";

      return `
        <tr>
          <td>${esc(user.full_name || "—")}</td>

          <td class="email-cell">
            ${esc(user.email || "—")}
          </td>

          <td>
            ${esc(user.phone || "—")}
          </td>

          <td>
            ${esc(user.account_type || "—")}
          </td>

          <td>
            ${esc(
              statusLabel(
                user.account_status || "active"
              )
            )}
          </td>

          <td>
            ${
              isSelf
                ? `<span class="admin-muted">Kont pa ou</span>`
                : `
                  <button
                    class="save-btn"
                    type="button"
                    onclick="setUserStatus(
                      '${esc(user.id)}',
                      '${disabled ? "active" : "disabled"}'
                    )"
                  >
                    ${disabled ? "🔓 Aktive" : "🚫 Dezaktive"}
                  </button>

                  <button
                    class="danger-btn"
                    type="button"
                    onclick="removeUser('${esc(user.id)}')"
                  >
                    🗑️ Retire
                  </button>
                `
            }
          </td>
        </tr>
      `;
    }).join("");
  }

  window.setUserStatus = async function (id, status) {
    const currentUserId = getSession()?.user?.id;

    if (!id || id === currentUserId) {
      showMessage(
        "❌ Ou pa kapab chanje pwòp kont Admin ou la.",
        "error"
      );
      return;
    }

    try {
      await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            account_status: status
          })
        }
      );

      showMessage(
        status === "disabled"
          ? "🚫 Kont lan dezaktive."
          : "✅ Kont lan aktive ankò.",
        "success"
      );

      await loadAdminUsers();

    } catch (error) {
      console.error(error);

      showMessage(
        "❌ " + error.message,
        "error"
      );
    }
  };

  window.removeUser = async function (id) {
    const session = getSession();

    if (!session || session.user.id === id) {
      return;
    }

    const confirmed = confirm(
      "Retire pwofil itilizatè sa a?\n\n" +
      "Sa ap efase pwofil la nan public.profiles, " +
      "men li PAP efase Auth user la nan Supabase."
    );

    if (!confirmed) return;

    try {
      await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      );

      showMessage(
        "🗑️ Pwofil itilizatè a retire.",
        "success"
      );

      await loadAdminUsers();

    } catch (error) {
      console.error(error);

      showMessage(
        "❌ Pa kapab retire pwofil la: " +
        error.message,
        "error"
      );
    }
  };

  /* =========================
     JOBS
  ========================= */

  function jobMatches(job) {
    const query =
      ($("adminJobSearch")?.value || "")
        .toLowerCase()
        .trim();

    if (!query) return true;

    return [
      job.title,
      job.company,
      job.company_name,
      job.location,
      job.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  }

  window.loadAdminJobs = async function () {
    const body = $("adminJobsBody");

    if (body) {
      body.innerHTML =
        '<tr><td colspan="6">⏳ Nap chaje travay yo...</td></tr>';
    }

    try {
      const status =
        $("adminJobStatusFilter")?.value || "";

      const filter = status
        ? `&status=eq.${encodeURIComponent(status)}`
        : "";

      jobs = await api(
        `/rest/v1/jobs?select=*&order=created_at.desc${filter}`
      );

      jobs = Array.isArray(jobs) ? jobs : [];

      renderJobs();

      if ($("adminPendingJobCount")) {
        $("adminPendingJobCount").textContent =
          jobs.filter(j => j.status === "pending").length;
      }

      if ($("adminActiveJobCount")) {
        $("adminActiveJobCount").textContent =
          jobs.filter(j => j.status === "approved").length;
      }

    } catch (error) {
      console.error(error);

      if (body) {
        body.innerHTML =
          `<tr><td colspan="6">❌ ${esc(error.message)}</td></tr>`;
      }

      showMessage(
        "❌ Nou pa kapab chaje travay yo: " +
        error.message,
        "error"
      );
    }
  };

  function renderJobs() {
    const body = $("adminJobsBody");

    if (!body) return;

    const rows = jobs.filter(jobMatches);

    if (!rows.length) {
      body.innerHTML =
        '<tr><td colspan="6">Pa gen travay nan kategori sa a.</td></tr>';
      return;
    }

    body.innerHTML = rows.map(job => `
      <tr>
        <td>
          <strong>
            ${esc(job.title || "Travay")}
          </strong>
          <br>
          <small>
            ${esc(job.description || "")}
          </small>
        </td>

        <td>
          ${esc(
            job.company ||
            job.company_name ||
            "—"
          )}
        </td>

        <td>
          ${esc(job.location || "—")}
        </td>

        <td>
          ${esc(statusLabel(job.status))}
        </td>

        <td>
          ${esc(
            job.created_at
              ? new Date(job.created_at)
                  .toLocaleDateString()
              : "—"
          )}
        </td>

        <td>
          ${moderationButtons(
            "job",
            job.id,
            job.status
          )}
        </td>
      </tr>
    `).join("");
  }

  /* =========================
     BUSINESSES
  ========================= */

  function businessMatches(business) {
    const query =
      ($("adminBusinessSearch")?.value || "")
        .toLowerCase()
        .trim();

    if (!query) return true;

    return [
      business.business_name,
      business.category,
      business.location,
      business.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  }

  window.loadAdminBusinesses = async function () {
    const body = $("adminBusinessesBody");

    if (body) {
      body.innerHTML =
        '<tr><td colspan="6">⏳ Nap chaje anons yo...</td></tr>';
    }

    try {
      const status =
        $("adminBusinessStatusFilter")?.value || "";

      const filter = status
        ? `&status=eq.${encodeURIComponent(status)}`
        : "";

      businesses = await api(
        `/rest/v1/businesses?select=*&order=created_at.desc${filter}`
      );

      businesses = Array.isArray(businesses)
        ? businesses
        : [];

      renderBusinesses();

      if ($("adminPendingBusinessCount")) {
        $("adminPendingBusinessCount").textContent =
          businesses.filter(
            b => b.status === "pending"
          ).length;
      }

      if ($("adminActiveBusinessCount")) {
        $("adminActiveBusinessCount").textContent =
          businesses.filter(
            b => b.status === "approved"
          ).length;
      }

    } catch (error) {
      console.error(error);

      if (body) {
        body.innerHTML =
          `<tr><td colspan="6">❌ ${esc(error.message)}</td></tr>`;
      }

      showMessage(
        "❌ Nou pa kapab chaje anons yo: " +
        error.message,
        "error"
      );
    }
  };

  function renderBusinesses() {
    const body = $("adminBusinessesBody");

    if (!body) return;

    const rows = businesses.filter(
      businessMatches
    );

    if (!rows.length) {
      body.innerHTML =
        '<tr><td colspan="6">Pa gen anons nan kategori sa a.</td></tr>';
      return;
    }

    body.innerHTML = rows.map(business => `
      <tr>
        <td>
          <strong>
            ${esc(
              business.business_name ||
              "Anons"
            )}
          </strong>

          <br>

          <small>
            ${esc(
              business.description || ""
            )}
          </small>
        </td>

        <td>
          ${esc(
            business.category || "—"
          )}
        </td>

        <td>
          ${esc(
            business.location || "—"
          )}
        </td>

        <td>
          ${esc(
            statusLabel(business.status)
          )}
        </td>

        <td>
          ${esc(
            business.created_at
              ? new Date(
                  business.created_at
                ).toLocaleDateString()
              : "—"
          )}
        </td>

        <td>
          ${moderationButtons(
            "business",
            business.id,
            business.status
          )}
        </td>
      </tr>
    `).join("");
  }

  /* =========================
     MODERATION
  ========================= */

  function moderationButtons(
    kind,
    id,
    status
  ) {
    return `
      <div class="admin-button-group">

        ${
          status !== "approved"
            ? `
              <button
                class="save-btn"
                type="button"
                onclick="moderate(
                  '${kind}',
                  '${esc(id)}',
                  'approved'
                )"
              >
                ✅ Valide
              </button>
            `
            : ""
        }

        ${
          status !== "rejected"
            ? `
              <button
                class="danger-outline"
                type="button"
                onclick="moderate(
                  '${kind}',
                  '${esc(id)}',
                  'rejected'
                )"
              >
                ❌ Refize
              </button>
            `
            : ""
        }

        ${
          status !== "unavailable"
            ? `
              <button
                class="warning-btn"
                type="button"
                onclick="moderate(
                  '${kind}',
                  '${esc(id)}',
                  'unavailable'
                )"
              >
                🚫 Pa disponib
              </button>
            `
            : ""
        }

        <button
          class="danger-btn"
          type="button"
          onclick="deleteListing(
            '${kind}',
            '${esc(id)}'
          )"
        >
          🗑️ Efase
        </button>

      </div>
    `;
  }

  window.moderate = async function (
    kind,
    id,
    status
  ) {
    try {
      const table =
        kind === "job"
          ? "jobs"
          : "businesses";

      await api(
        `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal"
          },
          body: JSON.stringify({
            status
          })
        }
      );

      showMessage(
        `✅ ${
          kind === "job"
            ? "Travay la"
            : "Anons la"
        } mete kòm ${statusLabel(status)}.`,
        "success"
      );

      if (kind === "job") {
        await loadAdminJobs();
      } else {
        await loadAdminBusinesses();
      }

    } catch (error) {
      console.error(error);

      showMessage(
        "❌ Pa kapab chanje status la: " +
        error.message,
        "error"
      );
    }
  };

  window.deleteListing = async function (
    kind,
    id
  ) {
    const confirmed = confirm(
      "Efase anons sa a nèt nan baz done a?"
    );

    if (!confirmed) return;

    try {
      const table =
        kind === "job"
          ? "jobs"
          : "businesses";

      await api(
        `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      );

      showMessage(
        "🗑️ Anons la efase.",
        "success"
      );

      if (kind === "job") {
        await loadAdminJobs();
      } else {
        await loadAdminBusinesses();
      }

    } catch (error) {
      console.error(error);

      showMessage(
        "❌ Pa kapab efase anons la: " +
        error.message,
        "error"
      );
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  function logoutAdmin() {
    clearSession();
    location.href = "login.html";
  }

  window.logoutAdmin = logoutAdmin;

  /* =========================
     START
  ========================= */

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      $("adminUserSearch")
        ?.addEventListener(
          "input",
          renderUsers
        );

      $("adminTypeFilter")
        ?.addEventListener(
          "change",
          renderUsers
        );

      $("adminAccountStatusFilter")
        ?.addEventListener(
          "change",
          renderUsers
        );

      $("adminJobSearch")
        ?.addEventListener(
          "input",
          renderJobs
        );

      $("adminJobStatusFilter")
        ?.addEventListener(
          "change",
          loadAdminJobs
        );

      $("adminBusinessSearch")
        ?.addEventListener(
          "input",
          renderBusinesses
        );

      $("adminBusinessStatusFilter")
        ?.addEventListener(
          "change",
          loadAdminBusinesses
        );

      checkAdmin();
    }
  );

})(); 

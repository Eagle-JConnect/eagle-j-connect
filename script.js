/* =========================================================
   EAGLE-J CONNECT
   Main Application Script
========================================================= */

const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
const IMAGE_BUCKET = "business-images";


/* =========================================================
   HELPERS
========================================================= */

function qs(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showMessage(message, type = "info") {
  const box =
    qs("message") ||
    qs("formMessage") ||
    qs("successMessage") ||
    qs("errorMessage");

  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.className = `message ${type}`;
  box.style.display = "block";
}

function getSession() {

  const token =
    localStorage.getItem("supabase_access_token") || "";

  const refreshToken =
    localStorage.getItem("supabase_refresh_token") || "";

  let user = null;

  try {
    const raw =
      localStorage.getItem("supabase_user");

    if (raw) {
      user = JSON.parse(raw);
    }
  } catch (e) {
    user = null;
  }

  const userId =
    user?.id ||
    localStorage.getItem("supabase_user_id") ||
    "";

  const email =
    user?.email ||
    localStorage.getItem("supabase_user_email") ||
    "";

  if (!token || !userId) {
    return null;
  }

  return {
    token,
    refreshToken,
    user,
    userId,
    email
  };
}


function saveSession(data) {

  if (!data) return;

  if (data.access_token) {
    localStorage.setItem(
      "supabase_access_token",
      data.access_token
    );
  }

  if (data.refresh_token) {
    localStorage.setItem(
      "supabase_refresh_token",
      data.refresh_token
    );
  }

  if (data.user) {

    localStorage.setItem(
      "supabase_user",
      JSON.stringify(data.user)
    );

    if (data.user.id) {
      localStorage.setItem(
        "supabase_user_id",
        data.user.id
      );
    }

    if (data.user.email) {
      localStorage.setItem(
        "supabase_user_email",
        data.user.email
      );
    }

  }

}


function clearSession() {

  const keys = [
    "supabase_access_token",
    "supabase_refresh_token",
    "supabase_user",
    "supabase_user_id",
    "supabase_user_email",
    "eagle_j_is_admin",
    "eagle_j_account_type",
    "eagle_j_full_name",
    "eagle_j_phone"
  ];

  keys.forEach(key =>
    localStorage.removeItem(key)
  );

}


window.logoutUser = function () {

  clearSession();

  location.href = "login.html";

};


/* =========================================================
   SUPABASE API
========================================================= */

async function api(path, options = {}) {

  const session = getSession();

  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (session?.token) {
    headers.Authorization =
      `Bearer ${session.token}`;
  }

  const response =
    await fetch(
      `${SUPABASE_URL}${path}`,
      {
        ...options,
        headers
      }
    );

  return response;
}


async function publicApi(path, options = {}) {

  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  delete headers.Authorization;

  return fetch(
    `${SUPABASE_URL}${path}`,
    {
      ...options,
      headers
    }
  );

}


async function readResponse(response) {

  const text =
    await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

  const menu =
    document.getElementById("navMenu") ||
    document.getElementById("menu");

  const button =
    document.getElementById("menuToggle") ||
    document.querySelector(".menu-toggle");

  if (!menu || !button) {
    return;
  }

  if (
    button.dataset.eagleMenuReady === "1"
  ) {
    return;
  }

  button.dataset.eagleMenuReady = "1";

  button.setAttribute(
    "aria-expanded",
    "false"
  );


  function closeMenu() {

    menu.classList.remove("show");

    button.setAttribute(
      "aria-expanded",
      "false"
    );

  }


  function toggleMenu(event) {

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const opened =
      !menu.classList.contains("show");

    menu.classList.toggle(
      "show",
      opened
    );

    button.setAttribute(
      "aria-expanded",
      opened ? "true" : "false"
    );

  }


  button.addEventListener(
    "click",
    toggleMenu
  );


  menu.querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  document.addEventListener(
    "click",
    event => {

      if (!menu.classList.contains("show")) {
        return;
      }

      if (
        menu.contains(event.target) ||
        button.contains(event.target)
      ) {
        return;
      }

      closeMenu();

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeMenu();
      }

    }
  );

}


window.toggleMenu = function () {

  const menu =
    document.getElementById("navMenu") ||
    document.getElementById("menu");

  const button =
    document.getElementById("menuToggle") ||
    document.querySelector(".menu-toggle");

  if (!menu) return;

  const opened =
    !menu.classList.contains("show");

  menu.classList.toggle(
    "show",
    opened
  );

  if (button) {

    button.setAttribute(
      "aria-expanded",
      opened ? "true" : "false"
    );

  }

};


/* =========================================================
   LOGOUT BUTTON
========================================================= */

function setupLogout() {

  const logoutBtn =
    qs("logoutBtn");

  if (!logoutBtn) {
    return;
  }

  if (
    logoutBtn.dataset.logoutReady === "1"
  ) {
    return;
  }

  logoutBtn.dataset.logoutReady = "1";

  logoutBtn.addEventListener(
    "click",
    function (event) {

      event.preventDefault();

      logoutUser();

    }
  );

}


/* =========================================================
   REGISTER
========================================================= */

async function registerUser(event) {

  event.preventDefault();

  const firstName =
    qs("firstName")?.value.trim() || "";

  const lastName =
    qs("lastName")?.value.trim() || "";

  const email =
    qs("email")?.value.trim().toLowerCase() || "";

  const phone =
    qs("phone")?.value.trim() || "";

  const accountType =
    qs("accountType")?.value || "job_seeker";

  const password =
    qs("password")?.value || "";

  const confirmPassword =
    qs("confirmPassword")?.value || "";


  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {

    showMessage(
      "Tanpri ranpli tout chan obligatwa yo.",
      "error"
    );

    return;
  }


  if (password.length < 6) {

    showMessage(
      "Modpas la dwe gen omwen 6 karaktè.",
      "error"
    );

    return;
  }


  if (password !== confirmPassword) {

    showMessage(
      "Modpas yo pa menm.",
      "error"
    );

    return;
  }


  const button =
    event.submitter ||
    qs("registerButton");

  if (button) {
    button.disabled = true;
  }


  try {

    const fullName =
      `${firstName} ${lastName}`.trim();


    const response =
      await fetch(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
          method: "POST",

          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            email,

            password,

            data: {
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              phone,
              account_type: accountType
            }

          })

        }
      );


    const data =
      await readResponse(response);


    if (!response.ok) {

      throw new Error(
        data?.msg ||
        data?.message ||
        data?.error_description ||
        "Registration failed."
      );

    }


    /*
      If Supabase returns a session immediately,
      save it.
    */

    if (data?.access_token) {
      saveSession(data);
    }


    /*
      Try creating the profile.
      If email confirmation is enabled,
      this may not be possible yet.
    */

    if (data?.user?.id && data?.access_token) {

      try {

        await api(
          "/rest/v1/profiles",
          {
            method: "POST",

            headers: {
              Prefer:
                "return=representation"
            },

            body: JSON.stringify({

              id: data.user.id,

              full_name: fullName,

              email,

              phone,

              account_type: accountType

            })

          }
        );

      } catch (profileError) {

        console.warn(
          "Profile creation warning:",
          profileError
        );

      }

    }


    showMessage(
      "Kont ou kreye avèk siksè. Kounye a konekte.",
      "success"
    );


    setTimeout(
      () => {
        location.href = "login.html";
      },
      1200
    );


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    showMessage(
      error.message ||
      "Nou pa kapab kreye kont lan.",
      "error"
    );

  } finally {

    if (button) {
      button.disabled = false;
    }

  }

}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(event) {

  event.preventDefault();


  const email =
    qs("email")?.value.trim().toLowerCase() || "";

  const password =
    qs("password")?.value || "";


  if (!email || !password) {

    showMessage(
      "Tanpri antre email ak modpas ou.",
      "error"
    );

    return;
  }


  const button =
    event.submitter ||
    qs("loginButton");


  if (button) {
    button.disabled = true;
  }


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",

          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })

        }
      );


    const data =
      await readResponse(response);


    if (!response.ok) {

      throw new Error(
        data?.msg ||
        data?.message ||
        data?.error_description ||
        "Email oswa modpas la pa kòrèk."
      );

    }


    saveSession(data);


    const userId =
      data.user?.id;


    if (!userId) {
      throw new Error(
        "Nou pa jwenn ID itilizatè a."
      );
    }


    /* Load profile */

    let profile = null;


    try {

      const profileResponse =
        await api(
          `/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`
        );


      if (profileResponse.ok) {

        const profiles =
          await profileResponse.json();

        profile =
          Array.isArray(profiles)
            ? profiles[0]
            : null;

      }

    } catch (e) {

      console.warn(
        "Profile loading warning:",
        e
      );

    }


    if (profile) {

      if (profile.full_name) {

        localStorage.setItem(
          "eagle_j_full_name",
          profile.full_name
        );

      }

      if (profile.phone) {

        localStorage.setItem(
          "eagle_j_phone",
          profile.phone
        );

      }

      if (profile.account_type) {

        localStorage.setItem(
          "eagle_j_account_type",
          profile.account_type
        );

      }

    }


    /* Check Admin */

    let isAdmin = false;


    try {

      const adminResponse =
        await api(
          `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(userId)}&select=user_id`
        );


      if (adminResponse.ok) {

        const admins =
          await adminResponse.json();

        isAdmin =
          Array.isArray(admins) &&
          admins.length > 0;

      }

    } catch (e) {

      console.warn(
        "Admin check warning:",
        e
      );

    }


    localStorage.setItem(
      "eagle_j_is_admin",
      isAdmin ? "1" : "0"
    );


    const accountType =
      profile?.account_type ||
      data.user?.user_metadata?.account_type ||
      localStorage.getItem(
        "eagle_j_account_type"
      ) ||
      "job_seeker";


    localStorage.setItem(
      "eagle_j_account_type",
      accountType
    );


    showMessage(
      "Ou konekte avèk siksè!",
      "success"
    );


    setTimeout(
      () => {

        if (isAdmin) {

          location.href =
            "admin.html";

        } else if (
          accountType === "employer"
        ) {

          location.href =
            "employer.html";

        } else {

          location.href =
            "dashboard.html";

        }

      },
      500
    );


  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    showMessage(
      error.message ||
      "Nou pa kapab konekte.",
      "error"
    );

  } finally {

    if (button) {
      button.disabled = false;
    }

  }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

  const session =
    getSession();

  if (!session) {

    location.href =
      "login.html";

    return;

  }


  try {

    const response =
      await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(session.userId)}&select=*`
      );


    if (!response.ok) {
      return;
    }


    const profiles =
      await response.json();


    const profile =
      Array.isArray(profiles)
        ? profiles[0]
        : null;


    if (!profile) {
      return;
    }


    const name =
      profile.full_name ||
      session.user?.user_metadata?.full_name ||
      session.email;


    if (qs("profileName")) {
      qs("profileName").textContent =
        name;
    }

    if (qs("profileEmail")) {
      qs("profileEmail").textContent =
        profile.email ||
        session.email;
    }

    if (qs("profilePhone")) {
      qs("profilePhone").textContent =
        profile.phone ||
        "—";
    }

    if (qs("profileType")) {
      qs("profileType").textContent =
        profile.account_type ||
        "job_seeker";
    }


    const employerActions =
      qs("employerActions");

    const jobSeekerActions =
      qs("jobSeekerActions");


    if (
      profile.account_type === "employer"
    ) {

      if (employerActions) {
        employerActions.style.display =
          "block";
      }

      if (jobSeekerActions) {
        jobSeekerActions.style.display =
          "none";
      }

    } else {

      if (employerActions) {
        employerActions.style.display =
          "none";
      }

      if (jobSeekerActions) {
        jobSeekerActions.style.display =
          "block";
      }

    }


  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }

}


/* =========================================================
   EMPLOYER DASHBOARD
========================================================= */

async function loadEmployerDashboard() {

  const session =
    getSession();

  if (!session) {

    location.href =
      "login.html";

    return;

  }


  try {

    const response =
      await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(session.userId)}&select=*`
      );


    if (!response.ok) {
      return;
    }


    const profiles =
      await response.json();


    const profile =
      Array.isArray(profiles)
        ? profiles[0]
        : null;


    if (!profile) {
      return;
    }


    if (
      profile.account_type !== "employer"
    ) {

      location.href =
        "dashboard.html";

      return;

    }


    if (qs("employerName")) {

      qs("employerName").textContent =
        profile.full_name ||
        session.email;

    }

    if (qs("employerEmail")) {

      qs("employerEmail").textContent =
        profile.email ||
        session.email;

    }

    if (qs("employerPhone")) {

      qs("employerPhone").textContent =
        profile.phone ||
        "—";

    }


    await loadMyJobs();

  } catch (error) {

    console.error(
      "Employer dashboard error:",
      error
    );

  }

}


/* =========================================================
   POST JOB
========================================================= */

async function postJob(event) {

  event.preventDefault();


  const session =
    getSession();

  if (!session) {

    location.href =
      "login.html";

    return;

  }


  const jobTitle =
    qs("jobTitle")?.value.trim() || "";

  const jobCompany =
    qs("jobCompany")?.value.trim() || "";

  const jobLocation =
    qs("jobLocation")?.value.trim() || "";

  const jobType =
    qs("jobType")?.value || "";

  const jobSalary =
    qs("jobSalary")?.value.trim() || "";

  const jobDescription =
    qs("jobDescription")?.value.trim() || "";

  const jobContact =
    qs("jobContact")?.value.trim() || "";


  if (
    !jobTitle ||
    !jobCompany ||
    !jobLocation ||
    !jobDescription
  ) {

    showMessage(
      "Tanpri ranpli enfòmasyon travay la.",
      "error"
    );

    return;

  }


  const button =
    event.submitter;


  if (button) {
    button.disabled = true;
  }


  try {

    const response =
      await api(
        "/rest/v1/jobs",
        {
          method: "POST",

          headers: {
            Prefer:
              "return=representation"
          },

          body: JSON.stringify({

            employer_id:
              session.userId,

            title:
              jobTitle,

            company:
              jobCompany,

            location:
              jobLocation,

            job_type:
              jobType,

            salary:
              jobSalary,

            description:
              jobDescription,

            contact:
              jobContact

          })

        }
      );


    const data =
      await readResponse(response);


    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.details ||
        data?.hint ||
        "Nou pa kapab poste travay la."
      );

    }


    showMessage(
      "Travay la poste avèk siksè!",
      "success"
    );


    qs("jobForm")?.reset();

    await loadMyJobs();


  } catch (error) {

    console.error(
      "Post job error:",
      error
    );

    showMessage(
      error.message ||
      "Nou pa kapab poste travay la.",
      "error"
    );

  } finally {

    if (button) {
      button.disabled = false;
    }

  }

}


/* =========================================================
   LOAD PUBLIC JOBS
========================================================= */

async function loadJobs() {

  try {

    const response =
      await publicApi(
        "/rest/v1/jobs?select=*&order=created_at.desc"
      );


    if (!response.ok) {

      throw new Error(
        `Jobs error ${response.status}`
      );

    }


    const jobs =
      await response.json();


    window.__jobsRows =
      Array.isArray(jobs)
        ? jobs
        : [];


    renderJobs();

  } catch (error) {

    console.error(
      "Load jobs error:",
      error
    );

    const container =
      qs("jobsList");

    if (container) {

      container.innerHTML =
        `<p>Nou pa kapab chaje travay yo.</p>`;

    }

  }

}


/* =========================================================
   RENDER JOBS
========================================================= */

function renderJobs() {

  const container =
    qs("jobsList");

  if (!container) {
    return;
  }


  let jobs =
    Array.isArray(window.__jobsRows)
      ? [...window.__jobsRows]
      : [];


  const search =
    qs("searchJob")?.value
      .trim()
      .toLowerCase() || "";


  const filter =
    qs("jobFilter")?.value || "";


  if (search) {

    jobs =
      jobs.filter(job => {

        const text =
          [
            job.title,
            job.company,
            job.location,
            job.description,
            job.job_type
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return text.includes(search);

      });

  }


  if (filter) {

    jobs =
      jobs.filter(
        job =>
          String(
            job.job_type || ""
          ).toLowerCase() ===
          filter.toLowerCase()
      );

  }


  if (!jobs.length) {

    container.innerHTML =
      `<p>Pa gen travay disponib pou moman an.</p>`;

    return;

  }


  container.innerHTML =
    jobs.map(job => {

      const phone =
        job.contact ||
        job.phone ||
        "";


      const whatsapp =
        phone.replace(
          /[^0-9]/g,
          ""
        );


      return `

        <article class="job-card">

          <h3>
            ${escapeHtml(job.title || "Travay")}
          </h3>

          <p>
            <strong>
              ${escapeHtml(job.company || "")}
            </strong>
          </p>

          <p>
            📍 ${escapeHtml(job.location || "—")}
          </p>

          <p>
            💼 ${escapeHtml(job.job_type || "—")}
          </p>

          ${
            job.salary
              ? `<p>💰 ${escapeHtml(job.salary)}</p>`
              : ""
          }

          <p>
            ${escapeHtml(job.description || "")}
          </p>

          <div class="job-actions">

            ${
              phone
                ? `
                  <a
                    class="btn btn-primary"
                    href="tel:${escapeHtml(phone)}"
                  >
                    📞 Rele
                  </a>
                `
                : ""
            }

            ${
              whatsapp
                ? `
                  <a
                    class="btn btn-secondary"
                    href="https://wa.me/${whatsapp}"
                    target="_blank"
                    rel="noopener"
                  >
                    WhatsApp
                  </a>
                `
                : ""
            }

          </div>

        </article>

      `;

    }).join("");

}


/* =========================================================
   LOAD MY JOBS
========================================================= */

async function loadMyJobs() {

  const container =
    qs("myJobsList");

  if (!container) {
    return;
  }


  const session =
    getSession();

  if (!session) {
    return;
  }


  try {

    const response =
      await api(
        `/rest/v1/jobs?employer_id=eq.${encodeURIComponent(session.userId)}&select=*&order=created_at.desc`
      );


    if (!response.ok) {

      throw new Error(
        `My jobs error ${response.status}`
      );

    }


    const jobs =
      await response.json();


    if (
      !Array.isArray(jobs) ||
      jobs.length === 0
    ) {

      container.innerHTML =
        `<p>Ou poko poste okenn travay.</p>`;

      return;

    }


    container.innerHTML =
      jobs.map(job => {

        return `

          <article class="job-card">

            <h3>
              ${escapeHtml(job.title || "")}
            </h3>

            <p>
              ${escapeHtml(job.company || "")}
            </p>

            <p>
              📍 ${escapeHtml(job.location || "")}
            </p>

            <p>
              ${escapeHtml(job.description || "")}
            </p>

          </article>

        `;

      }).join("");


  } catch (error) {

    console.error(
      "Load my jobs error:",
      error
    );

    container.innerHTML =
      `<p>Nou pa kapab chaje travay ou yo.</p>`;

  }

}


/* =========================================================
   BUSINESS IMAGE UPLOAD
========================================================= */

async function uploadBusinessImage(
  file,
  businessId,
  token
) {

  if (!file) {
    return null;
  }


  const extension =
    (
      file.name.split(".").pop() ||
      "jpg"
    ).toLowerCase();


  const fileName =
    `${businessId}-${Date.now()}.${extension}`;


  const path =
    `businesses/${fileName}`;


  const response =
    await fetch(
      `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${path}`,
      {
        method: "POST",

        headers: {
          apikey: SUPABASE_KEY,
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            file.type ||
            "application/octet-stream",
          "x-upsert":
            "true"
        },

        body: file
      }
    );


  if (!response.ok) {

    const data =
      await readResponse(response);

    throw

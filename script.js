// =========================================================
// EAGLE-J CONNECT - SCRIPT.JS
// =========================================================

const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
const IMAGE_BUCKET = "business-images";


// =========================================================
// BASIC HELPERS
// =========================================================

function qs(selector) {
  return document.querySelector(selector);
}

function msg(id, text) {
  const el = qs("#" + id);
  if (el) {
    el.textContent = text;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// =========================================================
// SESSION
// =========================================================

function getSession() {
  const token = localStorage.getItem("supabase_access_token");
  const userText = localStorage.getItem("supabase_user");

  if (token && userText) {
    try {
      const user = JSON.parse(userText);

      if (user?.id) {
        return {
          token,
          user
        };
      }
    } catch (error) {
      console.warn("Could not read saved user:", error);
    }
  }

  const id = localStorage.getItem("supabase_user_id");
  const email = localStorage.getItem("supabase_user_email");

  if (token && id) {
    return {
      token,
      user: {
        id,
        email
      }
    };
  }

  return null;
}


function saveSession(data) {
  if (data?.access_token) {
    localStorage.setItem(
      "supabase_access_token",
      data.access_token
    );
  }

  if (data?.refresh_token) {
    localStorage.setItem(
      "supabase_refresh_token",
      data.refresh_token
    );
  }

  if (data?.user) {
    localStorage.setItem(
      "supabase_user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "supabase_user_id",
      data.user.id
    );

    localStorage.setItem(
      "supabase_user_email",
      data.user.email || ""
    );
  }
}


function clearSession() {
  localStorage.removeItem("supabase_access_token");
  localStorage.removeItem("supabase_refresh_token");
  localStorage.removeItem("supabase_user");
  localStorage.removeItem("supabase_user_id");
  localStorage.removeItem("supabase_user_email");
}


// =========================================================
// API
// =========================================================

async function api(path, options = {}) {

  const {
    skipAuth = false,
    ...fetchOptions
  } = options;

  const headers = Object.assign(
    {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    fetchOptions.headers || {}
  );

  const session = getSession();

  if (
    !skipAuth &&
    session?.token &&
    !headers.Authorization
  ) {
    headers.Authorization =
      `Bearer ${session.token}`;
  }

  const response = await fetch(
    SUPABASE_URL + path,
    {
      ...fetchOptions,
      headers
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  if (!response.ok) {

    throw new Error(
      data?.message ||
      data?.msg ||
      data?.error_description ||
      data?.details ||
      data?.hint ||
      data?.error ||
      "Request failed"
    );
  }

  return data;
}


// =========================================================
// AUTH API
// =========================================================

async function authRequest(path, options = {}) {

  const headers = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Never send an old user JWT during login/signup.
  delete headers.Authorization;

  const response = await fetch(
    SUPABASE_URL + path,
    {
      ...options,
      headers
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  if (!response.ok) {

    throw new Error(
      data?.message ||
      data?.msg ||
      data?.error_description ||
      data?.details ||
      data?.hint ||
      data?.error ||
      "Authentication request failed"
    );
  }

  return data;
}


// =========================================================
// REFRESH AUTH SESSION
// =========================================================

async function refreshAuthSession() {

  const refreshToken =
    localStorage.getItem("supabase_refresh_token");

  if (!refreshToken) {
    return null;
  }

  try {

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          refresh_token: refreshToken
        })
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      !data?.access_token ||
      !data?.user?.id
    ) {
      return null;
    }

    saveSession(data);

    return {
      token: data.access_token,
      user: data.user
    };

  } catch (error) {

    console.warn(
      "Session refresh failed:",
      error
    );

    return null;
  }
}


// =========================================================
// VERIFY AUTH SESSION
// =========================================================

async function verifyAuthSession() {

  let session = getSession();

  if (
    !session?.token ||
    !session?.user?.id
  ) {
    return null;
  }

  try {

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization":
            `Bearer ${session.token}`
        }
      }
    );

    if (response.ok) {

      const user = await response.json();

      if (user?.id) {

        const updatedUser = {
          ...session.user,
          ...user
        };

        localStorage.setItem(
          "supabase_user",
          JSON.stringify(updatedUser)
        );

        localStorage.setItem(
          "supabase_user_id",
          updatedUser.id
        );

        localStorage.setItem(
          "supabase_user_email",
          updatedUser.email || ""
        );

        return {
          token: session.token,
          user: updatedUser
        };
      }
    }

    // Access token may have expired.
    const refreshed =
      await refreshAuthSession();

    if (refreshed) {
      return refreshed;
    }

    clearSession();

    return null;

  } catch (error) {

    console.warn(
      "Auth verification failed:",
      error
    );

    const refreshed =
      await refreshAuthSession();

    if (refreshed) {
      return refreshed;
    }

    clearSession();

    return null;
  }
}


// =========================================================
// LOGIN
// =========================================================

async function loginUser(email, password) {

  const data = await authRequest(
    "/auth/v1/token?grant_type=password",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password
      })
    }
  );

  saveSession(data);

  return data;
}


// =========================================================
// REGISTER
// =========================================================

async function registerUser(
  email,
  password,
  fullName = ""
) {

  const body = {
    email,
    password
  };

  if (fullName) {
    body.data = {
      full_name: fullName
    };
  }

  const data = await authRequest(
    "/auth/v1/signup",
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );

  if (data?.access_token) {
    saveSession(data);
  }

  return data;
}


// =========================================================
// LOGOUT
// =========================================================

async function logoutUser() {

  const session = getSession();

  try {

    if (session?.token) {

      await fetch(
        `${SUPABASE_URL}/auth/v1/logout`,
        {
          method: "POST",

          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              `Bearer ${session.token}`
          }
        }
      );
    }

  } catch (error) {

    console.warn(
      "Logout request failed:",
      error
    );

  } finally {

    clearSession();

    window.location.href = "login.html";
  }
}


// =========================================================
// GET PROFILE
// =========================================================

async function getProfile(userId) {

  if (!userId) {
    return null;
  }

  try {

    const rows = await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`
    );

    return rows?.[0] || null;

  } catch (error) {

    console.warn(
      "Could not load profile:",
      error
    );

    return null;
  }
}


// =========================================================
// CHECK ADMIN
// =========================================================

async function checkAdmin(userId) {

  if (!userId) {
    return false;
  }

  try {

    const profile = await getProfile(userId);

    if (!profile) {
      return false;
    }

    return (
      profile.is_admin === true ||
      profile.role === "admin" ||
      profile.user_role === "admin"
    );

  } catch (error) {

    console.warn(
      "Admin check failed:",
      error
    );

    return false;
  }
}


// =========================================================
// LOGIN FORM
// =========================================================

async function handleLogin(e) {

  if (e) {
    e.preventDefault();
  }

  const email =
    qs("#email")?.value.trim() || "";

  const password =
    qs("#password")?.value || "";

  if (!email || !password) {

    msg(
      "loginMessage",
      "⚠️ Tanpri antre email ak modpas ou."
    );

    return;
  }

  msg(
    "loginMessage",
    "⏳ Ap konekte..."
  );

  try {

    const data =
      await loginUser(
        email,
        password
      );

    if (!data?.access_token) {

      throw new Error(
        "Login pa retounen yon access token."
      );
    }

    const session =
      await verifyAuthSession();

    if (!session) {

      throw new Error(
        "Nou pa t kapab verifye session ou."
      );
    }

    const isAdmin =
      await checkAdmin(session.user.id);

    msg(
      "loginMessage",
      "✅ Koneksyon reyisi!"
    );

    setTimeout(() => {

      if (isAdmin) {
        window.location.href =
          "admin.html";
      } else {
        window.location.href =
          "dashboard.html";
      }

    }, 500);

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    msg(
      "loginMessage",
      "❌ " + error.message
    );
  }
}


// =========================================================
// REGISTER FORM
// =========================================================

async function handleRegister(e) {

  if (e) {
    e.preventDefault();
  }

  const email =
    qs("#email")?.value.trim() || "";

  const password =
    qs("#password")?.value || "";

  const fullName =
    qs("#fullName")?.value.trim() || "";

  if (!email || !password) {

    msg(
      "registerMessage",
      "⚠️ Tanpri ranpli email ak modpas."
    );

    return;
  }

  if (password.length < 6) {

    msg(
      "registerMessage",
      "⚠️ Modpas la dwe gen omwen 6 karaktè."
    );

    return;
  }

  msg(
    "registerMessage",
    "⏳ Ap kreye kont..."
  );

  try {

    const data =
      await registerUser(
        email,
        password,
        fullName
      );

    if (data?.access_token) {

      msg(
        "registerMessage",
        "✅ Kont la kreye avèk siksè!"
      );

      setTimeout(() => {
        window.location.href =
          "dashboard.html";
      }, 700);

    } else {

      msg(
        "registerMessage",
        "✅ Kont la kreye. Tanpri verifye email ou si sa nesesè."
      );
    }

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    msg(
      "registerMessage",
      "❌ " + error.message
    );
  }
}


// =========================================================
// SUBMIT BUSINESS
// =========================================================

async function submitBusiness(e) {

  e.preventDefault();

  // IMPORTANT:
  // Verify the REAL Supabase session first.
  const session =
    await verifyAuthSession();

  if (!session) {

    msg(
      "formMessage",
      "⚠️ Session ou ekspire. Tanpri konekte ankò."
    );

    setTimeout(() => {
      window.location.href =
        "login.html";
    }, 900);

    return;
  }

  const file =
    qs("#businessImage")?.files?.[0] || null;

  const listingType =
    qs("#listingType")?.value ||
    "business";

  const category =
    qs("#category")?.value ||
    "";

  const encodedCategory =
    `${listingType}:${category}`;

  const values = {

    business_name:
      qs("#businessName")?.value.trim() || "",

    category:
      encodedCategory,

    location:
      qs("#location")?.value.trim() || "",

    phone:
      qs("#phone")?.value.trim() || null,

    whatsapp:
      qs("#whatsapp")?.value.trim() || null,

    price:
      qs("#price")?.value.trim() || null,

    description:
      qs("#description")?.value.trim() || "",

    image_url:
      null,

    user_id:
      session.user.id,

    status:
      "pending"
  };


  // -------------------------------------------------------
  // VALIDATION
  // -------------------------------------------------------

  if (!values.business_name) {

    msg(
      "formMessage",
      "⚠️ Tanpri mete non biznis la."
    );

    return;
  }

  if (!category) {

    msg(
      "formMessage",
      "⚠️ Tanpri chwazi yon kategori."
    );

    return;
  }

  if (!values.location) {

    msg(
      "formMessage",
      "⚠️ Tanpri mete lokalizasyon an."
    );

    return;
  }

  if (!values.description) {

    msg(
      "formMessage",
      "⚠️ Tanpri mete yon deskripsyon."
    );

    return;
  }


  msg(
    "formMessage",
    "⏳ Ap voye anons la..."
  );


  try {

    console.log(
      "Submitting business as user:",
      session.user.id
    );


    // -----------------------------------------------------
    // INSERT BUSINESS
    // -----------------------------------------------------

    const rows =
      await api(
        "/rest/v1/businesses",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${session.token}`,

            "Prefer":
              "return=representation"
          },

          body:
            JSON.stringify(values)
        }
      );


    const business =
      rows?.[0];

    if (!business?.id) {

      throw new Error(
        "Biznis la pa t retounen apre insert la."
      );
    }


    // -----------------------------------------------------
    // UPLOAD IMAGE
    // -----------------------------------------------------

    if (file) {

      msg(
        "formMessage",
        "⏳ Anons la kreye. Ap telechaje foto a..."
      );

      const safeName =
        file.name
          .replace(/[^a-zA-Z0-9._-]/g, "_");

      const filePath =
        `${session.user.id}/${Date.now()}-${safeName}`;


      const uploadResponse =
        await fetch(
          `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${filePath}`,
          {
            method: "POST",

            headers: {
              "apikey":
                SUPABASE_KEY,

              "Authorization":
                `Bearer ${session.token}`,

              "Content-Type":
                file.type || "application/octet-stream"
            },

            body: file
          }
        );


      if (!uploadResponse.ok) {

        const uploadText =
          await uploadResponse.text();

        console.warn(
          "Image upload failed:",
          uploadText
        );

        // Do not delete the business.
        // The business can still exist without image.
        msg(
          "formMessage",
          "⚠️ Anons la anrejistre, men foto a pa t telechaje."
        );

      } else {

        const imageUrl =
          `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${filePath}`;


        // -------------------------------------------------
        // UPDATE BUSINESS WITH IMAGE URL
        // -------------------------------------------------

        await api(
          `/rest/v1/businesses?id=eq.${encodeURIComponent(business.id)}`,
          {
            method: "PATCH",

            headers: {
              "Authorization":
                `Bearer ${session.token}`,

              "Prefer":
                "return=minimal"
            },

            body:
              JSON.stringify({
                image_url:
                  imageUrl
              })
          }
        );
      }
    }


    // -----------------------------------------------------
    // SUCCESS
    // -----------------------------------------------------

    msg(
      "formMessage",
      "✅ Anons ou soumèt avèk siksè! Li pral tann apwobasyon admin."
    );


    const form =
      qs("#businessForm");

    if (form) {
      form.reset();
    }


    setTimeout(() => {

      window.location.href =
        "dashboard.html";

    }, 1800);


  } catch (error) {

    console.error(
      "BUSINESS SUBMIT ERROR:",
      error
    );

    msg(
      "formMessage",
      "❌ " + error.message
    );
  }
}


// =========================================================
// LOAD APPROVED BUSINESSES
// =========================================================

async function loadBusinesses() {

  const container =
    qs("#businessList");

  if (!container) {
    return;
  }

  container.innerHTML =
    "<p>⏳ Ap chaje anons...</p>";

  try {

    const rows =
      await api(
        "/rest/v1/businesses" +
        "?status=eq.approved" +
        "&select=*" +
        "&order=created_at.desc"
      );

    if (!rows?.length) {

      container.innerHTML =
        "<p>Pa gen anons disponib pou kounye a.</p>";

      return;
    }


    container.innerHTML =
      rows.map(business => {

        const image =
          business.image_url
            ? `
              <img
                src="${escapeHtml(business.image_url)}"
                alt="${escapeHtml(business.business_name)}"
                class="business-image"
              >
            `
            : "";


        return `
          <article class="business-card">

            ${image}

            <div class="business-card-content">

              <h3>
                ${escapeHtml(
                  business.business_name
                )}
              </h3>

              <p>
                <strong>Kategori:</strong>
                ${escapeHtml(
                  business.category
                )}
              </p>

              <p>
                <strong>Kote:</strong>
                ${escapeHtml(
                  business.location
                )}
              </p>

              ${
                business.phone
                  ? `
                    <p>
                      <strong>Telefòn:</strong>
                      ${escapeHtml(
                        business.phone
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                business.whatsapp
                  ? `
                    <p>
                      <strong>WhatsApp:</strong>
                      ${escapeHtml(
                        business.whatsapp
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                business.price
                  ? `
                    <p>
                      <strong>Pri:</strong>
                      ${escapeHtml(
                        business.price
                      )}
                    </p>
                  `
                  : ""
              }

              <p>
                ${escapeHtml(
                  business.description
                )}
              </p>

            </div>

          </article>
        `;

      }).join("");


  } catch (error) {

    console.error(
      "LOAD BUSINESSES ERROR:",
      error
    );

    container.innerHTML =
      `<p>❌ ${escapeHtml(error.message)}</p>`;
  }
}


// =========================================================
// POST JOB
// =========================================================

async function postJob(e) {

  e.preventDefault();

  const session =
    await verifyAuthSession();

  if (!session) {

    msg(
      "jobMessage",
      "⚠️ Tanpri konekte anvan ou poste yon travay."
    );

    setTimeout(() => {
      window.location.href =
        "login.html";
    }, 900);

    return;
  }


  const title =
    qs("#jobTitle")?.value.trim() || "";

  const company_name =
    qs("#companyName")?.value.trim() || "";

  const location =
    qs("#jobLocation")?.value.trim() || "";

  const job_type =
    qs("#jobType")?.value.trim() || "";

  const salary =
    qs("#salary")?.value.trim() || "";

  const description =
    qs("#jobDescription")?.value.trim() || "";

  const contact_phone =
    qs("#contactPhone")?.value.trim() || "";


  if (!title) {

    msg(
      "jobMessage",
      "⚠️ Tanpri mete tit travay la."
    );

    return;
  }

  if (!company_name) {

    msg(
      "jobMessage",
      "⚠️ Tanpri mete non konpayi an."
    );

    return;
  }

  if (!location) {

    msg(
      "jobMessage",
      "⚠️ Tanpri mete lokalizasyon an."
    );

    return;
  }

  if (!description) {

    msg(
      "jobMessage",
      "⚠️ Tanpri mete deskripsyon travay la."
    );

    return;
  }


  msg(
    "jobMessage",
    "⏳ Ap poste travay la..."
  );


  try {

    const values = {

      employer_id:
        session.user.id,

      title,

      company_name,

      location,

      job_type,

      salary,

      description,

      contact_phone,

      status:
        "pending"
    };


    await api(
      "/rest/v1/jobs",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${session.token}`,

          "Prefer":
            "return=representation"
        },

        body:
          JSON.stringify(values)
      }
    );


    msg(
      "jobMessage",
      "✅ Travay la soumèt avèk siksè! Li pral tann apwobasyon admin."
    );


    const form =
      qs("#jobForm");

    if (form) {
      form.reset();
    }


  } catch (error) {

    console.error(
      "POST JOB ERROR:",
      error
    );

    msg(
      "jobMessage",
      "❌ " + error.message
    );
  }
}


// =========================================================
// LOAD MY JOBS
// =========================================================

async function loadMyJobs() {

  const container =
    qs("#myJobs");

  if (!container) {
    return;
  }

  const session =
    await verifyAuthSession();

  if (!session) {

    container.innerHTML =
      "<p>⚠️ Tanpri konekte ankò.</p>";

    return;
  }


  try {

    const rows =
      await api(
        "/rest/v1/jobs" +
        `?employer_id=eq.${encodeURIComponent(session.user.id)}` +
        "&select=*" +
        "&order=created_at.desc"
      );


    if (!rows?.length) {

      container.innerHTML =
        "<p>Ou poko poste okenn travay.</p>";

      return;
    }


    container.innerHTML =
      rows.map(job => {

        return `
          <article class="job-card">

            <h3>
              ${escapeHtml(job.title)}
            </h3>

            <p>
              <strong>Konpayi:</strong>
              ${escapeHtml(
                job.company_name
              )}
            </p>

            <p>
              <strong>Kote:</strong>
              ${escapeHtml(
                job.location
              )}
            </p>

            ${
              job.job_type
                ? `
                  <p>
                    <strong>Kalite:</strong>
                    ${escapeHtml(
                      job.job_type
                    )}
                  </p>
                `
                : ""
            }

            ${
              job.salary
                ? `
                  <p>
                    <strong>Salè:</strong>
                    ${escapeHtml(
                      job.salary
                    )}
                  </p>
                `
                : ""
            }

            <p>
              ${escapeHtml(
                job.description
              )}
            </p>

            <p>
              <strong>Status:</strong>
              ${escapeHtml(
                job.status
              )}
            </p>

          </article>
        `;

      }).join("");


  } catch (error) {

    console.error(
      "LOAD MY JOBS ERROR:",
      error
    );

    container.innerHTML =
      `<p>❌ ${escapeHtml(error.message)}</p>`;
  }
}


// =========================================================
// LOAD APPROVED JOBS
// =========================================================

async function loadJobs() {

  const container =
    qs("#jobList");

  if (!container) {
    return;
  }

  container.innerHTML =
    "<p>⏳ Ap chaje travay...</p>";


  try {

    const rows =
      await api(
        "/rest/v1/jobs" +
        "?status=eq.approved" +
        "&select=*" +
        "&order=created_at.desc"
      );


    if (!rows?.length) {

      container.innerHTML =
        "<p>Pa gen travay disponib pou kounye a.</p>";

      return;
    }


    container.innerHTML =
      rows.map(job => {

        return `
          <article class="job-card">

            <h3>
              ${escapeHtml(job.title)}
            </h3>

            <p>
              <strong>Konpayi:</strong>
              ${escapeHtml(
                job.company_name
              )}
            </p>

            <p>
              <strong>Kote:</strong>
              ${escapeHtml(
                job.location
              )}
            </p>

            ${
              job.job_type
                ? `
                  <p>
                    <strong>Kalite travay:</strong>
                    ${escapeHtml(
                      job.job_type
                    )}
                  </p>
                `
                : ""
            }

            ${
              job.salary
                ? `
                  <p>
                    <strong>Salè:</strong>
                    ${escapeHtml(
                      job.salary
                    )}
                  </p>
                `
                : ""
            }

            <p>
              ${escapeHtml(
                job.description
              )}
            </p>

            ${
              job.contact_phone
                ? `
                  <p>
                    <strong>Kontak:</strong>
                    ${escapeHtml(
                      job.contact_phone
                    )}
                  </p>
                `
                : ""
            }

          </article>
        `;

      }).join("");


  } catch (error) {

    console.error(
      "LOAD JOBS ERROR:",
      error
    );

    container.innerHTML =
      `<p>❌ ${escapeHtml(error.message)}</p>`;
  }
}


// =========================================================
// DASHBOARD
// =========================================================

async function loadDashboard() {

  const session =
    await verifyAuthSession();

  if (!session) {

    window.location.href =
      "login.html";

    return;
  }


  const nameElement =
    qs("#userName");

  if (nameElement) {

    nameElement.textContent =
      session.user.user_metadata?.full_name ||
      session.user.email ||
      "Itilizatè";
  }


  const emailElement =
    qs("#userEmail");

  if (emailElement) {

    emailElement.textContent =
      session.user.email || "";
  }
}


// =========================================================
// PAGE INITIALIZATION
// =========================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "Eagle-J Connect loaded."
    );


    // -----------------------------------------------------
    // LOGIN FORM
    // -----------------------------------------------------

    const loginForm =
      qs("#loginForm");

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        handleLogin
      );
    }


    // -----------------------------------------------------
    // REGISTER FORM
    // -----------------------------------------------------

    const registerForm =
      qs("#registerForm");

    if (registerForm) {

      registerForm.addEventListener(
        "submit",
        handleRegister
      );
    }


    // -----------------------------------------------------
    // BUSINESS FORM
    // -----------------------------------------------------

    const businessForm =
      qs("#businessForm");

    if (businessForm) {

      businessForm.addEventListener(
        "submit",
        submitBusiness
      );
    }


    // -----------------------------------------------------
    // JOB FORM
    // -----------------------------------------------------

    const jobForm =
      qs("#jobForm");

    if (jobForm) {

      jobForm.addEventListener(
        "submit",
        postJob
      );
    }


    // -----------------------------------------------------
    // LOGOUT BUTTONS
    // -----------------------------------------------------

    const logoutButtons =
      document.querySelectorAll(
        "[data-logout]"
      );

    logoutButtons.forEach(button => {

      button.addEventListener(
        "click",
        async event => {

          event.preventDefault();

          await logoutUser();
        }
      );
    });


    // -----------------------------------------------------
    // LOAD DATA DEPENDING ON PAGE
    // -----------------------------------------------------

    if (qs("#businessList")) {
      await loadBusinesses();
    }

    if (qs("#jobList")) {
      await loadJobs();
    }

    if (qs("#myJobs")) {
      await loadMyJobs();
    }

    if (qs("#userName") || qs("#userEmail")) {
      await loadDashboard();
    }

  }
);

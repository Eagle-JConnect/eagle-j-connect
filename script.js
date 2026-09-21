/* Eagle-J Connect - Supabase application */

const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
const IMAGE_BUCKET="business-images";


/* =========================================================
   BASIC FUNCTIONS
========================================================= */

function qs(id){
  return document.getElementById(id);
}


/* =========================================================
   SESSION
========================================================= */

function getSession(){

  const token=localStorage.getItem("supabase_access_token");
  const userText=localStorage.getItem("supabase_user");

  if(token && userText){

    try{

      return {
        token,
        user:JSON.parse(userText)
      };

    }catch(e){}

  }

  const id=localStorage.getItem("supabase_user_id");
  const email=localStorage.getItem("supabase_user_email");

  return token && id
    ? {
        token,
        user:{id,email}
      }
    : null;
}


function saveSession(data){

  localStorage.setItem(
    "supabase_access_token",
    data.access_token || ""
  );

  if(data.refresh_token){

    localStorage.setItem(
      "supabase_refresh_token",
      data.refresh_token
    );

  }

  if(data.user){

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


function clearSession(){

  [
    "supabase_access_token",
    "supabase_refresh_token",
    "supabase_user",
    "supabase_user_id",
    "supabase_user_email",
    "user_full_name",
    "user_phone",
    "user_account_type"
  ].forEach(
    k=>localStorage.removeItem(k)
  );

}


window.logoutUser=()=>{

  clearSession();

  location.href="login.html";

};


/* =========================================================
   MOBILE MENU
   Works on ALL pages
========================================================= */

function setupMobileMenu(){

  const menu=document.getElementById("menu");
  const button=document.querySelector(".menu-toggle");

  if(!menu || !button){

    console.log(
      "Mobile menu: #menu oswa .menu-toggle pa jwenn."
    );

    return;

  }


  /* Prevent duplicate initialization */

  if(button.dataset.menuReady==="true"){

    return;

  }

  button.dataset.menuReady="true";


  /* Accessibility */

  button.setAttribute(
    "aria-expanded",
    "false"
  );


  /* Open / close menu */

  button.addEventListener(
    "click",
    function(e){

      e.preventDefault();
      e.stopPropagation();

      menu.classList.toggle("show");

      const opened=
        menu.classList.contains("show");

      button.setAttribute(
        "aria-expanded",
        opened ? "true" : "false"
      );

    }
  );


  /* Close menu after clicking a link */

  menu.querySelectorAll("a").forEach(
    link=>{

      link.addEventListener(
        "click",
        function(){

          menu.classList.remove("show");

          button.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    }
  );


  /* Close menu when clicking outside */

  document.addEventListener(
    "click",
    function(e){

      if(
        !menu.contains(e.target) &&
        !button.contains(e.target)
      ){

        menu.classList.remove("show");

        button.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}


/* Compatibility with pages using onclick="toggleMenu()" */

window.toggleMenu=function(){

  const menu=document.getElementById("menu");
  const button=document.querySelector(".menu-toggle");

  if(!menu){

    console.error(
      "Menu #menu pa jwenn."
    );

    return;

  }


  menu.classList.toggle("show");


  if(button){

    button.setAttribute(
      "aria-expanded",
      menu.classList.contains("show")
        ? "true"
        : "false"
    );

  }

};


/* =========================================================
   MESSAGES
========================================================= */

function msg(id,text,type="error"){

  const el=qs(id);

  if(!el)return;

  el.textContent=text;

  el.style.color =
    type==="success"
      ? "#18864b"
      : type==="warning"
        ? "#b26a00"
        : "#c62828";

}


/* =========================================================
   SECURITY / TEXT HELPERS
========================================================= */

function esc(v){

  const d=document.createElement("div");

  d.textContent=v ?? "";

  return d.innerHTML;

}


function attr(v){

  return String(v ?? "")
    .replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");

}


function waNumber(v){

  return String(v || "")
    .replace(/\D/g,"");

}


function fmtDate(v){

  try{

    return new Date(v).toLocaleDateString();

  }catch(e){

    return "";

  }

}


/* =========================================================
   SUPABASE API
========================================================= */

async function api(path,options={}){

  const headers=Object.assign(
    {
      "apikey":SUPABASE_KEY,
      "Content-Type":"application/json"
    },
    options.headers || {}
  );

  const session=getSession();

  if(
    session?.token &&
    !headers.Authorization
  ){

    headers.Authorization=
      `Bearer ${session.token}`;

  }

  const r=await fetch(
    SUPABASE_URL+path,
    {
      ...options,
      headers
    }
  );

  const text=await r.text();

  let data=null;

  try{

    data=text
      ? JSON.parse(text)
      : null;

  }catch(e){

    data=text;

  }

  if(!r.ok){

    throw new Error(
      data?.message ||
      data?.msg ||
      data?.error_description ||
      "Request failed"
    );

  }

  return data;

}


/* =========================================================
   PUBLIC API
   Used for public marketplace listings so an old/expired
   user session cannot interfere with public SELECT queries.
========================================================= */

async function publicApi(path, options={}){
  const headers=Object.assign({
    "apikey":SUPABASE_KEY,
    "Content-Type":"application/json"
  }, options.headers || {});

  // Deliberately do not attach the logged-in user's Bearer token.
  // Public marketplace rows are read using the anon/publishable key.
  delete headers.Authorization;

  const r=await fetch(SUPABASE_URL+path,{
    ...options,
    headers
  });

  const text=await r.text();
  let data=null;
  try{ data=text ? JSON.parse(text) : null; }catch(e){ data=text; }

  if(!r.ok){
    throw new Error(
      data?.message || data?.msg || data?.error_description ||
      `Public request failed (${r.status})`
    );
  }

  return data;
}


/* =========================================================
   REGISTRATION
========================================================= */

async function registerUser(e){

  e.preventDefault();

  // Prevent accidental double-clicks / repeated signup requests.
  const form=qs("registerForm");
  const submitButton=form?.querySelector('button[type="submit"]');
  const RATE_LIMIT_KEY="eaglej_signup_last_attempt";
  const COOLDOWN_MS=60000;
  const lastAttempt=Number(localStorage.getItem(RATE_LIMIT_KEY)||0);
  const remaining=COOLDOWN_MS-(Date.now()-lastAttempt);

  if(remaining>0){
    const seconds=Math.ceil(remaining/1000);
    msg(
      "registerMessage",
      `⏳ Tanpri tann ${seconds} segonn anvan ou eseye kreye yon lòt kont. Sa ede evite limit demann Supabase la.`,
      "warning"
    );
    return;
  }

  const fullName=qs("fullName").value.trim();
  const email=qs("email").value.trim();
  const phone=qs("phone").value.trim();
  const accountType=qs("accountType").value;
  const password=qs("password").value;
  const confirm=qs("confirmPassword").value;

  if(
    !fullName ||
    !email ||
    !phone ||
    !accountType ||
    !password ||
    !confirm
  ){

    msg(
      "registerMessage",
      "⚠️ Tanpri ranpli tout chan yo."
    );

    return;

  }

  if(password!==confirm){

    msg(
      "registerMessage",
      "❌ Modpas yo pa menm."
    );

    return;

  }

  if(password.length<6){

    msg(
      "registerMessage",
      "❌ Modpas la dwe gen omwen 6 karaktè."
    );

    return;

  }

  // Record only after local validation succeeds.
  localStorage.setItem(RATE_LIMIT_KEY,String(Date.now()));
  if(submitButton){
    submitButton.disabled=true;
    submitButton.dataset.originalText=submitButton.textContent;
    submitButton.textContent="⏳ Ap kreye kont...";
  }

  msg(
    "registerMessage",
    "⏳ Nap kreye kont ou...",
    "warning"
  );

  try{

    const data=await api(
      "/auth/v1/signup",
      {
        method:"POST",

        headers:{
          Authorization:
            "Bearer "+SUPABASE_KEY
        },

        body:JSON.stringify({
          email,
          password,

          // Apre konfimasyon imèl la, Supabase dwe retounen
          // sou paj login ki nan GitHub Pages la, pa sou yon URL 404.
          email_redirect_to:new URL(
            "login.html",
            window.location.href
          ).href,

          data:{
            full_name:fullName,
            phone,
            account_type:accountType
          }

        })

      }
    );


    if(data.user){

      try{

        await api(
          "/rest/v1/profiles",
          {
            method:"POST",

            headers:{
              Authorization:
                `Bearer ${data.access_token || SUPABASE_KEY}`
            },

            body:JSON.stringify({
              id:data.user.id,
              full_name:fullName,
              email,
              phone,
              account_type:accountType
            })

          }
        );

      }catch(profileErr){

        console.warn(
          "Profile insert:",
          profileErr
        );

      }

    }


    qs("registerForm").reset();

    msg(
      "registerMessage",
      "✅ Kont ou kreye. Kounye a konekte pou kontinye.",
      "success"
    );


    setTimeout(
      ()=>{
        location.href="login.html";
      },
      1200
    );


  }catch(err){

    console.error(err);

    const raw=String(err?.message || "");
    const rateLimited=/rate limit|too many requests|too many/i.test(raw);

    if(rateLimited){
      // Keep the user from immediately repeating a request that Supabase
      // has already rate-limited. The server-side limit cannot be removed
      // by browser code; this simply prevents extra requests and explains it.
      localStorage.setItem(RATE_LIMIT_KEY,String(Date.now()));
      msg(
        "registerMessage",
        "⏳ Supabase limite kantite demann yo pou yon ti tan. Tanpri tann apeprè 1 minit anvan ou eseye ankò. Pa klike bouton an plizyè fwa.",
        "warning"
      );
    }else{
      msg(
        "registerMessage",
        "❌ "+raw
      );
    }

  }finally{

    if(submitButton){
      submitButton.disabled=false;
      submitButton.textContent=submitButton.dataset.originalText || "✅ Kreye Kont";
    }

  }

}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(e){

  e.preventDefault();

  const email=qs("loginEmail").value.trim();
  const password=qs("loginPassword").value;

  const message="loginMessage";

  msg(
    message,
    "⏳ Nap konekte...",
    "warning"
  );

  try{

    const data=await api(
      "/auth/v1/token?grant_type=password",
      {
        method:"POST",

        headers:{
          Authorization:
            "Bearer "+SUPABASE_KEY
        },

        body:JSON.stringify({
          email,
          password
        })

      }
    );


    saveSession(data);


    let profiles=[];

    try{

      profiles=await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(data.user.id)}&select=*`
      );

    }catch(err){

      console.warn(err);

    }


    const profile=profiles?.[0] || {

      full_name:"",
      phone:"",
      account_type:"job_seeker"

    };


    localStorage.setItem(
      "user_full_name",
      profile.full_name || ""
    );

    localStorage.setItem(
      "user_phone",
      profile.phone || ""
    );

    localStorage.setItem(
      "user_account_type",
      profile.account_type || ""
    );


    const user=Object.assign(
      {},
      data.user,
      {
        full_name:profile.full_name,
        phone:profile.phone,
        account_type:profile.account_type
      }
    );


    localStorage.setItem(
      "supabase_user",
      JSON.stringify(user)
    );

    // Verify whether this authenticated user is an administrator.
    // Admin status is controlled by the Supabase admin_users table, not by a
    // client-editable profile field.
    let isAdmin = false;
    try {
      const adminRows = await api(
        `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(data.user.id)}&select=user_id`
      );
      isAdmin = Array.isArray(adminRows) && adminRows.length > 0;
    } catch (adminErr) {
      console.warn("Admin check failed:", adminErr);
    }

    localStorage.setItem("eagle_j_is_admin", isAdmin ? "1" : "0");

    msg(
      message,
      "✅ Ou konekte avèk siksè!",
      "success"
    );

    setTimeout(
      ()=>{
        if (isAdmin) {
          location.href = "admin.html";
        } else {
          location.href =
            profile.account_type==="employer"
              ? "employer.html"
              : "dashboard.html";
        }
      },
      500
    );


  }catch(err){

    console.error(err);

    msg(
      message,
      "❌ "+err.message
    );

  }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard(){

  const session=getSession();

  if(!session){

    location.href="login.html";

    return;

  }


  qs("dashboardLoading")?.classList.add("hidden");


  const card=qs("profileCard");
  const error=qs("dashboardError");


  try{

    const rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );


    const p=rows?.[0];


    if(!p){

      throw new Error(
        "Pwofil ou pa jwenn."
      );

    }


    qs("profileName").textContent=
      p.full_name || "—";

    qs("profileEmail").textContent=
      session.user.email || "—";

    qs("profilePhone").textContent=
      p.phone || "—";

    qs("profileType").textContent=
      p.account_type==="employer"
        ? "🏢 Anplwayè"
        : "👷 Moun k ap chèche travay";


    if(p.account_type==="employer"){

      qs("employerActions")
        ?.classList.remove("hidden");

    }else{

      qs("jobSeekerActions")
        ?.classList.remove("hidden");

    }


    if(card){

      card.style.display="block";

    }


  }catch(err){

    if(error){

      error.textContent=
        "❌ "+err.message;

      error.style.display="block";

    }

  }

}


/* =========================================================
   EMPLOYER DASHBOARD
========================================================= */

async function loadEmployerDashboard(){

  const session=getSession();

  if(!session){

    location.href="login.html";

    return;

  }


  try{

    const rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );


    const p=rows?.[0];


    if(
      !p ||
      p.account_type!=="employer"
    ){

      location.href="dashboard.html";

      return;

    }


    if(qs("employerName")){

      qs("employerName").textContent=
        p.full_name || "Anplwayè";

    }


    if(qs("profileName")){

      qs("profileName").textContent=
        p.full_name || "—";

    }


    if(qs("profileEmail")){

      qs("profileEmail").textContent=
        session.user.email || "—";

    }


    if(qs("profilePhone")){

      qs("profilePhone").textContent=
        p.phone || "—";

    }


    await loadMyJobs(
      session.user.id,
      session.token
    );


  }catch(err){

    console.error(err);

    if(qs("employerMessage")){

      qs("employerMessage").textContent=
        "❌ "+err.message;

    }

  }

}


/* =========================================================
   POST JOB
========================================================= */

async function postJob(e){

  e.preventDefault();

  const s=getSession();

  if(!s){

    location.href="login.html";

    return;

  }


  const vals={

    title:
      qs("jobTitle").value.trim(),

    company_name:
      qs("jobCompany").value.trim(),

    location:
      qs("jobLocation").value.trim(),

    job_type:
      qs("jobType").value,

    salary:
      qs("jobSalary").value.trim() || null,

    description:
      qs("jobDescription").value.trim(),

    contact_phone:
      qs("jobContact").value.trim()

  };


  if(
    !vals.title ||
    !vals.company_name ||
    !vals.location ||
    !vals.job_type ||
    !vals.description ||
    !vals.contact_phone
  ){

    msg(
      "jobMessage",
      "⚠️ Tanpri ranpli tout chan obligatwa yo."
    );

    return;

  }


  msg(
    "jobMessage",
    "⏳ Travay la ap pibliye...",
    "warning"
  );


  try{

    await api(
      "/rest/v1/jobs",
      {
        method:"POST",

        body:JSON.stringify({
          ...vals,
          employer_id:s.user.id
        }),

        headers:{
          Authorization:
            `Bearer ${s.token}`,

          Prefer:
            "return=representation"
        }

      }
    );


    qs("jobForm").reset();


    msg(
      "jobMessage",
      "✅ Travay la pibliye avèk siksè!",
      "success"
    );


    await loadMyJobs(
      s.user.id,
      s.token
    );


  }catch(err){

    console.error(err);

    msg(
      "jobMessage",
      "❌ "+err.message
    );

  }

}


/* =========================================================
   MY JOBS
========================================================= */

async function loadMyJobs(userId,token){

  const box=qs("myJobs");

  if(!box)return;


  box.innerHTML=
    "<p>⏳ Travay yo ap chaje...</p>";


  try{

    const jobs=await api(
      `/rest/v1/jobs?employer_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`,
      {
        headers:{
          Authorization:
            `Bearer ${token}`
        }
      }
    );


    if(!jobs?.length){

      box.innerHTML=
        "<p>Ou poko poste okenn travay.</p>";

      return;

    }


    box.innerHTML=
      jobs.map(
        j=>`

        <article class="card job-card">

          <h3>
            ${esc(j.title)}
          </h3>

          <div class="meta">

            <span class="badge">
              🏢 ${esc(j.company_name)}
            </span>

            <span class="badge">
              📍 ${esc(j.location)}
            </span>

            <span class="badge">
              💼 ${esc(j.job_type)}
            </span>

          </div>

          ${
            j.salary
              ? `<p>💰 ${esc(j.salary)}</p>`
              : ""
          }

          <p>
            ${esc(j.description)}
          </p>

          <p>
            📞 ${esc(j.contact_phone)}
          </p>

          <small>
            📅 ${fmtDate(j.created_at)}
          </small>

        </article>

        `
      ).join("");


  }catch(err){

    console.error(err);

    box.innerHTML=
      "<p>❌ Nou pa kapab chaje travay yo.</p>";

  }

}


/* =========================================================
   PUBLIC JOBS
========================================================= */

let allJobs=[];


async function loadJobs(){

  const box=qs("jobListings");

  if(!box)return;


  box.innerHTML=
    "<p>⏳ Travay yo ap chaje...</p>";


  try{

    allJobs=await api(
      "/rest/v1/jobs?select=*&order=created_at.desc"
    );


    renderJobs();


  }catch(err){

    console.error(err);

    box.innerHTML=
      "<p>❌ Nou pa kapab chaje travay yo kounye a.</p>";

  }

}


function renderJobs(){

  const box=qs("jobListings");

  if(!box)return;


  const term=
    (qs("searchJob")?.value || "")
      .toLowerCase()
      .trim();


  const type=
    qs("jobFilter")?.value || "";


  const list=allJobs.filter(
    j=>
      (
        !term ||

        [
          j.title,
          j.company_name,
          j.location,
          j.description
        ].some(
          v=>
            String(v || "")
              .toLowerCase()
              .includes(term)
        )

      )
      &&
      (
        !type ||
        j.job_type===type
      )
  );


  if(!list.length){

    box.innerHTML=
      "<p class='notice'>Pa gen travay ki koresponn ak rechèch ou a.</p>";

    return;

  }


  box.innerHTML=
    list.map(
      j=>{

        const phone=
          attr(j.contact_phone || "");

        const wa=
          waNumber(j.contact_phone);


        return `

        <article class="card job-card">

          <h3>
            💼 ${esc(j.title)}
          </h3>

          <div class="meta">

            <span class="badge">
              🏢 ${esc(j.company_name)}
            </span>

            <span class="badge">
              📍 ${esc(j.location)}
            </span>

            <span class="badge">
              💼 ${esc(j.job_type)}
            </span>

          </div>

          ${
            j.salary
              ? `
                <p>
                  💰 <strong>${esc(j.salary)}</strong>
                </p>
              `
              : ""
          }

          <p>
            ${esc(j.description)}
          </p>

          <small>
            📅 ${fmtDate(j.created_at)}
          </small>

          <div class="actions">

            ${
              phone
                ? `
                  <a
                    href="tel:${phone}"
                    onclick="event.stopPropagation()"
                  >
                    <button type="button">
                      📞 Rele
                    </button>
                  </a>
                `
                : ""
            }

            ${
              wa
                ? `
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://wa.me/${wa}?text=${encodeURIComponent(
                      "Bonjou, mwen enterese nan travay: "+j.title
                    )}"
                    onclick="event.stopPropagation()"
                  >
                    <button type="button">
                      💬 WhatsApp
                    </button>
                  </a>
                `
                : ""
            }

          </div>

        </article>

        `;

      }
    ).join("");

}


/* =========================================================
   BUSINESS ADS - CREATE
========================================================= */

async function submitBusiness(e){

  e.preventDefault();


  const f=qs("businessForm");

  const file=
    qs("businessImage")?.files?.[0] || null;


  const values={

    business_name:
      qs("businessName").value.trim(),

    category:
      qs("category").value,

    /* Keep listing type inside the existing category field so no database column change is required. */
    listing_type:
      qs("listingType")?.value || "business",

    location:
      qs("location").value.trim(),

    phone:
      qs("phone").value.trim() || null,

    whatsapp:
      qs("whatsapp").value.trim() || null,

    price:
      qs("price").value.trim() || null,

    description:
      qs("description").value.trim()

  };


  if(
    !values.business_name ||
    !values.category ||
    !values.listing_type ||
    !values.location ||
    !values.description
  ){

    msg(
      "formMessage",
      "⚠️ Tanpri ranpli tout chan obligatwa yo."
    );

    return;

  }


  /* Maximum 5MB */

  if(
    file &&
    (
      !file.type.startsWith("image/") ||
      file.size > 5 * 1024 * 1024
    )
  ){

    msg(
      "formMessage",
      "❌ Foto a dwe yon imaj ki pi piti pase 5MB."
    );

    return;

  }


  msg(
    "formMessage",
    "⏳ Anons lan ap pibliye...",
    "warning"
  );


  try{

    /* Create business first */

    const data=await api(
      "/rest/v1/businesses",
      {
        method:"POST",

        headers:{
          Authorization:
            `Bearer ${SUPABASE_KEY}`,

          Prefer:
            "return=representation"
        },

        body:JSON.stringify({

          business_name: values.business_name,

          /* listing_type is kept in the existing category column so the
             current Supabase businesses table does not need a new column. */
          category: `${values.listing_type}:${values.category}`,

          location: values.location,

          phone: values.phone,

          whatsapp: values.whatsapp,

          price: values.price,

          description: values.description,

          image_url:null

        })

      }
    );


    const b=
      Array.isArray(data)
        ? data[0]
        : data;


    if(!b || !b.id){

      throw new Error(
        "Anons lan pa retounen yon ID."
      );

    }


    let imageURL=null;


    /* Upload image */

    if(file){

      const ext=
        (
          file.name
            .split(".")
            .pop() || "jpg"
        ).toLowerCase();


      const fileName=
        `${b.id}-${Date.now()}.${ext}`;


      const up=await fetch(
        `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,
        {
          method:"POST",

          headers:{
            "apikey":SUPABASE_KEY,

            "Authorization":
              `Bearer ${SUPABASE_KEY}`,

            "Content-Type":
              file.type
          },

          body:file
        }
      );


      if(!up.ok){

        throw new Error(
          "Foto a pa t kapab monte."
        );

      }


      imageURL=
        `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`;

    }


    /* Save image URL */

    await api(
      `/rest/v1/businesses?id=eq.${encodeURIComponent(b.id)}`,
      {
        method:"PATCH",

        headers:{
          Authorization:
            `Bearer ${SUPABASE_KEY}`
        },

        body:JSON.stringify({
          image_url:imageURL
        })

      }
    );


    f.reset();


    msg(
      "formMessage",
      "✅ Anons ou a pibliye avèk siksè!",
      "success"
    );


    await loadBusinesses();


  }catch(err){

    console.error(err);

    msg(
      "formMessage",
      "❌ "+err.message
    );

  }

}


/* =========================================================
   BUSINESS LISTINGS
   CLICK AN AD -> anons.html?id=BUSINESS_ID
========================================================= */

async function loadBusinesses(){

  const box=qs("businessListings");
  if(!box)return;

  box.innerHTML="<p>⏳ Anons yo ap chaje...</p>";

  try{
    const rows=await publicApi("/rest/v1/businesses?select=*&order=created_at.desc");
    window.__marketplaceRows=Array.isArray(rows)?rows:[];
    renderMarketplaceListings();
  }catch(err){
    console.error("Business listings error:",err);
    box.innerHTML=`<div class="notice error">❌ Nou pa kapab chaje anons yo.<br><small>${esc(err?.message || "Tanpri verifye koneksyon an epi eseye ankò.")}</small><br><button type="button" onclick="loadBusinesses()">🔄 Eseye ankò</button></div>`;
  }
}

function marketplaceType(category){
  const c=String(category||"").toLowerCase();
  if(c.includes(":")) return c.split(":",1)[0];
  if(/employee|anplwaye/.test(c)) return "employee";
  if(/employer|anplway/.test(c)) return "employer";
  if(/service|sèvis/.test(c)) return "service";
  if(/professional|pwofes/.test(c)) return "professional";
  if(/property|bien|byen|real-estate|imob/.test(c)) return "property";
  return "business";
}

function marketplaceCategory(category){
  const c=String(category||"");
  return c.includes(":") ? c.split(":").slice(1).join(":") : c;
}

function marketplaceLabel(type){
  return ({employee:"👷 Anplwaye", employer:"🏢 Anplwayè", professional:"👨🏾‍🔧 Pwofesyonèl", service:"🛠️ Sèvis", business:"🛍️ Biznis", property:"🏠 Byen"})[type] || "🛍️ Biznis";
}

function renderMarketplaceListings(){
  const box=qs("businessListings");
  if(!box)return;
  const rows=window.__marketplaceRows || [];
  const active=document.querySelector(".market-tab.active")?.dataset.filter || "all";
  const search=(qs("marketSearch")?.value||"").trim().toLowerCase();
  const loc=(qs("marketLocation")?.value||"").trim().toLowerCase();

  const filtered=rows.filter(b=>{
    const type=marketplaceType(b.category);
    const hay=[b.business_name,b.category,b.location,b.description,b.price].filter(Boolean).join(" ").toLowerCase();
    const typeOk=active==="all" || type===active;
    const searchOk=!search || hay.includes(search);
    const locOk=!loc || String(b.location||"").toLowerCase().includes(loc) ||
      (loc==="bahamas" && /bahamas|nassau|abaco|freeport/i.test(String(b.location||""))) ||
      (loc==="ayiti" && /ayiti|haiti|port-au-prince|cap-haïtien|cap-haitien/i.test(String(b.location||"")));
    return typeOk && searchOk && locOk;
  });

  if(qs("marketResultCount")) qs("marketResultCount").textContent=`${filtered.length} anons jwenn`;
  if(!filtered.length){
    box.innerHTML='<div class="notice">🔎 Pa gen rezilta pou rechèch sa a. Eseye yon lòt mo oswa yon lòt kategori.</div>';
    return;
  }

  box.innerHTML=filtered.map(b=>{
    const wa=waNumber(b.whatsapp);
    const phone=attr(b.phone);
    const type=marketplaceType(b.category);
    const cat=marketplaceCategory(b.category);
    return `<article class="card business-card marketplace-card" onclick="openBusinessAd('${attr(b.id)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openBusinessAd('${attr(b.id)}')}">
      ${b.image_url?`<img src="${attr(b.image_url)}" alt="${attr(b.business_name)}">`:`<div class="marketplace-placeholder">${type==='property'?'🏠':type==='service'?'🛠️':type==='professional'?'👨🏾‍🔧':type==='employer'?'🏢':'🛍️'}</div>`}
      <div class="market-badge">${marketplaceLabel(type)}</div>
      <h3>${esc(b.business_name)}</h3>
      <p>📂 ${esc(cat)}</p>
      <p>📍 ${esc(b.location)}</p>
      ${b.price?`<p>💰 ${esc(b.price)}</p>`:""}
      <p>${esc(b.description)}</p>
      <div class="actions" onclick="event.stopPropagation()">
        ${phone?`<a href="tel:${phone}" onclick="event.stopPropagation()"><button type="button">📞 Rele</button></a>`:""}
        ${wa?`<a target="_blank" rel="noopener" href="https://wa.me/${wa}" onclick="event.stopPropagation()"><button type="button">💬 WhatsApp</button></a>`:""}
      </div>
      <div class="market-view">👆 Klike pou wè detay</div>
    </article>`;
  }).join("");
}

function setupMarketplaceFilters(){
  document.querySelectorAll(".market-tab").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".market-tab").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    renderMarketplaceListings();
  }));
  ["marketSearch","marketLocation"].forEach(id=>qs(id)?.addEventListener("input",renderMarketplaceListings));
}

/* =========================================================
   OPEN BUSINESS AD
========================================================= */

window.openBusinessAd=function(id){

  if(!id){

    console.error(
      "Business ID missing."
    );

    return;

  }


  location.href=
    `anons.html?id=${encodeURIComponent(id)}`;

};



/* =========================================================
   BUSINESS DETAIL
========================================================= */

async function loadBusinessDetail(){

  const box=qs("businessDetail");

  if(!box)return;

  const params=new URLSearchParams(location.search);
  const id=params.get("id");

  if(!id){
    box.innerHTML="<p class='notice'>❌ Anons sa pa gen ID.</p>";
    return;
  }

  try{

    const cleanId=String(id).trim();
    const rows=await publicApi(
      `/rest/v1/businesses?id=eq.${encodeURIComponent(cleanId)}&select=*`
    );

    const b=Array.isArray(rows) ? rows[0] : null;

    if(!b){
      box.innerHTML="<p class='notice'>❌ Anons sa pa egziste oswa li pa disponib ankò.</p>";
      return;
    }

    const phone=attr(b.phone || "");
    const wa=waNumber(b.whatsapp);

    box.innerHTML=`
      ${
        b.image_url
          ? `<img class="business-detail-image" src="${attr(b.image_url)}" alt="${attr(b.business_name)}">`
          : `<div class="business-detail-placeholder">🏢</div>`
      }

      <h1>${esc(b.business_name)}</h1>

      <div class="meta">
        <span class="badge">📂 ${esc(b.category)}</span>
        <span class="badge">📍 ${esc(b.location)}</span>
      </div>

      ${
        b.price
          ? `<p><strong>💰 Pri:</strong> ${esc(b.price)}</p>`
          : ""
      }

      <p style="white-space:pre-line">${esc(b.description)}</p>

      <div class="actions">
        ${
          phone
            ? `<a href="tel:${phone}"><button type="button">📞 Rele</button></a>`
            : ""
        }
        ${
          wa
            ? `<a target="_blank" rel="noopener" href="https://wa.me/${wa}"><button type="button">💬 WhatsApp</button></a>`
            : ""
        }
      </div>
    `;

  }catch(err){

    console.error("Business detail error:",err);

    box.innerHTML=
      `<div class="notice error">❌ Nou pa kapab chaje detay anons sa a.<br><small>${esc(err?.message || "Tanpri eseye ankò.")}</small><br><button type="button" onclick="loadBusinessDetail()">🔄 Eseye ankò</button></div>`;

  }

}


/* =========================================================
   HOMEPAGE STATISTICS
========================================================= */

async function loadStats(){

  const ids=[

    ["stat-jobs","jobs"],

    ["stat-business","businesses"],

    ["stat-users","profiles"]

  ];


  for(
    const [id,table] of ids
  ){

    try{

      const r=await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`,
        {
          headers:{
            "apikey":SUPABASE_KEY,

            "Range":"0-0",

            "Prefer":"count=exact"
          }
        }
      );


      const range=
        r.headers.get("content-range");


      const count=
        range
          ? parseInt(
              range.split("/")[1],
              10
            )
          : 0;


      if(qs(id)){

        qs(id).textContent=
          Number.isFinite(count)
            ? count
            : 0;

      }


    }catch(e){}

  }


  if(qs("stat-ads")){

    qs("stat-ads").textContent=
      qs("stat-business")?.textContent || "0";

  }

}


/* =========================================================
   CONTACT
========================================================= */

function initContact(){

  const form=qs("contactForm");

  if(!form)return;


  form.addEventListener(
    "submit",
    e=>{

      e.preventDefault();


      const name=
        qs("contactName").value.trim();

      const email=
        qs("contactEmail").value.trim();

      const phone=
        qs("contactPhone").value.trim();

      const message=
        qs("contactMessage").value.trim();


      if(
        !name ||
        !email ||
        !message
      ){

        msg(
          "contactMessageBox",
          "⚠️ Tanpri ranpli non, imèl ak mesaj."
        );

        return;

      }


      const subject=
        encodeURIComponent(
          "Eagle-J Connect - Contact"
        );


      const body=
        encodeURIComponent(
          `Non: ${name}\nEmail: ${email}\nTelefòn: ${phone}\n\nMesaj:\n${message}`
        );


      location.href=
        `mailto:eaglejconnect@gmail.com?subject=${subject}&body=${body}`;


      msg(
        "contactMessageBox",
        "📧 Nou prepare mesaj la nan aplikasyon imèl ou.",
        "success"
      );

    }
  );

}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{


    /* =====================================================
       REGISTRATION
    ===================================================== */

    const reg=qs("registerForm");

    if(reg){

      reg.addEventListener(
        "submit",
        registerUser
      );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const login=qs("loginForm");

    if(login){

      login.addEventListener(
        "submit",
        loginUser
      );

    }


    /* =====================================================
       PUBLIC JOBS
    ===================================================== */

    if(qs("jobListings")){

      loadJobs();


      qs("searchJob")?.addEventListener(
        "input",
        renderJobs
      );


      qs("jobFilter")?.addEventListener(
        "change",
        renderJobs
      );

    }


    /* =====================================================
       BUSINESS LISTINGS
    ===================================================== */

    if(qs("businessListings")){

      loadBusinesses();

      qs("marketSearch")?.addEventListener("input", renderMarketplaceListings);
      qs("marketLocation")?.addEventListener("change", renderMarketplaceListings);
      document.querySelectorAll(".market-tab").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          document.querySelectorAll(".market-tab").forEach(b=>b.classList.remove("active"));
          btn.classList.add("active");
          renderMarketplaceListings();
        });
      });

    }

    /* =====================================================
       BUSINESS DETAIL
    ===================================================== */

    if(qs("businessDetail")){

      loadBusinessDetail();

    }


    /* =====================================================
       BUSINESS FORM
    ===================================================== */

    if(qs("businessForm")){

      qs("businessForm").addEventListener(
        "submit",
        submitBusiness
      );

    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    if(qs("dashboardLoading")){

      loadDashboard();

    }


    /* =====================================================
       EMPLOYER DASHBOARD
    ===================================================== */

    if(qs("employerName")){

      loadEmployerDashboard();

    }


    /* =====================================================
       JOB FORM
    ===================================================== */

    if(qs("jobForm")){

      qs("jobForm").addEventListener(
        "submit",
        postJob
      );

    }


    /* =====================================================
       MY JOBS
    ===================================================== */

    if(qs("myJobs")){

      const s=getSession();

      if(s){

        loadMyJobs(
          s.user.id,
          s.token
        );

      }

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    if(qs("stats")){

      loadStats();

    }


    /* =====================================================
       CONTACT
    ===================================================== */

    initContact();

  }
);
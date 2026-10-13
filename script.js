/* Eagle-J Connect - Supabase application */

const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
const IMAGE_BUCKET="business-images";

/* Visible diagnostics: prevent silent blank-looking listing pages when a runtime error occurs. */
window.addEventListener("error", function(event){
  console.error("Eagle-J Connect runtime error:", event.message, event.filename, event.lineno);
  const pageHasListing = document.getElementById("businessListings") || document.getElementById("businessDetail");
  if (!pageHasListing) return;
  const target = document.getElementById("businessListings") || document.getElementById("businessDetail");
  if (target && !target.dataset.runtimeErrorShown) {
    target.dataset.runtimeErrorShown = "1";
    target.innerHTML = "<div class=\"empty-state\"><span>⚠️</span><h3>Paj la pa t kapab fini chaje</h3><p>Eseye rafrechi paj la. Si pwoblèm nan kontinye, voye mesaj erè JavaScript la bay administratè a.</p></div>";
  }
});


/* =========================================================
   BASIC FUNCTIONS
========================================================= */

function qs(id){
  return document.getElementById(id);
}


/* =========================================================
   SHARE PUBLIC POSTS / ADS
========================================================= */
async function shareEaglePost(button){
  if(!button) return;

  const title=button.dataset.shareTitle || "Eagle-J Connect";
  const text=button.dataset.shareText || "Dekouvri opòtinite sou Eagle-J Connect.";
  const url=button.dataset.shareUrl || window.location.href;
  const payload={title, text, url};
  const combined=[title, text, url].filter(Boolean).join("\n");

  if(typeof navigator.share === "function"){
    try{
      await navigator.share(payload);
      return;
    }catch(error){
      // If the user closes the share sheet, do not open another app.
      if(error && error.name === "AbortError") return;
    }
  }

  try{
    if(navigator.clipboard && typeof navigator.clipboard.writeText === "function"){
      await navigator.clipboard.writeText(combined);
      alert("Lyen ak detay piblikasyon an kopye. Ou kapab kole li sou rezo sosyal ou.");
      return;
    }
  }catch(error){
    console.warn("Could not copy share text:", error);
  }

  // Last-resort fallback works on browsers without the native share sheet.
  window.open("https://wa.me/?text=" + encodeURIComponent(combined), "_blank", "noopener,noreferrer");
}

function eagleJobShareUrl(job){
  const url=new URL("travay.html", window.location.href);
  if(job && job.id) url.searchParams.set("job", String(job.id));
  return url.href;
}


/* =========================================================
   SESSION
========================================================= */

function getSession(){

  const token=localStorage.getItem("supabase_access_token");
  const userText=localStorage.getItem("supabase_user");

  if(token && userText){

    try{

      const user=JSON.parse(userText);

      if(user?.id){

        return {
          token,
          user
        };

      }

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

  if(data?.access_token){

    localStorage.setItem(
      "supabase_access_token",
      data.access_token
    );

  }

  if(data?.refresh_token){

    localStorage.setItem(
      "supabase_refresh_token",
      data.refresh_token
    );

  }

  if(data?.user){

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
    "user_account_type",
    "user_is_admin",
    "eagle_j_is_admin"
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
   menu.js owns the final navigation controller
========================================================= */

function setupMobileMenu(){
  /* menu.js owns the final navigation controller */
}


/* Compatibility with pages using onclick="toggleMenu()" */

window.toggleMenu=function(){

  const button=document.getElementById("menuToggle");

  if(button){

    button.click();

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

  if (!headers.Authorization) {
    headers.Authorization = session?.token
      ? `Bearer ${session.token}`
      : `Bearer ${SUPABASE_KEY}`;
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

    const detail = data?.message || data?.msg || data?.error_description || data?.details || data?.hint || data?.error || "Request failed";
    const code = data?.code ? ` [${data.code}]` : "";
    throw new Error(`${detail}${code} (HTTP ${r.status})`);

  }

  return data;

}


/* =========================================================
   PUBLIC READ API — shared ad pages must work without login
========================================================= */
async function publicApi(path){
  // Prevent public listing pages from staying on "loading" forever if the
  // network/Supabase request hangs. The caller displays a readable error.
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(SUPABASE_URL + path, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        // Public listing requests use the publishable key only. Do not send
        // a publishable API key as a Bearer JWT; it is not a user access token.
        // With no Authorization header, PostgREST applies the public anon role.
        "Accept": "application/json"
      },
      cache: "no-store",
      signal: controller.signal
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error("Supabase pa reponn apre 15 segonn. Verifye koneksyon an epi eseye ankò.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch (_) { data = raw; }
  if (!response.ok) {
    const message = data?.message || data?.msg || data?.details || data?.hint || data?.error || `HTTP ${response.status}`;
    throw new Error(`${message} (HTTP ${response.status})`);
  }
  return data;
}

/* =========================================================
   ADMIN CHECK
   ---------------------------------------------------------
   Verifye si itilizatè konekte a nan admin_users.
   ========================================================= */

async function checkCurrentUserIsAdmin(userId){

  if(!userId){

    return false;

  }

  try{

    const rows=await api(
      `/rest/v1/admin_users?user_id=eq.${encodeURIComponent(userId)}&select=user_id`
    );

    const isAdmin=
      Array.isArray(rows) &&
      rows.length>0;

    localStorage.setItem(
      "user_is_admin",
      isAdmin ? "true" : "false"
    );

    return isAdmin;

  }catch(error){

    console.warn(
      "Admin verification:",
      error.message
    );

    // Do not mark a valid admin as a non-admin when the network or RLS check fails.
    localStorage.removeItem("user_is_admin");
    return null;

  }

}


/* =========================================================
   REGISTRATION
========================================================= */

async function registerUser(e){

  e.preventDefault();

  const firstName=
    qs("firstName")?.value.trim() || "";

  const lastName=
    qs("lastName")?.value.trim() || "";

  const legacyFullName=
    qs("fullName")?.value.trim() || "";

  const fullName=
    (
      legacyFullName ||
      `${firstName} ${lastName}`
    ).trim();

  const email=
    qs("email")?.value.trim().toLowerCase() || "";

  const phone=
    qs("phone")?.value.trim() || "";

  const accountType=
    qs("accountType")?.value || "";

  const password=
    qs("password")?.value || "";

  const confirm=
    qs("confirmPassword")?.value || "";


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
      "⚠️ Tanpri ranpli tout chan obligatwa yo."
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


  if(password!==confirm){

    msg(
      "registerMessage",
      "❌ Modpas yo pa menm."
    );

    return;

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

        body:JSON.stringify({
          email,
          password,

          data:{
            full_name:fullName,
            first_name:
              firstName ||
              fullName.split(" ")[0],
            last_name:lastName,
            phone,
            account_type:accountType
          }

        })

      }
    );


    if(data?.access_token){

      saveSession(data);

    }


    if(
      data?.user?.id &&
      data?.access_token
    ){

      try{

        await api(
          "/rest/v1/profiles",
          {
            method:"POST",

            body:JSON.stringify({
              id:data.user.id,
              full_name:fullName,
              email,
              phone,
              account_type:accountType
            }),

            headers:{
              Prefer:"return=representation"
            }

          }
        );

      }catch(profileErr){

        console.warn(
          "Profile insert:",
          profileErr
        );

      }

    }


    qs("registerForm")?.reset();


    msg(
      "registerMessage",

      data?.access_token
        ? "✅ Kont ou kreye avèk siksè. W ap antre kounye a..."
        : "✅ Kont ou kreye. Verifye imèl ou si sa nesesè, epi konekte pou kontinye.",

      "success"
    );


    setTimeout(
      ()=>{
        location.href="login.html";
      },
      1400
    );


  }catch(err){

    console.error(err);

    msg(
      "registerMessage",
      "❌ "+err.message
    );

  }

}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginUser(e){

  e.preventDefault();


  const email=
    qs("loginEmail")?.value.trim() || "";

  const password=
    qs("loginPassword")?.value || "";


  const message="loginMessage";


  if(!email || !password){

    msg(
      message,
      "⚠️ Tanpri mete imèl ak modpas ou."
    );

    return;

  }


  msg(
    message,
    "⏳ Nap konekte...",
    "warning"
  );


  try{

    /* -----------------------------------------------------
       1. LOGIN SUPABASE AUTH
    ----------------------------------------------------- */

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


    if(
      !data?.access_token ||
      !data?.user?.id
    ){

      throw new Error(
        "Supabase pa retounen yon sesyon valab."
      );

    }


    /* -----------------------------------------------------
       2. SAVE SESSION
    ----------------------------------------------------- */

    saveSession(data);


    /* -----------------------------------------------------
       3. GET PROFILE
    ----------------------------------------------------- */

    let profiles=[];
    let profileRequestError=null;

    try{
      profiles=await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(data.user.id)}&select=*`
      );
      if(!Array.isArray(profiles)||!profiles.length){
        profiles=await api(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(data.user.id)}&select=*`);
      }
    }catch(err){
      profileRequestError=err;
      console.warn("Profile request:", err);
    }

    const profile=profiles?.[0];

    if(!profile){
      // Keep the authenticated session. A temporary SELECT/RLS error must not erase
      // the user's login tokens or silently lock the administrator out.
      const reason=profileRequestError?.message
        ? ` Supabase di: ${profileRequestError.message}.`
        : " Supabase pa jwenn yon ranje pou ID itilizatè sa a nan public.profiles.";
      throw new Error(
        `Ou konekte nan Auth, men nou pa kapab konfime pwofil Eagle-J Connect la.${reason} Sesyon an pa efase; verifye pwofil/RLS anvan ou eseye ankò.`
      );
    }


    /* -----------------------------------------------------
       4. ACCOUNT STATUS
    ----------------------------------------------------- */

    if(
      (profile.account_status || profile.status) &&
      (profile.account_status || profile.status)!=="active"
    ){

      clearSession();

      throw new Error(
        "Kont ou pa aktif. Tanpri kontakte administratè a."
      );

    }


    /* -----------------------------------------------------
       5. SAVE PROFILE DATA
    ----------------------------------------------------- */

    localStorage.setItem(
      "user_full_name",
      profile.full_name || [profile.first_name,profile.last_name].filter(Boolean).join(" ") || ""
    );

    localStorage.setItem(
      "user_phone",
      profile.phone || ""
    );

    localStorage.setItem(
      "user_account_type",
      profile.account_type || ""
    );


    const user=
      Object.assign(
        {},
        data.user,
        {
          full_name:
            profile.full_name || [profile.first_name,profile.last_name].filter(Boolean).join(" "),

          phone:
            profile.phone,

          account_type:
            profile.account_type
        }
      );


    localStorage.setItem(
      "supabase_user",
      JSON.stringify(user)
    );


    /* -----------------------------------------------------
       6. CHECK ADMIN
       -----------------------------------------------------
       Sa se koreksyon prensipal la.
       Si UID la nan admin_users,
       Admin ale admin.html.
    */

    const isAdmin=await checkCurrentUserIsAdmin(data.user.id);
    if(isAdmin===null){
      throw new Error("Ou konekte, men verifikasyon dwa Admin pa t reyisi. Sesyon an konsève; pa efase kont ou ni rekouri gwo SQL la. Eseye ankò oswa verifye policy admin_users.");
    }

    msg(
      message,
      isAdmin
        ? "🛡️ Admin verifye. W ap antre nan Dashboard Admin..."
        : "✅ Ou konekte avèk siksè!",
      "success"
    );


    /* -----------------------------------------------------
       7. ROUTING
       ----------------------------------------------------- */

    setTimeout(
      ()=>{

        if(isAdmin){

          location.href="admin.html";

          return;

        }


        if(
          profile.account_type==="employer"
        ){

          location.href="employer.html";

        }else{

          location.href="dashboard.html";

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


  qs("dashboardLoading")
    ?.classList.add("hidden");


  const card=
    qs("profileCard");

  const error=
    qs("dashboardError");


  try{

    let rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );
    if(!Array.isArray(rows)||!rows.length){
      rows=await api(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
    }

    const p=rows?.[0];


    if(!p){

      throw new Error(
        "Pwofil ou pa jwenn."
      );

    }


    const profileName=p.full_name || [p.first_name,p.last_name].filter(Boolean).join(" ") || "—";
    qs("profileName").textContent=profileName;


    qs("profileEmail").textContent=
      session.user.email || "—";


    qs("profilePhone").textContent=
      p.phone || "—";


    qs("profileType").textContent=
      p.account_type==="employer"
        ? "🏢 Anplwayè"
        : "👷 Moun k ap chèche travay";

    // Keep the user's existing avatar when available (Supabase profile or Auth metadata).
    const avatarUrl = p.avatar_url || p.photo_url || p.profile_image || p.profile_picture || p.avatar || p.image_url ||
      session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture ||
      session.user.user_metadata?.photo_url || session.user.user_metadata?.avatar || "";
    const avatar = qs("profileAvatar");
    const avatarFallback = qs("profileAvatarFallback");
    if (avatar && avatarUrl) {
      avatar.src = avatarUrl;
      avatar.style.display = "block";
      if (avatarFallback) avatarFallback.style.display = "none";
      avatar.onerror = () => { avatar.style.display = "none"; if (avatarFallback) avatarFallback.style.display = "flex"; };
    } else if (avatarFallback) {
      avatarFallback.textContent = (profileName || session.user.email || "👤").trim().charAt(0).toUpperCase() || "👤";
    }

    await loadMyBusinessListings(session);


    if(
      p.account_type==="employer"
    ){

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

      error.style.display=
        "block";

    }

  }

}


/* =========================================================
   CURRENT USER'S BUSINESS LISTINGS — include pending/approved ads
========================================================= */
async function loadMyBusinessListings(session = getSession()) {
  const host = qs("myBusinessListings");
  if (!host || !session?.user?.id) return;
  const lang = (() => { try { return localStorage.getItem("selectedLanguage") || "ht"; } catch(e) { return "ht"; } })();
  const labels = {
    ht:{loading:"Anons ou yo ap chaje...",empty:"Ou poko kreye okenn anons.",error:"Nou pa kapab chaje anons ou yo.",edit:"✏️ Modifye",status:"Estati",pending:"An atant validasyon",approved:"Apwouve",rejected:"Refize",price:"Pri / Tarif pa presize",view:"Gade anons"},
    en:{loading:"Loading your listings...",empty:"You have not created any listings yet.",error:"We could not load your listings.",edit:"✏️ Edit",status:"Status",pending:"Pending review",approved:"Approved",rejected:"Rejected",price:"Price / rate not specified",view:"View listing"},
    fr:{loading:"Chargement de vos annonces...",empty:"Vous n’avez pas encore créé d’annonce.",error:"Impossible de charger vos annonces.",edit:"✏️ Modifier",status:"Statut",pending:"En attente de validation",approved:"Approuvée",rejected:"Refusée",price:"Prix / tarif non précisé",view:"Voir l’annonce"},
    es:{loading:"Cargando tus anuncios...",empty:"Todavía no has creado anuncios.",error:"No se pudieron cargar tus anuncios.",edit:"✏️ Editar",status:"Estado",pending:"Pendiente de revisión",approved:"Aprobado",rejected:"Rechazado",price:"Precio/tarifa no especificado",view:"Ver anuncio"}
  }[lang] || null;
  const t = labels || {loading:"Anons ou yo ap chaje...",empty:"Ou poko kreye okenn anons.",error:"Nou pa kapab chaje anons ou yo.",edit:"✏️ Modifye",status:"Estati",pending:"An atant validasyon",approved:"Apwouve",rejected:"Refize",price:"Pri / Tarif pa presize",view:"Gade anons"};
  host.innerHTML = `<p class="notice">⏳ ${t.loading}</p>`;
  try {
    const rows = await api(`/rest/v1/businesses?user_id=eq.${encodeURIComponent(session.user.id)}&select=id,business_name,category,location,price,description,image_url,status,created_at&order=created_at.desc`);
    if (!Array.isArray(rows) || !rows.length) { host.innerHTML = `<p class="notice">${t.empty}</p><a class="btn btn-primary" href="kreye-anons.html">＋ ${lang==='en'?'Create listing':lang==='fr'?'Créer une annonce':lang==='es'?'Crear anuncio':'Kreye yon anons'}</a>`; return; }
    host.innerHTML = rows.map(b => {
      const status = String(b.status || 'pending').toLowerCase();
      const statusLabel = status === 'approved' ? t.approved : status === 'rejected' ? t.rejected : t.pending;
      const title = esc(b.business_name || 'Anons');
      const image = b.image_url ? `<img src="${attr(b.image_url)}" alt="${title}" loading="lazy" style="width:100%;max-height:190px;object-fit:cover;border-radius:10px">` : '';
      const price = b.price ? esc(b.price) : t.price;
      return `<article class="card" style="margin:14px 0;padding:16px">${image}<h3 style="margin:12px 0 6px">${title}</h3><p>${esc(b.location || '')}</p><p><strong>${t.status}:</strong> ${esc(statusLabel)}</p><p>${price}</p><p>${esc(b.description || '').slice(0,240)}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-secondary" href="anons.html?id=${encodeURIComponent(b.id)}">${t.view}</a><a class="btn btn-primary" href="kreye-anons.html?edit=${encodeURIComponent(b.id)}">${t.edit}</a></div></article>`;
    }).join('');
  } catch (err) { console.error('My listings:', err); host.innerHTML = `<p class="notice">❌ ${t.error} ${esc(err.message || '')}</p>`; }
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

    let rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );
    if(!Array.isArray(rows)||!rows.length){
      rows=await api(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
    }

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
        p.full_name || [p.first_name,p.last_name].filter(Boolean).join(" ") || "Anplwayè";

    }


    if(qs("profileName")){

      qs("profileName").textContent=
        p.full_name || [p.first_name,p.last_name].filter(Boolean).join(" ") || "—";

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
      qs("jobTitle")?.value.trim() || "",

    company:
      qs("jobCompany")?.value.trim() || "",

    location:
      qs("jobLocation")?.value.trim() || "",

    job_type:
      qs("jobType")?.value || "",

    salary:
      qs("jobSalary")?.value.trim() || null,

    description:
      qs("jobDescription")?.value.trim() || "",

    contact:
      qs("jobContact")?.value.trim() || ""

  };


  if(
    !vals.title ||
    !vals.company ||
    !vals.location ||
    !vals.job_type ||
    !vals.description ||
    !vals.contact
  ){

    msg(
      "jobMessage",
      "⚠️ Tanpri ranpli tout chan obligatwa yo."
    );

    return;

  }


  msg(
    "jobMessage",
    "⏳ Travay la ap voye bay Admin pou validasyon...",
    "warning"
  );


  try{

    await api(
      "/rest/v1/jobs",
      {
        method:"POST",

        body:JSON.stringify({
          ...vals,

          employer_id:
            s.user.id,

          status:"pending"
        }),

        headers:{
          Prefer:"return=representation"
        }

      }
    );


    qs("jobForm")?.reset();


    msg(
      "jobMessage",
      "✅ Travay la resevwa. Li pap parèt piblik jiskaske Admin valide li.",
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
   PUBLIC JOBS
========================================================= */

let publicJobs=[];


function jobTypeLabel(type){

  const map={

    full_time:"Full-time",

    part_time:"Part-time",

    contract:"Contract",

    temporary:"Temporary",

    fulltime:"Full-time",

    parttime:"Part-time"

  };


  return map[
    String(type || "").toLowerCase()
  ]

  ||

  String(type || "")
    .replace(/_/g," ")

  ||

  "—";

}


async function loadJobs(){

  const box=
    qs("jobsList") ||
    qs("jobListings");


  if(!box)return;


  box.innerHTML=
    '<div class="loading-state"><span>⏳</span><p>Travay yo ap chaje...</p></div>';


  try{

    const rows=
      await publicApi(
        "/rest/v1/jobs?status=eq.approved&select=*&order=created_at.desc"
      );


    publicJobs=
      Array.isArray(rows)
        ? rows
        : [];


    renderJobs();


  }catch(err){

    console.error(
      "Public jobs:",
      err
    );


    publicJobs=[];


    box.innerHTML=
      `<div class="notice">
        ❌ Nou pa kapab chaje travay yo kounye a.
        <br>
        <small>
          ${esc(
            err.message ||
            "Request failed"
          )}
        </small>
      </div>`;

  }

}


function renderJobs(){

  const box=
    qs("jobsList") ||
    qs("jobListings");


  if(!box)return;


  const search=
    (
      qs("searchJob")?.value ||
      ""
    )
    .trim()
    .toLowerCase();


  const filter=
    qs("jobFilter")?.value ||
    "";


  const requestedJobId=
    new URLSearchParams(window.location.search).get("job");

  const jobs=
    publicJobs.filter(job=>{

      if(requestedJobId && String(job.id) !== requestedJobId) return false;

      const haystack=[

        job.title,

        job.company,

        job.company_name,

        job.location,

        job.description,

        job.job_type,

        job.type,

        job.employment_type

      ]

      .filter(Boolean)
      .join(" ")
      .toLowerCase();


      const type=
        job.job_type ||
        job.employment_type ||
        job.type ||
        "";


      return (
        (!search ||
          haystack.includes(search)) &&

        (!filter ||
          type===filter)
      );

    });


  if(!jobs.length){

    box.innerHTML=
      `<div class="empty-state">

        <div class="empty-icon">
          💼
        </div>

        <h3>
          ${
            publicJobs.length
              ? "Pa gen travay ki koresponn"
              : "Pa gen travay ki disponib"
          }
        </h3>

        <p>
          ${
            publicJobs.length
              ? "Eseye yon lòt rechèch oswa yon lòt kalite travay."
              : "Pa gen travay apwouve ki vizib kounye a. Tounen pita pou wè nouvo opòtinite."
          }
        </p>

      </div>`;

    return;

  }


  box.innerHTML=
    jobs.map(job=>{

      const title=
        job.title ||
        "Travay";


      const company=
        job.company ||
        job.company_name ||
        "Konpayi";


      const location=
        job.location ||
        "Lokalizasyon pa presize";


      const type=
        job.job_type ||
        job.employment_type ||
        job.type ||
        "";


      const salary=
        job.salary ||
        job.pay ||
        job.rate ||
        "";


      const contact=
        job.contact ||
        job.phone ||
        job.whatsapp ||
        "";


      return `
        <article class="job-card card">

          <div class="card-kicker">
            OPÒTINITE TRAVAY
          </div>

          <h3>
            ${esc(title)}
          </h3>

          <p>
            <strong>
              ${esc(company)}
            </strong>
          </p>

          <div class="meta">

            <span class="badge">
              📍 ${esc(location)}
            </span>

            ${
              type
                ? `
                  <span class="badge">
                    💼 ${esc(
                      jobTypeLabel(type)
                    )}
                  </span>
                `
                : ""
            }

            ${
              salary
                ? `
                  <span class="badge">
                    💰 ${esc(salary)}
                  </span>
                `
                : ""
            }

          </div>

          ${
            job.description
              ? `
                <p>
                  ${esc(
                    job.description
                  )}
                </p>
              `
              : ""
          }

          ${
            contact
              ? `
                <p class="job-contact">
                  <strong>
                    Kontak:
                  </strong>
                  ${esc(contact)}
                </p>
              `
              : ""
          }

          <div class="post-share-row">
            <button
              type="button"
              class="btn btn-small share-button"
              data-share-title="${attr(title)} — Eagle-J Connect"
              data-share-text="${attr([company, location, salary ? "Salè: " + salary : "", job.description || ""].filter(Boolean).join(" • "))}"
              data-share-url="${attr(eagleJobShareUrl(job))}"
              onclick="event.stopPropagation(); shareEaglePost(this)"
              aria-label="Pataje travay ${attr(title)}"
            >🔗 Share</button>
          </div>

        </article>
      `;

    }).join("");

}


function jobStatusLabel(status){

  return ({

    pending:
      "⏳ Ap tann validasyon",

    approved:
      "✅ Piblik",

    rejected:
      "❌ Refize",

    unavailable:
      "🚫 Pa disponib"

  })[status]

  ||

  "📌 "+
  (status || "—");

}


/* =========================================================
   MY JOBS
========================================================= */

async function loadMyJobs(
  userId,
  token
){

  const box=
    qs("myJobs") ||
    qs("myJobsList");


  if(!box)return;


  box.innerHTML=
    "<p>⏳ Travay yo ap chaje...</p>";


  try{

    const jobs=
      await api(
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
      jobs.map(job=>`

        <article class="job-card card">

          <div class="card-kicker">

            TRAVAY POU OU ·

            ${esc(
              jobStatusLabel(
                job.status
              )
            )}

          </div>

          <h3>
            ${esc(
              job.title ||
              "Travay"
            )}
          </h3>

          <p>
            <strong>
              ${esc(
                job.company ||
                job.company_name ||
                ""
              )}
            </strong>
          </p>

          <div class="meta">

            <span class="badge">
              📍 ${esc(
                job.location ||
                "—"
              )}
            </span>

            <span class="badge">
              💼 ${esc(
                job.job_type ||
                "—"
              )}
            </span>

            ${
              job.salary
                ? `
                  <span class="badge">
                    💰 ${esc(
                      job.salary
                    )}
                  </span>
                `
                : ""
            }

          </div>

          <p>
            ${esc(
              job.description ||
              ""
            )}
          </p>

        </article>

      `).join("");


  }catch(err){

    console.error(err);

    box.innerHTML=
      "<p>❌ Nou pa kapab chaje travay ou yo.</p>";

  }

}


/* =========================================================
   BUSINESS ADS - CREATE / EDIT
========================================================= */

let businessEditOriginal = null;

async function loadBusinessEditForm(){
  const form = qs("businessForm");
  if(!form) return;
  const editId = new URLSearchParams(location.search).get("edit");
  if(!editId) return;
  const session = getSession();
  if(!session){
    msg("formMessage", "⚠️ Konekte pou modifye pwòp anons ou.");
    return;
  }
  try{
    const rows = await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(editId)}&user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
    const b = rows?.[0];
    if(!b) throw new Error("Nou pa jwenn anons sa a nan kont ou, oswa ou pa gen pèmisyon pou modifye li.");
    businessEditOriginal = b;
    qs("businessName").value = b.business_name || "";
    const parts = String(b.category || "business:other").split(":");
    qs("listingType").value = parts.length > 1 ? parts[0] : "business";
    qs("category").value = parts.length > 1 ? parts.slice(1).join(":") : (parts[0] || "other");
    qs("location").value = b.location || "";
    qs("phone").value = b.phone || "";
    qs("whatsapp").value = b.whatsapp || "";
    qs("price").value = b.price || "";
    qs("description").value = b.description || "";
    const heading = form.parentElement?.querySelector("h1");
    if(heading) heading.textContent = "✏️ Modifye Anons ou";
    const submit = form.querySelector('button[type="submit"]');
    if(submit) submit.textContent = "💾 Sove Modifikasyon yo";
    msg("formMessage", "Ou ap modifye anons ou. Lè ou sove, anons la ap retounen nan verifikasyon Admin.", "warning");
  }catch(err){
    msg("formMessage", "❌ " + (err.message || "Nou pa kapab chaje anons sa a."));
  }
}

// Preview selected images locally before upload; no image URL is required.
function setupBusinessImagePicker(){
  const picker=qs("businessImage");
  const preview=qs("businessImagePreview");
  if(!picker||!preview||picker.dataset.previewReady==="1") return;
  picker.dataset.previewReady="1";
  picker.addEventListener("change",()=>{
    const files=Array.from(picker.files||[]);
    preview.replaceChildren();
    if(files.length>5){
      msg("formMessage","❌ Chwazi jiska 5 foto sèlman.");
      picker.value="";
      return;
    }
    const allowed=["image/jpeg","image/png","image/webp","image/gif"];
    if(files.some(f=>!allowed.includes(f.type)||f.size>5*1024*1024)){
      msg("formMessage","❌ Foto yo dwe JPG, PNG, WebP oswa GIF, epi chak dwe 5MB oswa mwens.");
      picker.value="";
      return;
    }
    const total=files.reduce((sum,f)=>sum+f.size,0);
    if(total>20*1024*1024){
      msg("formMessage","❌ Gwosè total foto yo pa dwe depase 20MB.");
      picker.value="";
      return;
    }
    files.forEach(file=>{
      const item=document.createElement("div"); item.className="business-image-preview-item";
      const img=document.createElement("img"); img.alt=file.name; img.src=URL.createObjectURL(file);
      img.onload=()=>URL.revokeObjectURL(img.src);
      const caption=document.createElement("span"); caption.textContent=file.name;
      item.append(img,caption); preview.append(item);
    });
    if(files.length) msg("formMessage",`📸 ${files.length} foto chwazi. Yo pral monte lè ou pibliye anons la.`,"success");
  });
}

async function submitBusiness(e){

  e.preventDefault();


  const session=
    getSession();


  if(!session){

    msg(
      "formMessage",
      "⚠️ Tanpri konekte anvan ou pibliye yon anons."
    );


    setTimeout(
      ()=>location.href="login.html",
      900
    );


    return;

  }


  // Verify the identity represented by the access token with Supabase Auth.
  // localStorage can contain a stale user object; RLS checks auth.uid() from
  // the token, not the locally stored user ID.
  let authenticatedUser;
  try {
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.token}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });
    const authData = await authResponse.json().catch(() => null);
    if (!authResponse.ok || !authData?.id) {
      throw new Error("Sesyon an ekspire oswa li pa valab. Tanpri dekonekte epi konekte ankò.");
    }
    authenticatedUser = authData;
    // Keep the stored user record aligned with the identity in the access token.
    localStorage.setItem("supabase_user", JSON.stringify(authData));
    localStorage.setItem("supabase_user_id", authData.id);
    if (authData.email) localStorage.setItem("supabase_user_email", authData.email);
    session.user = authData;
  } catch (authError) {
    msg("formMessage", "❌ " + (authError?.message || "Nou pa kapab verifye sesyon an. Tanpri konekte ankò."));
    return;
  }

  const files=Array.from(qs("businessImage")?.files || []);
  const file=files[0] || null;


  const listingType=
    qs("listingType")
      ?.value ||
    "business";


  const category=
    qs("category")
      ?.value ||
    "";


  const encodedCategory=
    `${listingType}:${category}`;


  const values={

    business_name:
      qs("businessName")
        ?.value.trim() ||
      "",

    category:
      encodedCategory,

    location:
      qs("location")
        ?.value.trim() ||
      "",

    phone:
      qs("phone")
        ?.value.trim() ||
      null,

    whatsapp:
      qs("whatsapp")
        ?.value.trim() ||
      null,

    price:
      qs("price")
        ?.value.trim() ||
      null,

    description:
      qs("description")
        ?.value.trim() ||
      "",

    image_url:null,

    user_id:
      authenticatedUser.id,

    status:"pending"

  };


  if(
    !values.business_name ||
    !category ||
    !values.location ||
    !values.description
  ){

    msg(
      "formMessage",
      "⚠️ Tanpri ranpli tout chan obligatwa yo."
    );

    return;

  }


  const totalImageBytes=files.reduce((sum,item)=>sum+item.size,0);
  const maxImageBytes=5*1024*1024;
  const maxTotalImageBytes=20*1024*1024;
  const allowedImageTypes=["image/jpeg","image/png","image/webp","image/gif"];
  if(files.length>5){
    msg("formMessage","❌ Ou ka chwazi jiska 5 foto pou yon sèl anons.");
    return;
  }
  if(files.some(item=>!allowedImageTypes.includes(item.type) || item.size>maxImageBytes)){
    msg("formMessage","❌ Chwazi foto JPG, PNG, WebP oswa GIF; chak dwe 5MB oswa mwens.");
    return;
  }
  if(totalImageBytes>maxTotalImageBytes){
    msg("formMessage","❌ Gwosè total foto yo depase 20MB.");
    return;
  }


  const editId = new URLSearchParams(location.search).get("edit");
  if(editId){
    try{
      msg("formMessage", "⏳ N ap sove modifikasyon yo...", "warning");
      const updateValues = {
        business_name: values.business_name,
        category: values.category,
        location: values.location,
        phone: values.phone,
        whatsapp: values.whatsapp,
        price: values.price,
        description: values.description,
        status: "pending"
      };
      await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(editId)}&user_id=eq.${encodeURIComponent(session.user.id)}`, {
        method:"PATCH",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify(updateValues)
      });
      if(files.length){
        const uploadedUrls=[];
        for(let i=0;i<files.length;i++){
          const selected=files[i];
          const ext=(selected.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g,"") || "jpg";
          const fileName=`${editId}-${Date.now()}-${i+1}.${ext}`;
          const up=await fetch(`${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,{
            method:"POST",
            headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.token}`,"Content-Type":selected.type,"x-upsert":"true"},
            body:selected
          });
          if(!up.ok){
            let reason="Supabase pa t kapab monte yon imaj.";
            try{const body=await up.json();reason=body?.message||body?.error||reason;}catch(_){}
            throw new Error(reason);
          }
          uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`);
        }
        await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(editId)}&user_id=eq.${encodeURIComponent(session.user.id)}`,{
          method:"PATCH",
          body:JSON.stringify({image_url:uploadedUrls[0],image_urls:JSON.stringify(uploadedUrls)})
        });
      }
      msg("formMessage", "✅ Modifikasyon yo sove epi yo voye bay Admin pou revizyon anvan yo parèt piblik.", "success");
      setTimeout(()=>location.href=`anons.html?id=${encodeURIComponent(editId)}`, 900);
    }catch(err){
      console.error(err);
      msg("formMessage", "❌ " + (err.message || "Nou pa kapab sove modifikasyon yo."));
    }
    return;
  }

  msg(
    "formMessage",
    "⏳ Anons lan ap voye bay Admin pou validasyon...",
    "warning"
  );


  try{

    const rows=
      await api(
        "/rest/v1/businesses",
        {
          method:"POST",

          headers:{
            Prefer:
              "return=representation",
            Authorization:
              `Bearer ${session.token}`
          },

          body:
            JSON.stringify(values)
        }
      );


    const b=
      Array.isArray(rows)
        ? rows[0]
        : rows;


    if(!b?.id){

      throw new Error(
        "Anons lan pa retounen yon ID."
      );

    }


    /* -----------------------------------------------------
       UPLOAD SELECTED IMAGES (maximum 5, total 20MB)
    ----------------------------------------------------- */
    if(files.length){
      const uploadedUrls=[];
      for(let i=0;i<files.length;i++){
        const selected=files[i];
        const ext=(selected.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g,"") || "jpg";
        const fileName=`${b.id}-${Date.now()}-${i+1}.${ext}`;
        const up=await fetch(`${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,{
          method:"POST",
          headers:{
            apikey:SUPABASE_KEY,
            Authorization:`Bearer ${session.token}`,
            "Content-Type":selected.type,
            "x-upsert":"true"
          },
          body:selected
        });
        if(!up.ok){
          let uploadError="Foto a pa t kapab monte.";
          try{const uploadBody=await up.json();uploadError=uploadBody?.message||uploadBody?.error||uploadError;}catch(_){}
          throw new Error(uploadError);
        }
        uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`);
      }
      await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(b.id)}`,{
        method:"PATCH",
        body:JSON.stringify({image_url:uploadedUrls[0],image_urls:JSON.stringify(uploadedUrls)})
      });
    }


    qs("businessForm")
      ?.reset();


    msg(
      "formMessage",
      "✅ Anons ou resevwa. Li pap parèt piblik jiskaske Admin valide li.",
      "success"
    );


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
========================================================= */

async function loadBusinesses(){

  const box=
    qs("businessListings");


  if(!box)return;


  box.innerHTML=
    "<div class='loading-state'><span>⏳</span><p>Anons yo ap chaje...</p></div>";


  try{

    const rows=
      await publicApi(
        "/rest/v1/businesses?status=eq.approved&select=*&order=created_at.desc&limit=100"
      );


    window.__businessRows=
      Array.isArray(rows)
        ? rows
        : [];


    renderBusinesses();


  }catch(err){

    console.error("Public businesses:", err);
    const message = err && err.message ? err.message : "Erè enkoni";
    box.innerHTML = `
      <div class="notice" role="alert">
        <span>⚠️</span>
        <h3>Nou pa kapab chaje anons yo kounye a.</h3>
        <p>Detay erè a pou ede nou jwenn kòz la:</p>
        <small>${esc(message)}</small>
        <p>Si mesaj sa a parèt ankò, voye tèks erè a bay sipò.</p>
      </div>`;

  }

}


function businessImageList(b){
  const images=[];
  if(b?.image_url) images.push(String(b.image_url));
  if(b?.image_urls){
    try{
      const parsed=typeof b.image_urls==="string" ? JSON.parse(b.image_urls) : b.image_urls;
      if(Array.isArray(parsed)){
        for(const url of parsed){
          if(typeof url==="string" && /^https?:\/\//i.test(url) && !images.includes(url)) images.push(url);
        }
      }
    }catch(_){/* Old rows may contain a non-JSON image_urls value. */}
  }
  return images.filter(url=>/^https?:\/\//i.test(url)).slice(0,50);
}

function businessType(category){
  const raw = String(category || "").trim();
  const parts = raw.split(":");
  if (parts.length > 1) return parts[0];
  // Older listings saved only a category (for example "restaurant")
  // instead of the newer "business:restaurant" format. Keep those visible
  // under the general Business tab rather than making them disappear.
  const knownTypes = ["employee", "employer", "professional", "service", "business", "property"];
  return knownTypes.includes(raw.toLowerCase()) ? raw.toLowerCase() : (raw ? "business" : "");
}

function businessCategory(category){
  const raw = String(category || "").trim();
  const parts = raw.split(":");
  if (parts.length > 1) return parts.slice(1).join(":");
  const knownTypes = ["employee", "employer", "professional", "service", "business", "property"];
  return knownTypes.includes(raw.toLowerCase()) ? "" : raw;
}


function businessTypeLabel(type){

  return ({

    employee:
      "👷 Anplwaye",

    employer:
      "🏢 Anplwayè",

    professional:
      "🧑🏾‍🔧 Pwofesyonèl",

    service:
      "🛠️ Sèvis",

    business:
      "🛍️ Biznis",

    property:
      "🏠 Byen"

  })[type]

  ||

  "📌 Anons";

}


function renderBusinesses(){

  const box=
    qs("businessListings");


  if(!box)return;


  let rows=
    Array.isArray(
      window.__businessRows
    )
      ? [
          ...window.__businessRows
        ]
      : [];


  const active=
    document
      .querySelector(
        ".market-tab.active"
      )
      ?.dataset.filter ||
    "all";


  const search=
    (
      qs("marketSearch")
        ?.value ||
      ""
    )
    .trim()
    .toLowerCase();


  const locationFilter=
    (
      qs("marketLocation")
        ?.value ||
      ""
    )
    .trim()
    .toLowerCase();


  if(
    active &&
    active!=="all"
  ){

    rows=
      rows.filter(
        b=>
          businessType(
            b.category
          )===active
      );

  }


  if(search){

    rows=
      rows.filter(
        b=>[
          b.business_name,
          b.category,
          b.location,
          b.description,
          b.price
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
      );

  }


  if(locationFilter){

    const aliases={
      caribbean:["caribbean","karayib","bahamas","nassau","new providence","haiti","ayiti","haïti"],
      "north-america":["north america","united states","usa","canada","america di nò"],
      remote:["remote","online","sou entènèt","anywhere","work from home"]
    };


    const terms=
      aliases[locationFilter] ||
      [locationFilter];


    rows=
      rows.filter(b=>{

        const value=
          String(
            b.location || ""
          ).toLowerCase();


        return terms.some(
          term=>
            value.includes(term)
        );

      });

  }


  // On the homepage, show the six newest approved listings; the full Business/Anons pages keep all matches.
  if(box.classList.contains("home-listing-grid")){
    rows=rows.slice(0,6);
  }

  const count=
    qs("marketResultCount");


  if(count){

    count.textContent=
      `${rows.length} anons disponib`;

  }


  if(!rows.length){

    box.innerHTML=
      "<div class='empty-state'><span>🔎</span><h3>Pa gen anons ki disponib</h3><p>Eseye chanje rechèch ou oswa filtre a, oswa retounen pita pou nouvo anons.</p></div>";

    return;

  }


  box.innerHTML=
    rows.map(b=>{

      const wa=
        waNumber(
          b.whatsapp
        );


      const phone=
        attr(
          b.phone
        );


      const type=
        businessType(
          b.category
        );


      const cat=
        businessCategory(
          b.category
        );


      return `

        <article
          id="listing-${attr(b.id)}"
          class="business-card card"
          data-listing-id="${attr(b.id)}"
          role="link"
          tabindex="0"
          aria-label="Ouvri anons: ${attr(b.business_name || 'Anons')}"
          onclick="if(!event.target.closest('a,button,input,select,textarea,label')) openBusinessAd('${attr(b.id)}')"
          onkeydown="if((event.key==='Enter'||event.key===' ') && !event.target.closest('a,button,input,select,textarea,label')){event.preventDefault();openBusinessAd('${attr(b.id)}')}"
        >

          ${
            b.image_url

              ? `

                <img
                  src="${attr(
                    b.image_url
                  )}"
                  alt="${attr(
                    b.business_name
                  )}"
                  loading="lazy"

                  onerror="
                    this.style.display='none';
                    this.nextElementSibling?.classList.remove('hidden')
                  "
                >

              `

              : `

                <div class="business-card-placeholder">
                  🏢
                </div>

              `
          }


          <div class="business-card-body">

            <div class="card-kicker">

              ${esc(
                businessTypeLabel(
                  type
                )
              )}

            </div>


            <h3>
              ${esc(
                b.business_name ||
                "Anons"
              )}
            </h3>


            <div class="meta">

              <span class="badge">
                📍 ${esc(
                  b.location ||
                  "—"
                )}
              </span>

              ${
                cat

                  ? `

                    <span class="badge">
                      ${esc(cat)}
                    </span>

                  `

                  : ""
              }

            </div>


            ${
              b.price

                ? `

                  <p class="price-line">
                    💰 ${esc(
                      b.price
                    )}
                  </p>

                `

                : ""
            }


            <p class="card-description">
              ${esc(
                b.description ||
                ""
              )}
            </p>


            <div
              class="actions"
              onclick="event.stopPropagation()"
            >

              ${
                phone

                  ? `

                    <a
                      class="btn btn-small btn-primary"
                      href="tel:${phone}"
                    >
                      📞 Rele
                    </a>

                  `

                  : ""
              }


              ${
                wa

                  ? `

                    <a
                      class="btn btn-small btn-secondary"
                      target="_blank"
                      rel="noopener"
                      href="https://wa.me/${wa}"
                    >
                      💬 WhatsApp
                    </a>

                  `

                  : ""
              }

              <button
                type="button"
                class="btn btn-small share-button"
                data-share-title="${attr(b.business_name || "Anons")} — Eagle-J Connect"
                data-share-text="${attr([b.location || "", b.price ? "Pri: " + b.price : "", b.description || ""].filter(Boolean).join(" • "))}"
                data-share-url="${attr(new URL("anons.html?id=" + encodeURIComponent(b.id), window.location.href).href)}"
                onclick="event.stopPropagation(); shareEaglePost(this)"
                aria-label="Pataje anons ${attr(b.business_name || "") }"
              >🔗 Share</button>

            </div>


            <div class="view-link listing-view-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
              <a class="btn btn-primary btn-small" href="anons.html?id=${encodeURIComponent(b.id)}" onclick="event.stopPropagation()" aria-label="Detay anons ${attr(b.business_name || "anons")}">Detay anons →</a>
              <a class="btn btn-secondary btn-small" href="anons.html?id=${encodeURIComponent(b.id)}" onclick="event.stopPropagation()" aria-label="Detay biznis ${attr(b.business_name || "biznis")}">Detay biznis →</a>
            </div>

          </div>

        </article>

      `;

    }).join("");

  box.querySelectorAll(".business-card[data-listing-id]").forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
  });

  // Scroll to the selected business after listings finish rendering.
  if (!box.classList.contains("home-listing-grid") && window.location.hash.startsWith("#listing-")) {
    const requestedId = decodeURIComponent(window.location.hash.slice("#listing-".length));
    const requestedCard = document.getElementById("listing-" + requestedId);
    if (requestedCard) {
      setTimeout(() => requestedCard.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      requestedCard.classList.add("listing-highlight");
    }
  }

}


/* =========================================================
   OPEN BUSINESS AD
========================================================= */

window.openBusinessAd=function(id){
  if(!id){
    console.error("Business ID missing.");
    return;
  }
  // Resolve from the current site directory, matching the profile's detail route.
  const detailUrl = new URL("anons.html", window.location.href);
  detailUrl.searchParams.set("id", String(id));
  window.location.href = detailUrl.href;
};

// Let users open a listing by tapping the card body, while keeping phone,
// WhatsApp, share, and explicit detail links clickable as their own actions.
document.addEventListener("click", function(event){
  const card = event.target && event.target.closest ? event.target.closest(".business-card[data-listing-id]") : null;
  if (!card) return;
  if (event.target.closest("a, button, input, select, textarea, label")) return;
  const id = card.getAttribute("data-listing-id");
  if (id) window.openBusinessAd(id);
});

document.addEventListener("keydown", function(event){
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target && event.target.closest ? event.target.closest(".business-card[data-listing-id]") : null;
  if (!card || event.target.closest("a, button, input, select, textarea, label")) return;
  event.preventDefault();
  const id = card.getAttribute("data-listing-id");
  if (id) window.openBusinessAd(id);
});


/* =========================================================
   BUSINESS DETAIL
========================================================= */

async function loadBusinessDetail(){

  const box=
    qs("businessDetail");


  if(!box)return;


  const params=
    new URLSearchParams(
      location.search
    );


  const id=
    params.get("id");


  if(!id){

    box.innerHTML=
      "<p class='notice'>❌ Anons sa pa gen ID.</p>";

    return;

  }


  try{

    const rows = await publicApi(
      `/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&status=eq.approved&select=*`
    );
    let b = rows?.[0] || null;

    // Owners should be able to open their own pending/rejected listing from
    // their profile. This private fallback is scoped to the authenticated
    // user's ID and is never used to expose another user's unpublished ad.
    if (!b) {
      const session = getSession();
      if (session?.user?.id) {
        try {
          const ownRows = await api(
            `/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}&select=*`
          );
          b = ownRows?.[0] || null;
        } catch (ownerReadError) {
          console.warn("Could not load own unpublished listing:", ownerReadError?.message || ownerReadError);
        }
      }
    }

    if(!b){
      box.innerHTML = "<p class='notice'>❌ Anons sa pa egziste, poko apwouve, oswa li pa disponib pou piblik la.</p>";
      return;
    }


    const phone=
      attr(
        b.phone || ""
      );


    const wa=
      waNumber(
        b.whatsapp
      );


    box.innerHTML=`

      ${
        businessImageList(b).length
          ? `<div class="business-detail-gallery">${businessImageList(b).map((url,index)=>`<img class="business-detail-image" src="${attr(url)}" alt="${attr(b.business_name)} — foto ${index+1}" loading="lazy" onclick="window.openBusinessImage && window.openBusinessImage('${attr(url)}')">`).join("")}</div>`
          : `<div class="business-detail-placeholder">🏢</div>`
      }


      <h1>
        ${esc(
          b.business_name
        )}
      </h1>


      <div class="meta">

        <span class="badge">
          ${esc(
            businessTypeLabel(
              businessType(
                b.category
              )
            )
          )}
        </span>

        <span class="badge">
          📂 ${esc(
            businessCategory(
              b.category
            )
          )}
        </span>

        <span class="badge">
          📍 ${esc(
            b.location
          )}
        </span>

      </div>


      ${
        b.price

          ? `

            <p>
              <strong>
                💰 Pri:
              </strong>

              ${esc(
                b.price
              )}

            </p>

          `

          : ""
      }


      <p style="white-space:pre-line">

        ${esc(
          b.description
        )}

      </p>


      <div class="actions">

        ${
          phone

            ? `

              <a href="tel:${phone}">
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
                href="https://wa.me/${wa}"
              >

                <button type="button">
                  💬 WhatsApp
                </button>

              </a>

            `

            : ""
        }

        ${getSession()?.user?.id && getSession().user.id === b.user_id ? `
          <a class="btn btn-secondary" href="kreye-anons.html?edit=${encodeURIComponent(b.id)}">✏️ Editer Anons</a>
        ` : ""}

        <button
          type="button"
          class="btn share-button"
          data-share-title="${attr(b.business_name || "Anons")} — Eagle-J Connect"
          data-share-text="${attr([b.location || "", b.price ? "Pri: " + b.price : "", b.description || ""].filter(Boolean).join(" • "))}"
          data-share-url="${attr(window.location.href)}"
          onclick="shareEaglePost(this)"
        >🔗 Share</button>

      </div>

    `;


  }catch(err){

    console.error(err);


    box.innerHTML=
      `<p class='notice'>❌ Nou pa kapab chaje detay anons sa a.</p><p class='notice' style='font-size:13px'>Detay teknik: ${esc(err?.message || "Erè enkoni")}</p>`;

  }

}


/* =========================================================
   HOMEPAGE STATISTICS
========================================================= */

async function loadStats(){
  const counts=[
    {id:"stat-jobs", table:"jobs", filter:"&status=eq.approved"},
    {id:"stat-business", table:"businesses", filter:"&status=eq.approved"},
    {id:"stat-users", table:"public_member_profiles", filter:""}
  ];

  for(const item of counts){
    const node=qs(item.id);
    if(!node) continue;
    try{
      const response=await fetch(
        `${SUPABASE_URL}/rest/v1/${item.table}?select=id${item.filter}&limit=1`,
        {method:"GET",headers:{
          apikey:SUPABASE_KEY,
          Accept:"application/json",
          Range:"0-0",
          Prefer:"count=exact"
        },cache:"no-store"}
      );
      if(!response.ok){
        const raw=await response.text();
        throw new Error(`${raw || "Request failed"} (HTTP ${response.status})`);
      }
      const range=response.headers.get("content-range");
      const total=range ? range.split("/").pop() : null;
      const count=total && total!=="*" ? Number.parseInt(total,10) : NaN;
      node.textContent=Number.isFinite(count) ? String(count) : "—";
    }catch(error){
      console.warn(`Could not load public ${item.table} statistics:`,error?.message || error);
      node.textContent="—";
    }
  }

  const ads=qs("stat-ads");
  if(ads){
    const businessCount=qs("stat-business")?.textContent;
    ads.textContent=businessCount && businessCount!=="—" ? businessCount : "—";
  }
}


/* Accessible click-to-enlarge viewer for listing photos. */
window.openBusinessImage=function(url){
  if(!url || !/^https?:\/\//i.test(url)) return;
  let overlay=document.getElementById("businessImageViewer");
  if(!overlay){
    overlay=document.createElement("div");
    overlay.id="businessImageViewer";
    overlay.className="image-viewer-overlay";
    overlay.innerHTML='<button type="button" class="image-viewer-close" aria-label="Fèmen foto a">×</button><img alt="Foto anons la">';
    overlay.addEventListener("click",event=>{if(event.target===overlay || event.target.closest(".image-viewer-close")) overlay.remove();});
    document.body.appendChild(overlay);
  }
  overlay.querySelector("img").src=url;
};

/* =========================================================
   CONTACT
========================================================= */

function initContact(){

  const form=
    qs("contactForm");


  if(!form)return;


  form.addEventListener(
    "submit",
    e=>{

      e.preventDefault();


      const name=
        qs("contactName")
          ?.value.trim() ||
        "";


      const email=
        qs("contactEmail")
          ?.value.trim() ||
        "";


      const phone=
        qs("contactPhone")
          ?.value.trim() ||
        "";


      const message=
        qs("contactMessage")
          ?.value.trim() ||
        "";


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

          `Non: ${name}
Email: ${email}
Telefòn: ${phone}

Mesaj:
${message}`

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
   PUBLIC USERS DIRECTORY
========================================================= */

async function loadUsersDirectory(){

  const box=
    qs("usersDirectory");


  const count=
    qs("usersDirectoryCount");


  if(!box)return;


  try{

    let rows;
    try{
      // Prefer the restricted public view so private email/phone fields are never requested.
      rows=await api("/rest/v1/public_member_profiles?select=id,full_name,account_type&limit=100");
    }catch(_){
      rows=await api("/rest/v1/profiles?select=id,first_name,last_name,account_type&limit=100");
    }


    const users=
      Array.isArray(rows)
        ? rows
        : [];


    if(count){

      count.textContent=
        `${users.length} itilizatè afiche`;

    }


    if(!users.length){

      box.innerHTML=
        `
          <div class="empty-state">

            <div class="empty-icon">
              👥
            </div>

            <h3>
              Pa gen itilizatè pou afiche
            </h3>

            <p>
              Nou poko gen pwofil piblik ki disponib.
            </p>

          </div>
        `;

      return;

    }


    box.innerHTML=
      users.map(u=>{

        const name=
          esc(
            (u.full_name || [u.first_name,u.last_name].filter(Boolean).join(" ")) ||
            "Itilizatè Eagle-J"
          );


        const type=
          esc(
            formatAccountType(
              u.account_type
            )
          );


        return `

          <article class="user-card">

            <div class="user-avatar">

              ${esc(
                (
                  (u.full_name || [u.first_name,u.last_name].filter(Boolean).join(" ")) ||
                  "EJ"
                )
                .trim()
                .slice(0,1)
                .toUpperCase()
              )}

            </div>


            <div class="user-card-body">

              <h3>
                ${name}
              </h3>

              <p>
                ${type}
              </p>

            </div>

          </article>

        `;

      }).join("");


  }catch(err){

    console.error(
      "Users directory:",
      err
    );


    if(count){

      count.textContent="";

    }


    box.innerHTML=
      `
        <div class="notice">
          ❌ Nou pa kapab chaje lis itilizatè yo kounye a.
        </div>
      `;

  }

}


function formatAccountType(type){

  const map={

    job_seeker:
      "Moun k ap chèche travay",

    employer:
      "Anplwayè",

    business:
      "Biznis",

    professional:
      "Pwofesyonèl"

  };


  return map[type] ||
    "Manm Eagle-J Connect";

}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    setupMobileMenu();


    /* =====================================================
       REGISTRATION
    ===================================================== */

    const reg=
      qs("registerForm");


    if(reg){

      reg.addEventListener(
        "submit",
        registerUser
      );

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const login=
      qs("loginForm");


    if(login){

      login.addEventListener(
        "submit",
        loginUser
      );

    }


    /* =====================================================
       PUBLIC JOBS
    ===================================================== */

    if(
      qs("jobListings") ||
      qs("jobsList")
    ){

      loadJobs();


      qs("searchJob")
        ?.addEventListener(
          "input",
          renderJobs
        );


      qs("jobFilter")
        ?.addEventListener(
          "change",
          renderJobs
        );

    }


    /* =====================================================
       BUSINESS LISTINGS
    ===================================================== */

    if(
      qs("businessListings")
    ){

      loadBusinesses();


      qs("marketSearch")
        ?.addEventListener(
          "input",
          renderBusinesses
        );


      qs("marketLocation")
        ?.addEventListener(
          "change",
          renderBusinesses
        );


      document
        .querySelectorAll(
          ".market-tab"
        )
        .forEach(tab=>{

          tab.addEventListener(
            "click",
            ()=>{

              document
                .querySelectorAll(
                  ".market-tab"
                )
                .forEach(
                  t=>
                    t.classList.remove(
                      "active"
                    )
                );


              tab.classList.add(
                "active"
              );


              renderBusinesses();

            }
          );

        });

    }


    /* =====================================================
       BUSINESS DETAIL
    ===================================================== */

    if(
      qs("businessDetail")
    ){

      loadBusinessDetail();

    }


    /* =====================================================
       BUSINESS FORM
    ===================================================== */

    if(
      qs("businessForm")
    ){

      qs("businessForm")
        .addEventListener(
          "submit",
          submitBusiness
        );
      setupBusinessImagePicker();
      loadBusinessEditForm();

    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    if(
      qs("dashboardLoading")
    ){

      loadDashboard();

    }


    /* =====================================================
       EMPLOYER DASHBOARD
    ===================================================== */

    if(
      qs("employerName")
    ){

      loadEmployerDashboard();

    }


    /* =====================================================
       JOB FORM
    ===================================================== */

    if(
      qs("jobForm")
    ){

      qs("jobForm")
        .addEventListener(
          "submit",
          postJob
        );

    }


    /* =====================================================
       MY JOBS
    ===================================================== */

    if(
      qs("myJobs")
    ){

      const s=
        getSession();


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

    if(
      qs("stats")
    ){

      loadStats();

    }


    /* =====================================================
       PUBLIC USERS DIRECTORY
    ===================================================== */

    if(
      qs("usersDirectory")
    ){

      loadUsersDirectory();

    }


    /* =====================================================
       CONTACT
    ===================================================== */

    initContact();

  }
); 

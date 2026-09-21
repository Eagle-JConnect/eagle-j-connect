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

function setupMobileMenu(){ /* menu.js owns the final navigation controller */ }


/* Compatibility with pages using onclick="toggleMenu()" */

window.toggleMenu=function(){
  const button=document.getElementById("menuToggle");
  if(button)button.click();
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
   REGISTRATION
========================================================= */

async function registerUser(e){

  e.preventDefault();

  const firstName=qs("firstName")?.value.trim() || "";
  const lastName=qs("lastName")?.value.trim() || "";
  const legacyFullName=qs("fullName")?.value.trim() || "";
  const fullName=(legacyFullName || `${firstName} ${lastName}`).trim();
  const email=qs("email")?.value.trim().toLowerCase() || "";
  const phone=qs("phone")?.value.trim() || "";
  const accountType=qs("accountType")?.value || "";
  const password=qs("password")?.value || "";
  const confirm=qs("confirmPassword")?.value || "";

  if(!fullName || !email || !phone || !accountType || !password || !confirm){
    msg("registerMessage","⚠️ Tanpri ranpli tout chan obligatwa yo.");
    return;
  }

  if(password.length<6){
    msg("registerMessage","❌ Modpas la dwe gen omwen 6 karaktè.");
    return;
  }

  if(password!==confirm){
    msg("registerMessage","❌ Modpas yo pa menm.");
    return;
  }

  msg("registerMessage","⏳ Nap kreye kont ou...","warning");

  try{
    const data=await api("/auth/v1/signup",{
      method:"POST",
      body:JSON.stringify({
        email,
        password,
        data:{
          full_name:fullName,
          first_name:firstName || fullName.split(" ")[0],
          last_name:lastName,
          phone,
          account_type:accountType
        }
      })
    });

    if(data?.access_token){
      saveSession(data);
    }

    if(data?.user?.id && data?.access_token){
      try{
        await api("/rest/v1/profiles",{
          method:"POST",
          body:JSON.stringify({
            id:data.user.id,
            full_name:fullName,
            email,
            phone,
            account_type:accountType
          }),
          headers:{Prefer:"return=representation"}
        });
      }catch(profileErr){
        console.warn("Profile insert:",profileErr);
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

    setTimeout(()=>{
      location.href="login.html";
    },1400);

  }catch(err){
    console.error(err);
    msg("registerMessage","❌ "+err.message);
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


    msg(
      message,
      "✅ Ou konekte avèk siksè!",
      "success"
    );


    setTimeout(
      ()=>{

        location.href=
          profile.account_type==="employer"
            ? "employer.html"
            : "dashboard.html";

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
    title:qs("jobTitle")?.value.trim() || "",
    company:qs("jobCompany")?.value.trim() || "",
    location:qs("jobLocation")?.value.trim() || "",
    job_type:qs("jobType")?.value || "",
    salary:qs("jobSalary")?.value.trim() || null,
    description:qs("jobDescription")?.value.trim() || "",
    contact:qs("jobContact")?.value.trim() || ""
  };

  if(!vals.title || !vals.company || !vals.location || !vals.job_type || !vals.description || !vals.contact){
    msg("jobMessage","⚠️ Tanpri ranpli tout chan obligatwa yo.");
    return;
  }

  msg("jobMessage","⏳ Travay la ap pibliye...","warning");

  try{
    await api("/rest/v1/jobs",{
      method:"POST",
      body:JSON.stringify({...vals,employer_id:s.user.id}),
      headers:{Prefer:"return=representation"}
    });

    qs("jobForm")?.reset();

    msg("jobMessage","✅ Travay la pibliye avèk siksè!","success");

    await loadMyJobs(s.user.id,s.token);

  }catch(err){
    console.error(err);
    msg("jobMessage","❌ "+err.message);
  }
}

/* =========================================================
   MY JOBS
========================================================= */

async function loadMyJobs(userId,token){

  const box=qs("myJobs") || qs("myJobsList");
  if(!box)return;

  box.innerHTML="<p>⏳ Travay yo ap chaje...</p>";

  try{
    const jobs=await api(
      `/rest/v1/jobs?employer_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`,
      {headers:{Authorization:`Bearer ${token}`}}
    );

    if(!jobs?.length){
      box.innerHTML="<p>Ou poko poste okenn travay.</p>";
      return;
    }

    box.innerHTML=jobs.map(job=>`
      <article class="job-card card">
        <div class="card-kicker">TRAVAY POU OU</div>
        <h3>${esc(job.title || "Travay")}</h3>
        <p><strong>${esc(job.company || job.company_name || "")}</strong></p>
        <div class="meta">
          <span class="badge">📍 ${esc(job.location || "—")}</span>
          <span class="badge">💼 ${esc(job.job_type || "—")}</span>
          ${job.salary?`<span class="badge">💰 ${esc(job.salary)}</span>`:""}
        </div>
        <p>${esc(job.description || "")}</p>
      </article>
    `).join("");

  }catch(err){
    console.error(err);
    box.innerHTML="<p>❌ Nou pa kapab chaje travay ou yo.</p>";
  }
}

/* =========================================================
   BUSINESS ADS - CREATE
========================================================= */

async function submitBusiness(e){

  e.preventDefault();

  const session=getSession();
  if(!session){
    msg("formMessage","⚠️ Tanpri konekte anvan ou pibliye yon anons.");
    setTimeout(()=>location.href="login.html",900);
    return;
  }

  const file=qs("businessImage")?.files?.[0] || null;
  const listingType=qs("listingType")?.value || "business";
  const category=qs("category")?.value || "";
  const encodedCategory=`${listingType}:${category}`;

  const values={
    business_name:qs("businessName")?.value.trim() || "",
    category:encodedCategory,
    location:qs("location")?.value.trim() || "",
    phone:qs("phone")?.value.trim() || null,
    whatsapp:qs("whatsapp")?.value.trim() || null,
    price:qs("price")?.value.trim() || null,
    description:qs("description")?.value.trim() || "",
    image_url:null
  };

  if(!values.business_name || !category || !values.location || !values.description){
    msg("formMessage","⚠️ Tanpri ranpli tout chan obligatwa yo.");
    return;
  }

  if(file && (!file.type.startsWith("image/") || file.size>5*1024*1024)){
    msg("formMessage","❌ Foto a dwe yon imaj ki pi piti pase 5MB.");
    return;
  }

  msg("formMessage","⏳ Anons lan ap pibliye...","warning");

  try{
    const rows=await api("/rest/v1/businesses",{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify(values)
    });

    const b=Array.isArray(rows)?rows[0]:rows;
    if(!b?.id) throw new Error("Anons lan pa retounen yon ID.");

    if(file){
      const ext=(file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName=`${b.id}-${Date.now()}.${ext}`;

      const up=await fetch(
        `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,
        {
          method:"POST",
          headers:{
            apikey:SUPABASE_KEY,
            Authorization:`Bearer ${session.token}`,
            "Content-Type":file.type,
            "x-upsert":"true"
          },
          body:file
        }
      );

      if(!up.ok) throw new Error("Foto a pa t kapab monte.");

      const imageURL=`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`;

      await api(
        `/rest/v1/businesses?id=eq.${encodeURIComponent(b.id)}`,
        {
          method:"PATCH",
          body:JSON.stringify({image_url:imageURL})
        }
      );
    }

    qs("businessForm")?.reset();
    msg("formMessage","✅ Anons ou a pibliye avèk siksè!","success");

    await loadBusinesses();

  }catch(err){
    console.error(err);
    msg("formMessage","❌ "+err.message);
  }
}

/* =========================================================
   BUSINESS LISTINGS
   CLICK AN AD -> anons.html?id=BUSINESS_ID
========================================================= */

async function loadBusinesses(){

  const box=qs("businessListings");
  if(!box)return;

  box.innerHTML="<div class='loading-state'><span>⏳</span><p>Anons yo ap chaje...</p></div>";

  try{
    const rows=await api("/rest/v1/businesses?select=*&order=created_at.desc");
    window.__businessRows=Array.isArray(rows)?rows:[];

    renderBusinesses();

  }catch(err){
    console.error(err);
    box.innerHTML="<div class='empty-state'><span>⚠️</span><p>Nou pa kapab chaje anons yo.</p></div>";
  }
}

function businessType(category){
  const raw=String(category || "");
  const parts=raw.split(":");
  return parts.length>1 ? parts[0] : "";
}

function businessCategory(category){
  const raw=String(category || "");
  const parts=raw.split(":");
  return parts.length>1 ? parts.slice(1).join(":") : raw;
}

function businessTypeLabel(type){
  return ({
    employee:"👷 Anplwaye",
    employer:"🏢 Anplwayè",
    professional:"🧑🏾‍🔧 Pwofesyonèl",
    service:"🛠️ Sèvis",
    business:"🛍️ Biznis",
    property:"🏠 Byen"
  })[type] || "📌 Anons";
}

function renderBusinesses(){

  const box=qs("businessListings");
  if(!box)return;

  let rows=Array.isArray(window.__businessRows)?[...window.__businessRows]:[];
  const active=document.querySelector(".market-tab.active")?.dataset.filter || "all";
  const search=(qs("marketSearch")?.value || "").trim().toLowerCase();
  const location=(qs("marketLocation")?.value || "").trim().toLowerCase();

  if(active && active!=="all"){
    rows=rows.filter(b=>businessType(b.category)===active);
  }

  if(search){
    rows=rows.filter(b=>[
      b.business_name,
      b.category,
      b.location,
      b.description,
      b.price
    ].filter(Boolean).join(" ").toLowerCase().includes(search));
  }

  if(location){
    const aliases={
      ayiti:["ayiti","haiti","haïti"],
      bahamas:["bahamas","nassau","new providence"]
    };
    const terms=aliases[location] || [location];
    rows=rows.filter(b=>{
      const value=String(b.location || "").toLowerCase();
      return terms.some(term=>value.includes(term));
    });
  }

  const count=qs("marketResultCount");
  if(count){
    count.textContent=`${rows.length} ${rows.length===1 ? "anons" : "anons"} disponib`;
  }

  if(!rows.length){
    box.innerHTML="<div class='empty-state'><span>🔎</span><h3>Pa gen rezilta</h3><p>Eseye chanje rechèch ou oswa filtre a.</p></div>";
    return;
  }

  box.innerHTML=rows.map(b=>{
    const wa=waNumber(b.whatsapp);
    const phone=attr(b.phone);
    const type=businessType(b.category);
    const cat=businessCategory(b.category);

    return `
      <article class="business-card card" onclick="openBusinessAd('${attr(b.id)}')" role="button" tabindex="0"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openBusinessAd('${attr(b.id)}')}">
        ${b.image_url
          ? `<img src="${attr(b.image_url)}" alt="${attr(b.business_name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling?.classList.remove('hidden')">`
          : `<div class="business-card-placeholder">🏢</div>`}
        <div class="business-card-body">
          <div class="card-kicker">${esc(businessTypeLabel(type))}</div>
          <h3>${esc(b.business_name || "Anons")}</h3>
          <div class="meta">
            <span class="badge">📍 ${esc(b.location || "—")}</span>
            ${cat?`<span class="badge">${esc(cat)}</span>`:""}
          </div>
          ${b.price?`<p class="price-line">💰 ${esc(b.price)}</p>`:""}
          <p class="card-description">${esc(b.description || "")}</p>
          <div class="actions" onclick="event.stopPropagation()">
            ${phone?`<a class="btn btn-small btn-primary" href="tel:${phone}">📞 Rele</a>`:""}
            ${wa?`<a class="btn btn-small btn-secondary" target="_blank" rel="noopener" href="https://wa.me/${wa}">💬 WhatsApp</a>`:""}
          </div>
          <div class="view-link">Wè detay →</div>
        </div>
      </article>`;
  }).join("");
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

    const rows=await api(
      `/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&select=*`
    );

    const b=rows?.[0];

    if(!b){
      box.innerHTML="<p class='notice'>❌ Anons sa pa egziste oswa li pa disponib.</p>";
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
        <span class="badge">${esc(businessTypeLabel(businessType(b.category)))}</span><span class="badge">📂 ${esc(businessCategory(b.category))}</span>
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

    console.error(err);

    box.innerHTML=
      "<p class='notice'>❌ Nou pa kapab chaje detay anons sa a.</p>";

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
       MOBILE MENU
    ===================================================== */

    setupMobileMenu();


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

    if(qs("jobListings") || qs("jobsList")){

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

      qs("marketSearch")?.addEventListener("input",renderBusinesses);
      qs("marketLocation")?.addEventListener("change",renderBusinesses);
      document.querySelectorAll(".market-tab").forEach(tab=>{
        tab.addEventListener("click",()=>{
          document.querySelectorAll(".market-tab").forEach(t=>t.classList.remove("active"));
          tab.classList.add("active");
          renderBusinesses();
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
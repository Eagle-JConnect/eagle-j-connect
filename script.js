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
    "user_is_admin"
  ].forEach(
    k=>localStorage.removeItem(k)
  );

}


window.logoutUser=()=>{

  clearSession();

  location.href="login.html";

};


/* =========================================================
   VERIFY SUPABASE AUTH SESSION
========================================================= */

async function verifyAuthSession(){

  const session=getSession();

  if(!session?.token){

    return null;

  }

  try{

    const r=await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method:"GET",

        headers:{
          "apikey":SUPABASE_KEY,
          "Authorization":
            `Bearer ${session.token}`
        }
      }
    );

    const text=await r.text();

    let data=null;

    try{

      data=text
        ? JSON.parse(text)
        : null;

    }catch(e){

      data=null;

    }

    if(!r.ok || !data?.id){

      clearSession();

      return null;

    }

    const verifiedUser={
      ...session.user,
      ...data,
      id:data.id
    };

    localStorage.setItem(
      "supabase_user",
      JSON.stringify(verifiedUser)
    );

    localStorage.setItem(
      "supabase_user_id",
      data.id
    );

    localStorage.setItem(
      "supabase_user_email",
      data.email || ""
    );

    return {
      token:session.token,
      user:verifiedUser
    };

  }catch(error){

    console.error(
      "Auth verification:",
      error
    );

    return null;

  }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu(){
  /* menu.js owns the final navigation controller */
}


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

  if(window.EJC?.t){

    text=window.EJC.t(text);

  }

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

  const {
    skipAuth=false,
    ...fetchOptions
  }=options;


  const headers=Object.assign(
    {
      "apikey":SUPABASE_KEY,
      "Content-Type":"application/json"
    },
    fetchOptions.headers || {}
  );


  const session=getSession();


  if(
    !skipAuth &&
    session?.token &&
    !headers.Authorization
  ){

    headers.Authorization=
      `Bearer ${session.token}`;

  }


  const r=await fetch(
    SUPABASE_URL+path,
    {
      ...fetchOptions,
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

    const errorMessage =
      data?.message ||
      data?.msg ||
      data?.error_description ||
      data?.details ||
      data?.hint ||
      (typeof data === "string" ? data : "Request failed");

    const err = new Error(errorMessage);
    err.code = data?.code || r.status;
    err.details = data?.details || "";
    err.hint = data?.hint || "";

    throw err;

  }


  return data;

}


/* =========================================================
   ADMIN CHECK
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


    localStorage.setItem(
      "user_is_admin",
      "false"
    );


    return false;

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

        skipAuth:true,

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

            headers:{
              Prefer:"return=representation"
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

    const data=await api(
      "/auth/v1/token?grant_type=password",
      {
        method:"POST",

        skipAuth:true,

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


    saveSession(data);


    const verified=
      await verifyAuthSession();


    if(!verified){

      throw new Error(
        "Sesyon an pa t kapab verifye ak Supabase."
      );

    }


    const authUser=verified.user;


    let profiles=[];


    try{

      profiles=await api(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(authUser.id)}&select=*`
      );

    }catch(err){

      console.warn(
        "Profile request:",
        err
      );

    }


    const profile=
      profiles?.[0];


    if(!profile){

      clearSession();

      throw new Error(
        "Kont ou pa gen pwofil aktif sou Eagle-J Connect."
      );

    }


    if(
      profile.account_status &&
      profile.account_status!=="active"
    ){

      clearSession();

      throw new Error(
        "Kont ou pa aktif. Tanpri kontakte administratè a."
      );

    }


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


    const user=
      Object.assign(
        {},
        authUser,
        {
          full_name:
            profile.full_name,

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


    const isAdmin=
      await checkCurrentUserIsAdmin(
        authUser.id
      );


    msg(
      message,

      isAdmin
        ? "🛡️ Admin verifye. W ap antre nan Dashboard Admin..."
        : "✅ Ou konekte avèk siksè!",

      "success"
    );


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
   PROFILE PHOTO UPLOAD — available to every signed-in member
========================================================= */
function showProfilePhoto(url){
  const img=qs("profilePhotoPreview");
  const placeholder=qs("profilePhotoPlaceholder");
  if(img){
    if(url){img.src=url;img.style.display="block";}
    else{img.removeAttribute("src");img.style.display="none";}
  }
  if(placeholder) placeholder.style.display=url?"none":"flex";
}

async function saveProfilePhoto(){
  const message=qs("profilePhotoMessage");
  const file=qs("profilePhotoFile")?.files?.[0];
  const session=await verifyAuthSession();
  if(!session?.user?.id || !session?.token){
    if(message) message.textContent="Tanpri konekte ankò anvan ou sove foto a.";
    return;
  }
  if(!file){if(message) message.textContent="Tanpri chwazi yon foto anvan.";return;}
  const allowed=["image/jpeg","image/png","image/webp"];
  if(!allowed.includes(file.type)){if(message) message.textContent="Fòma sa a pa sipòte. Itilize JPG, PNG oswa WEBP.";return;}
  if(file.size>5*1024*1024){if(message) message.textContent="Foto a depase 5 MB. Chwazi yon foto ki pi piti.";return;}
  const ext=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp"})[file.type];
  const objectPath=`profile-avatars/${session.user.id}/avatar.${ext}`;
  const button=qs("saveProfilePhoto");
  if(button) button.disabled=true;
  if(message) message.textContent="Ap telechaje foto a...";
  try{
    await api(`/storage/v1/object/${IMAGE_BUCKET}/${objectPath}`,{
      method:"POST",
      headers:{"Content-Type":file.type,"x-upsert":"true","Authorization":`Bearer ${session.token}`},
      body:file
    });
    const publicUrl=`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${objectPath}?v=${Date.now()}`;
    await api(`/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}`,{
      method:"PATCH",
      headers:{"Prefer":"return=minimal","Content-Type":"application/json"},
      body:JSON.stringify({profile_image_url:publicUrl})
    });
    showProfilePhoto(publicUrl);
    if(message) message.textContent="✅ Foto pwofil ou sove avèk siksè.";
  }catch(err){
    console.error("Profile photo upload:",err);
    if(message) message.textContent="❌ Foto a pa t ka sove: "+err.message+". Verifye SQL/politik ki nan fichye profile-photo-setup.sql.";
  }finally{if(button) button.disabled=false;}
}

/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard(){

  const session=
    await verifyAuthSession();


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

    const rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );


    const p=
      rows?.[0];


    if(!p){

      throw new Error(
        "Pwofil ou pa jwenn."
      );

    }


    qs("profileName").textContent=
      p.full_name || "—";
    showProfilePhoto(p.profile_image_url || "");


    qs("profileEmail").textContent=
      session.user.email || "—";


    qs("profilePhone").textContent=
      p.phone || "—";


    qs("profileType").textContent=
      p.account_type==="employer"
        ? "🏢 Anplwayè"
        : "👷 Moun k ap chèche travay";


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
    loadMyBusinessListings();

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
   EMPLOYER DASHBOARD
========================================================= */

async function loadEmployerDashboard(){

  const session=
    await verifyAuthSession();


  if(!session){

    location.href="login.html";

    return;

  }


  try{

    const rows=await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=*`
    );


    const p=
      rows?.[0];


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

    showProfilePhoto(p.profile_image_url || "");


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

  const session = await verifyAuthSession();

  if(!session?.token || !session?.user?.id){
    msg(
      "jobMessage",
      "⚠️ Sesyon ou a pa aktif. Tanpri konekte ankò."
    );
    return;
  }

  // Use the UUID returned by the verified Supabase Auth session.
  const authUserId = session.user.id;

  console.log("JOB AUTH TEST:", {
    authUserId,
    email: session.user.email,
    tokenExists: !!session.token
  });

  const vals = {
    title: qs("jobTitle")?.value.trim() || "",
    company_name: qs("jobCompany")?.value.trim() || "",
    location: qs("jobLocation")?.value.trim() || "",
    job_type: qs("jobType")?.value || "",
    salary: qs("jobSalary")?.value.trim() || null,
    description: qs("jobDescription")?.value.trim() || "",
    contact_phone: qs("jobContact")?.value.trim() || ""
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
    "⏳ Travay la ap voye bay Admin pou validasyon...",
    "warning"
  );

  const payload = {
    title: vals.title,
    company_name: vals.company_name,
    location: vals.location,
    job_type: vals.job_type,
    salary: vals.salary,
    description: vals.description,
    contact_phone: vals.contact_phone,
    employer_id: authUserId,
    status: "pending"
  };

  try{

    const rows = await api(
      "/rest/v1/jobs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
          Prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      }
    );

    console.log("JOB INSERT SUCCESS:", {
      authUserId,
      rows
    });

    qs("jobForm")?.reset();

    msg(
      "jobMessage",
      "✅ Travay la resevwa. Li pap parèt piblik jiskaske Admin valide li.",
      "success"
    );

    await loadMyJobs(
      authUserId,
      session.token
    );

  }catch(err){

    console.error("JOB INSERT ERROR:", {
      message: err?.message,
      code: err?.code,
      details: err?.details,
      hint: err?.hint,
      authUserId,
      payload
    });

    let detail =
      err?.message ||
      "Erè pandan piblikasyon an.";

    if(err?.details){
      detail += ` — ${err.details}`;
    }

    if(err?.hint){
      detail += ` — ${err.hint}`;
    }

    msg(
      "jobMessage",
      `❌ ${detail}`
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
      await api(
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


  const jobs=
    publicJobs.filter(job=>{

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
              : "Lè yon anplwayè poste yon travay, li ap parèt isit la."
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
        job.company_name ||
        job.company ||
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
        job.contact_phone ||
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
                job.company_name ||
                job.company ||
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
   BUSINESS ADS - CREATE
========================================================= */

async function submitBusiness(e){

  e.preventDefault();


  const session=
    await verifyAuthSession();


  if(!session){

    msg(
      "formMessage",
      "⚠️ Pou mete yon anons, ou dwe konekte sou yon kont aktif. Tanpri konekte ankò."
    );


    setTimeout(
      ()=>location.href="login.html?next=kreye-anons.html",
      1200
    );


    return;

  }

  // IMPORTANT:
  // Admin status is NOT required to publish an ad.
  // Any authenticated active member may submit an ad.
  // RLS forces the row to belong to the current user and status=pending.
  try{
    const profileRows = await api(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=id,account_status`
    );

    const profile = profileRows?.[0];

    if(!profile){
      throw new Error("Pwofil ou pa jwenn. Tanpri fini kreye pwofil ou anvan ou mete yon anons.");
    }

    if(profile.account_status && profile.account_status !== "active"){
      throw new Error("Kont ou pa aktif. Tanpri kontakte administratè a.");
    }
  }catch(err){
    msg("formMessage", "❌ " + err.message);
    return;
  }


  const files=Array.from(qs("businessImage")?.files || []);


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
    image_urls:"[]",

    user_id:
      session.user.id,

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


  if(files.length>50){
    msg("formMessage", "❌ Ou ka mete jiska 50 imaj sèlman.");
    return;
  }

  const invalidFile=files.find(file=>!file.type.startsWith("image/") || file.size>5*1024*1024);
  if(invalidFile){
    msg("formMessage", `❌ Chak foto dwe yon imaj ki pi piti pase 5MB. Pwoblèm: ${invalidFile.name}`);
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
            Authorization:
              `Bearer ${session.token}`,

            Prefer:
              "return=representation"
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


    if(files.length){
      const imageURLs=[];
      for(let i=0;i<files.length;i++){
        const file=files[i];
        const ext=(file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const fileName=`${b.id}/${Date.now()}-${i}.${ext}`;
        const up=await fetch(`${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,{
          method:"POST",
          headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.token}`,"Content-Type":file.type,"x-upsert":"true"},
          body:file
        });
        if(!up.ok){
          let uploadError="Youn nan foto yo pa t kapab monte.";
          try{const uploadBody=await up.json();uploadError=uploadBody?.message||uploadBody?.error||uploadError;}catch(_){}
          throw new Error(`${uploadError} (${file.name})`);
        }
        imageURLs.push(`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`);
      }
      await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(b.id)}`,{
        method:"PATCH",headers:{Authorization:`Bearer ${session.token}`},
        body:JSON.stringify({image_url:imageURLs[0] || null,image_urls:JSON.stringify(imageURLs)})
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
   USER'S OWN BUSINESS ADS: EDIT / DELETE
========================================================= */
function parseListingImages(b){
  let list=[];
  try{ if(Array.isArray(b.image_urls)) list=b.image_urls; else if(b.image_urls) list=JSON.parse(b.image_urls); }catch(_){list=[];}
  if(!Array.isArray(list)) list=[];
  if(b.image_url && !list.includes(b.image_url)) list.unshift(b.image_url);
  return [...new Set(list.filter(x=>typeof x==="string" && x))].slice(0,50);
}

async function loadMyBusinessListings(){
  const box=qs("myBusinessListings"); if(!box)return;
  const session=await verifyAuthSession();
  if(!session){box.innerHTML="<p>Tanpri konekte pou wè anons ou yo.</p>";return;}
  box.innerHTML="<p>⏳ Anons ou yo ap chaje...</p>";
  try{
    const rows=await api(`/rest/v1/businesses?user_id=eq.${encodeURIComponent(session.user.id)}&select=*&order=created_at.desc`);
    if(!rows?.length){box.innerHTML="<p>Ou poko kreye okenn anons. <a href='kreye-anons.html'>Kreye premye anons ou</a>.</p>";return;}
    box.innerHTML=rows.map(b=>{
      const images=parseListingImages(b);
      return `<article class="card" style="margin:14px 0;padding:16px;border:1px solid #dbe3ef">
        <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">${b.image_url?`<img src="${attr(b.image_url)}" alt="" style="width:110px;height:90px;object-fit:cover;border-radius:8px">`:''}<div style="flex:1;min-width:180px"><h3>${esc(b.business_name||'Anons')}</h3><p>${esc(b.location||'')}</p><p><strong>Estati:</strong> ${esc(b.status||'pending')} · ${images.length} imaj</p><p>${esc((b.description||'').slice(0,180))}</p></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button type="button" onclick="editMyBusiness('${attr(b.id)}')">✏️ Modifye</button><button type="button" style="background:#c62828;color:white" onclick="deleteMyBusiness('${attr(b.id)}')">🗑️ Efase</button></div>
        <div id="editListing-${attr(b.id)}" style="display:none;margin-top:14px"></div></article>`;
    }).join('');
  }catch(err){console.error(err);box.innerHTML=`<p>❌ Nou pa kapab chaje anons ou yo: ${esc(err.message)}</p>`;}
}

window.editMyBusiness=async function(id){
  const session=await verifyAuthSession();if(!session)return;
  const rows=await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
  const b=rows?.[0];if(!b){alert("Nou pa jwenn anons sa a nan kont ou.");return;}
  const box=qs(`editListing-${id}`);if(!box)return;
  const catParts=String(b.category||'business:other').split(':');
  const images=parseListingImages(b);
  box.style.display='block';
  box.innerHTML=`<form onsubmit="saveMyBusiness(event,'${attr(id)}')" style="display:grid;gap:9px">
    <label>Non anons la<input name="business_name" required value="${attr(b.business_name||'')}"></label>
    <label>Kategori<input name="category" required value="${attr(catParts.slice(1).join(':')||catParts[0])}"></label>
    <label>Lokalizasyon<input name="location" required value="${attr(b.location||'')}"></label>
    <label>Telefòn<input name="phone" value="${attr(b.phone||'')}"></label>
    <label>WhatsApp<input name="whatsapp" value="${attr(b.whatsapp||'')}"></label>
    <label>Pri / Tarif<input name="price" value="${attr(b.price||'')}"></label>
    <label>Deskripsyon<textarea name="description" required rows="4">${esc(b.description||'')}</textarea></label>
    <p>Foto aktyèl: ${images.length}. Chwazi nouvo foto si ou vle ranplase yo (jiska 50, 5MB chak).</p>
    <input name="images" type="file" accept="image/*" multiple>
    <button type="submit">💾 Sove chanjman yo (Admin ap revize anons la)</button>
    <button type="button" onclick="document.getElementById('editListing-${attr(id)}').style.display='none'">Anile</button>
  </form>`;
};

window.saveMyBusiness=async function(e,id){
  e.preventDefault();const form=e.currentTarget;const session=await verifyAuthSession();if(!session)return;
  const rows=await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
  const old=rows?.[0];if(!old){alert("Ou pa gen dwa modifye anons sa a.");return;}
  const files=Array.from(form.elements.images.files||[]);
  if(files.length>50){alert("Ou ka mete jiska 50 imaj.");return;}
  const bad=files.find(f=>!f.type.startsWith('image/')||f.size>5*1024*1024);if(bad){alert(`Chak imaj dwe pi piti pase 5MB: ${bad.name}`);return;}
  const vals={business_name:form.elements.business_name.value.trim(),category:`${String(old.category||'business').split(':')[0]}:${form.elements.category.value.trim()}`,location:form.elements.location.value.trim(),phone:form.elements.phone.value.trim()||null,whatsapp:form.elements.whatsapp.value.trim()||null,price:form.elements.price.value.trim()||null,description:form.elements.description.value.trim(),status:'pending'};
  try{
    if(files.length){const urls=[];for(let i=0;i<files.length;i++){const f=files[i];const ext=(f.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';const path=`${id}/${Date.now()}-${i}.${ext}`;const up=await fetch(`${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${path}`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.token}`,'Content-Type':f.type,'x-upsert':'true'},body:f});if(!up.ok)throw new Error(`Foto ${f.name} pa t kapab monte.`);urls.push(`${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`);}vals.image_url=urls[0]||null;vals.image_urls=JSON.stringify(urls);}
    await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}`,{method:'PATCH',headers:{Authorization:`Bearer ${session.token}`},body:JSON.stringify(vals)});
    alert('Anons la modifye. Li retounen nan atant pou Admin valide li.');await loadMyBusinessListings();
  }catch(err){console.error(err);alert('Erè: '+err.message);}
};

window.deleteMyBusiness=async function(id){
  if(!confirm('Èske ou sèten ou vle efase anons sa a? Aksyon sa a pa ka defèt.'))return;
  const session=await verifyAuthSession();if(!session)return;
  try{await api(`/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(session.user.id)}`,{method:'DELETE',headers:{Authorization:`Bearer ${session.token}`}});await loadMyBusinessListings();alert('Anons la efase.');}
  catch(err){console.error(err);alert('Nou pa kapab efase anons la: '+err.message);}
};

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
      await api(
        "/rest/v1/businesses?status=eq.approved&select=*&order=created_at.desc"
      );


    window.__businessRows=
      Array.isArray(rows)
        ? rows
        : [];


    renderBusinesses();


  }catch(err){

    console.error(err);


    box.innerHTML=
      "<div class='empty-state'><span>⚠️</span><p>Nou pa kapab chaje anons yo.</p></div>";

  }

}


function businessType(category){

  const raw=
    String(category || "");


  const parts=
    raw.split(":");


  return parts.length>1
    ? parts[0]
    : "";

}


function businessCategory(category){

  const raw=
    String(category || "");


  const parts=
    raw.split(":");


  return parts.length>1
    ? parts.slice(1).join(":")
    : raw;

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


  const location=
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


  if(location){

    const terms=[location];


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


  const count=
    qs("marketResultCount");


  if(count){

    count.textContent=
      `${rows.length} anons disponib`;

  }


  if(!rows.length){

    const currentLang =
      (
        window.EagleJLanguage &&
        window.EagleJLanguage.getLanguage
      )
        ? window.EagleJLanguage.getLanguage()
        : "en";


    const emptyCopy = {

      ht:[
        "Pa gen rezilta",
        "Eseye chanje rechèch ou oswa filtre a."
      ],

      en:[
        "No results",
        "Try changing your search or filter."
      ],

      fr:[
        "Aucun résultat",
        "Essayez de modifier votre recherche ou votre filtre."
      ]

    };


    const ec=
      emptyCopy[currentLang] ||
      emptyCopy.en;


    box.innerHTML=
      `<div class='empty-state'><span>🔎</span><h3>${ec[0]}</h3><p>${ec[1]}</p></div>`;

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
          class="business-card card"
          onclick="openBusinessAd('${attr(b.id)}')"
          role="button"
          tabindex="0"

          onkeydown="
            if(event.key==='Enter'||event.key===' '){
              event.preventDefault();
              openBusinessAd('${attr(b.id)}')
            }
          "
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

            </div>


            <div class="view-link">
              Wè detay →
            </div>

          </div>

        </article>

      `;

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

    const rows=
      await api(
        `/rest/v1/businesses?id=eq.${encodeURIComponent(id)}&status=eq.approved&select=*`
      );


    const b=
      rows?.[0];


    if(!b){

      box.innerHTML=
        "<p class='notice'>❌ Anons sa pa egziste oswa li pa disponib.</p>";

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
        b.image_url

          ? `

            <img
              class="business-detail-image"
              src="${attr(
                b.image_url
              )}"
              alt="${attr(
                b.business_name
              )}"
            >

          `

          : `

            <div class="business-detail-placeholder">
              🏢
            </div>

          `
      }


      ${parseListingImages(b).length>1 ? `<div class="business-image-gallery" style="display:flex;gap:10px;overflow-x:auto;margin:12px 0">${parseListingImages(b).map((url,i)=>`<img src="${attr(url)}" alt="${attr(b.business_name)} - foto ${i+1}" loading="lazy" style="width:150px;height:120px;object-fit:cover;border-radius:8px;flex:0 0 auto">`).join('')}</div>` : ''}

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

    [
      "stat-jobs",
      "jobs"
    ],

    [
      "stat-business",
      "businesses"
    ],

    [
      "stat-users",
      "profiles"
    ]

  ];


  for(
    const [id,table]
    of ids
  ){

    try{

      const r=
        await fetch(
          `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`,
          {
            headers:{

              "apikey":
                SUPABASE_KEY,

              "Range":
                "0-0",

              "Prefer":
                "count=exact"

            }
          }
        );


      const range=
        r.headers.get(
          "content-range"
        );


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
      qs("stat-business")
        ?.textContent ||
      "0";

  }

}


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

    const rows=
      await api(
        "/rest/v1/profiles?select=id,full_name,account_type&order=full_name.asc&limit=100"
      );


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
            u.full_name ||
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
                  u.full_name ||
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


  const label =
    map[type] ||
    "Manm Eagle-J Connect";

  return window.EJC?.t
    ? window.EJC.t(label)
    : label;

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

    qs("saveProfilePhoto")?.addEventListener("click", saveProfilePhoto);


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

/* Eagle-J Connect - Supabase application */

const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
const IMAGE_BUCKET="business-images";

function qs(id){
return document.getElementById(id);
}

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

return token && id ? {
token,
user:{id,email}
} : null;
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
].forEach(k=>localStorage.removeItem(k));
}

window.logoutUser=()=>{
clearSession();
location.href="login.html";
};

window.toggleMenu=()=>{
const m=qs("menu");
if(m)m.classList.toggle("show");
};

document.addEventListener("click",e=>{
if(e.target.closest("#menu a") && qs("menu")){
qs("menu").classList.remove("show");
}
});

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

function esc(v){
const d=document.createElement("div");
d.textContent=v ?? "";
return d.innerHTML;
}

function attr(v){
return String(v ?? "")
.replace(/&/g,"&")
.replace(/"/g,""")
.replace(/</g,"<")
.replace(/>/g,">");
}

function waNumber(v){
return String(v || "").replace(/\D/g,"");
}

function fmtDate(v){
try{
return new Date(v).toLocaleDateString();
}catch(e){
return "";
}
}

async function api(path,options={}){
const headers=Object.assign(
{
"apikey":SUPABASE_KEY,
"Content-Type":"application/json"
},
options.headers || {}
);

const session=getSession();

if(session?.token && !headers.Authorization){
headers.Authorization="Bearer ${session.token}";
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
data=text ? JSON.parse(text) : null;
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
      Authorization:"Bearer "+SUPABASE_KEY
    },
    body:JSON.stringify({
      email,
      password,
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
  ()=>location.href="login.html",
  1200
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
      Authorization:"Bearer "+SUPABASE_KEY
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
  throw new Error("Pwofil ou pa jwenn.");
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
  qs("employerActions")?.classList.remove("hidden");
}else{
  qs("jobSeekerActions")?.classList.remove("hidden");
}

card.style.display="block";

}catch(err){

error.textContent=
  "❌ "+err.message;

error.style.display="block";

}
}

/* =========================================================
EMPLOYER
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

if(!p || p.account_type!=="employer"){
  location.href="dashboard.html";
  return;
}

qs("employerName") &&
  (qs("employerName").textContent=
    p.full_name || "Anplwayè");

qs("profileName") &&
  (qs("profileName").textContent=
    p.full_name || "—");

qs("profileEmail") &&
  (qs("profileEmail").textContent=
    session.user.email || "—");

qs("profilePhone") &&
  (qs("profilePhone").textContent=
    p.phone || "—");

await loadMyJobs(
  session.user.id,
  session.token
);

}catch(err){

console.error(err);

qs("employerMessage") &&
  (qs("employerMessage").textContent=
    "❌ "+err.message);

}
}

async function postJob(e){

e.preventDefault();

const s=getSession();

if(!s){
location.href="login.html";
return;
}

const vals={
title:qs("jobTitle").value.trim(),
company_name:qs("jobCompany").value.trim(),
location:qs("jobLocation").value.trim(),
job_type:qs("jobType").value,
salary:qs("jobSalary").value.trim() || null,
description:qs("jobDescription").value.trim(),
contact_phone:qs("jobContact").value.trim()
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
      Authorization:`Bearer ${s.token}`,
      Prefer:"return=representation"
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
      Authorization:`Bearer ${token}`
    }
  }
);

if(!jobs?.length){

  box.innerHTML=
    "<p>Ou poko poste okenn travay.</p>";

  return;
}

box.innerHTML=jobs.map(
  j=>`
  <article class="card job-card">

    <h3>${esc(j.title)}</h3>

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

    ${j.salary
      ? `<p>💰 ${esc(j.salary)}</p>`
      : ""
    }

    <p>${esc(j.description)}</p>

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

box.innerHTML=list.map(
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
        ? `<p>💰 <strong>${esc(j.salary)}</strong></p>`
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
              href="https://wa.me/${wa}?text=${encodeURIComponent(
                "Bonjou, mwen enterese nan travay: "+j.title
              )}"
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
BUSINESS ADS
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
!values.location ||
!values.description
){

msg(
  "formMessage",
  "⚠️ Tanpri ranpli tout chan obligatwa yo."
);

return;

}

if(
file &&
(
!file.type.startsWith("image/") ||
file.size>510241024
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
      ...values,
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

        "Content-Type":file.type
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

box.innerHTML=
"<p>⏳ Anons yo ap chaje...</p>";

try{

const rows=await api(
  "/rest/v1/businesses?select=*&order=created_at.desc"
);

if(!rows?.length){

  box.innerHTML=
    "<p>Pa gen anons biznis pou kounye a.</p>";

  return;
}

box.innerHTML=rows.map(
  b=>{

    const wa=
      waNumber(b.whatsapp);

    const phone=
      attr(b.phone);

    /*
      IMPORTANT:
      Tout kat anons lan gen onclick.
      Lè moun klike sou kat la,
      li ale sou anons.html ak ID anons lan.
    */

    return `
    <article
      class="card business-card"
      onclick="openBusinessAd('${attr(b.id)}')"
      style="cursor:pointer"
      role="button"
      tabindex="0"
      onkeydown="if(event.key==='Enter'||event.key===' '){openBusinessAd('${attr(b.id)}')}"
    >

      ${
        b.image_url
          ? `
            <img
              src="${attr(b.image_url)}"
              alt="${attr(b.business_name)}"
            >
          `
          : `
            <div
              style="
                padding:35px 10px;
                text-align:center;
                font-size:45px;
                background:#f5f8fc;
              "
            >
              🏢
            </div>
          `
      }

      <h3>
        ${esc(b.business_name)}
      </h3>

      <p>
        📂 ${esc(b.category)}
      </p>

      <p>
        📍 ${esc(b.location)}
      </p>

      ${
        b.price
          ? `
            <p>
              💰 ${esc(b.price)}
            </p>
          `
          : ""
      }

      <p>
        ${esc(b.description)}
      </p>

      <div
        class="actions"
        onclick="event.stopPropagation()"
      >

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

      <div
        style="
          margin-top:12px;
          font-size:14px;
          color:#003366;
          font-weight:bold;
        "
      >
        👆 Klike pou wè detay
      </div>

    </article>
    `;
  }
).join("");

}catch(err){

console.error(err);

box.innerHTML=
  "<p>❌ Nou pa kapab chaje anons yo.</p>";

}
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
"anons.html?id=${encodeURIComponent(id)}";
};

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

const reg=qs("registerForm");

if(reg){
  reg.addEventListener(
    "submit",
    registerUser
  );
}

const login=qs("loginForm");

if(login){
  login.addEventListener(
    "submit",
    loginUser
  );
}

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

if(qs("businessListings")){
  loadBusinesses();
}

if(qs("businessForm")){

  qs("businessForm").addEventListener(
    "submit",
    submitBusiness
  );
}

if(qs("dashboardLoading")){
  loadDashboard();
}

if(qs("employerName")){
  loadEmployerDashboard();
}

if(qs("jobForm")){

  qs("jobForm").addEventListener(
    "submit",
    postJob
  );
}

if(qs("myJobs")){

  const s=getSession();

  if(s){
    loadMyJobs(
      s.user.id,
      s.token
    );
  }
}

if(qs("stats")){
  loadStats();
}

initContact();

}
);
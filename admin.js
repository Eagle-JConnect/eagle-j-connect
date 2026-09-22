/* Eagle-J Connect v7 — Admin moderation dashboard */
(function(){
  const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  let users=[], jobs=[], businesses=[];

  const $=id=>document.getElementById(id);
  const esc=v=>{const d=document.createElement("div");d.textContent=v??"";return d.innerHTML;};

  function session(){
    const token=localStorage.getItem("supabase_access_token");
    const raw=localStorage.getItem("supabase_user");
    if(!token||!raw)return null;
    try{return {token,user:JSON.parse(raw)};}catch(e){return null;}
  }

  function message(text,type="error"){
    const el=$("adminMessage");
    if(!el)return;
    el.textContent=text;
    el.className="notice-admin "+type;
    el.classList.remove("hidden");
  }

  async function api(path,options={}){
    const s=session();
    const headers={apikey:SUPABASE_KEY,"Content-Type":"application/json",...(options.headers||{})};
    if(s?.token)headers.Authorization=`Bearer ${s.token}`;
    const r=await fetch(SUPABASE_URL+path,{...options,headers});
    const text=await r.text();
    let data=null; try{data=text?JSON.parse(text):null;}catch(e){data=text;}
    if(!r.ok)throw new Error(data?.message||data?.msg||data?.error_description||`Request failed (${r.status})`);
    return data;
  }

  function statusLabel(status){
    return ({
      pending:"⏳ Pending",
      approved:"✅ Piblik",
      rejected:"❌ Refize",
      unavailable:"🚫 Pa disponib",
      active:"✅ Aktif",
      disabled:"🚫 Dezaktive"
    })[status] || status || "—";
  }

  async function checkAdmin(){
    const s=session();
    if(!s){location.href="login.html";return false;}
    try{
      const rows=await api(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(s.user.id)}&select=user_id`);
      if(!Array.isArray(rows)||!rows.length)throw new Error("Kont sa a pa gen dwa administratè.");
      $("adminApp")?.classList.remove("hidden");
      await Promise.all([loadAdminUsers(),loadAdminJobs(),loadAdminBusinesses()]);
      return true;
    }catch(e){
      message("❌ Aksè refize: "+e.message,"error");
      return false;
    }
  }

  window.loadAdminUsers=async function(){
    const body=$("adminUsersBody");
    if(body)body.innerHTML='<tr><td colspan="6">⏳ Nap chaje itilizatè yo...</td></tr>';
    try{
      users=await api('/rest/v1/profiles?select=id,full_name,email,phone,account_type,account_status&order=full_name.asc');
      if(!Array.isArray(users))users=[];
      renderUsers();
    }catch(e){
      if(body)body.innerHTML=`<tr><td colspan="6">❌ ${esc(e.message)}</td></tr>`;
      message("❌ Nou pa kapab chaje itilizatè yo. Verifye admin RLS la.","error");
    }
  };

  function renderUsers(){
    const q=($("adminUserSearch")?.value||"").toLowerCase().trim();
    const type=$("adminTypeFilter")?.value||"";
    const accountStatus=$("adminAccountStatusFilter")?.value||"";
    const filtered=users.filter(u=>{
      const hay=[u.full_name,u.phone,u.id,u.email].join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!type||u.account_type===type)&&(!accountStatus||u.account_status===accountStatus);
    });

    $("adminUserCount").textContent=users.length;
    $("adminDisabledUserCount").textContent=users.filter(u=>u.account_status==="disabled").length;

    const body=$("adminUsersBody");
    if(!body)return;
    if(!filtered.length){body.innerHTML='<tr><td colspan="6">Pa gen itilizatè ki koresponn.</td></tr>';return;}

    body.innerHTML=filtered.map(u=>{
      const self=session()?.user?.id===u.id;
      const disabled=u.account_status==="disabled";
      return `<tr>
        <td>${esc(u.full_name||"—")}</td>
        <td class="email-cell">${esc(u.email||"—")}</td>
        <td>${esc(u.phone||"—")}</td>
        <td>${esc(u.account_type||"—")}</td>
        <td>${esc(statusLabel(u.account_status||"active"))}</td>
        <td>
          ${self
            ? `<span class="admin-muted">Kont pa ou</span>`
            : `<button class="save-btn" type="button" onclick="setUserStatus('${esc(u.id)}','${disabled?"active":"disabled"}')">${disabled?"🔓 Aktive":"🚫 Dezaktive"}</button>
               <button class="danger-btn" type="button" onclick="removeUser('${esc(u.id)}')">🗑️ Retire</button>`}
        </td>
      </tr>`;
    }).join("");
  }

  window.setUserStatus=async function(id,status){
    try{
      await api(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,{
        method:"PATCH",
        headers:{Prefer:"return=minimal"},
        body:JSON.stringify({account_status:status})
      });
      message(status==="disabled"?"🚫 Kont lan dezaktive.":"✅ Kont lan aktive ankò.","success");
      await loadAdminUsers();
    }catch(e){message("❌ "+e.message,"error");}
  };

  window.removeUser=async function(id){
    const s=session();
    if(!s||s.user.id===id)return;
    if(!confirm("Retire pwofil itilizatè sa a? Li pap kapab konekte atravè sit la apre sa. Sa pa efase Auth user la nan Supabase."))return;
    try{
      await api(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
      message("🗑️ Pwofil itilizatè a retire.","success");
      await loadAdminUsers();
    }catch(e){message("❌ Pa kapab retire itilizatè a: "+e.message,"error");}
  };

  function jobMatches(job){
    const q=($("adminJobSearch")?.value||"").toLowerCase().trim();
    return !q||[job.title,job.company,job.location,job.description].filter(Boolean).join(" ").toLowerCase().includes(q);
  }

  window.loadAdminJobs=async function(){
    const body=$("adminJobsBody");
    if(body)body.innerHTML='<tr><td colspan="6">⏳ Nap chaje travay yo...</td></tr>';
    try{
      const status=$("adminJobStatusFilter")?.value||"";
      const filter=status?`&status=eq.${encodeURIComponent(status)}`:"";
      jobs=await api(`/rest/v1/jobs?select=*&order=created_at.desc${filter}`);
      jobs=Array.isArray(jobs)?jobs:[];
      renderJobs();
      $("adminPendingJobCount").textContent=jobs.filter(j=>j.status==="pending").length;
      $("adminActiveJobCount").textContent=jobs.filter(j=>j.status==="approved").length;
    }catch(e){
      if(body)body.innerHTML=`<tr><td colspan="6">❌ ${esc(e.message)}</td></tr>`;
      message("❌ Nou pa kapab chaje travay yo: "+e.message,"error");
    }
  };

  function renderJobs(){
    const body=$("adminJobsBody");if(!body)return;
    const rows=jobs.filter(jobMatches);
    if(!rows.length){body.innerHTML='<tr><td colspan="6">Pa gen travay nan kategori sa a.</td></tr>';return;}
    body.innerHTML=rows.map(j=>`
      <tr>
        <td><strong>${esc(j.title||"Travay")}</strong><br><small>${esc(j.description||"")}</small></td>
        <td>${esc(j.company||j.company_name||"—")}</td>
        <td>${esc(j.location||"—")}</td>
        <td>${esc(statusLabel(j.status))}</td>
        <td>${esc(j.created_at?new Date(j.created_at).toLocaleDateString():"—")}</td>
        <td>${moderationButtons("job",j.id,j.status)}</td>
      </tr>`).join("");
  }

  function businessMatches(b){
    const q=($("adminBusinessSearch")?.value||"").toLowerCase().trim();
    return !q||[b.business_name,b.category,b.location,b.description].filter(Boolean).join(" ").toLowerCase().includes(q);
  }

  window.loadAdminBusinesses=async function(){
    const body=$("adminBusinessesBody");
    if(body)body.innerHTML='<tr><td colspan="6">⏳ Nap chaje anons yo...</td></tr>';
    try{
      const status=$("adminBusinessStatusFilter")?.value||"";
      const filter=status?`&status=eq.${encodeURIComponent(status)}`:"";
      businesses=await api(`/rest/v1/businesses?select=*&order=created_at.desc${filter}`);
      businesses=Array.isArray(businesses)?businesses:[];
      renderBusinesses();
      $("adminPendingBusinessCount").textContent=businesses.filter(b=>b.status==="pending").length;
      $("adminActiveBusinessCount").textContent=businesses.filter(b=>b.status==="approved").length;
    }catch(e){
      if(body)body.innerHTML=`<tr><td colspan="6">❌ ${esc(e.message)}</td></tr>`;
      message("❌ Nou pa kapab chaje anons yo: "+e.message,"error");
    }
  };

  function renderBusinesses(){
    const body=$("adminBusinessesBody");if(!body)return;
    const rows=businesses.filter(businessMatches);
    if(!rows.length){body.innerHTML='<tr><td colspan="6">Pa gen anons nan kategori sa a.</td></tr>';return;}
    body.innerHTML=rows.map(b=>`
      <tr>
        <td><strong>${esc(b.business_name||"Anons")}</strong><br><small>${esc(b.description||"")}</small></td>
        <td>${esc(b.category||"—")}</td>
        <td>${esc(b.location||"—")}</td>
        <td>${esc(statusLabel(b.status))}</td>
        <td>${esc(b.created_at?new Date(b.created_at).toLocaleDateString():"—")}</td>
        <td>${moderationButtons("business",b.id,b.status)}</td>
      </tr>`).join("");
  }

  function moderationButtons(kind,id,status){
    const prefix=kind==="job"?"Job":"Business";
    return `<div class="admin-button-group">
      ${status!=="approved"?`<button class="save-btn" type="button" onclick="moderate('${kind}','${esc(id)}','approved')">✅ Valide</button>`:""}
      ${status!=="rejected"?`<button class="danger-outline" type="button" onclick="moderate('${kind}','${esc(id)}','rejected')">❌ Refize</button>`:""}
      ${status!=="unavailable"?`<button class="warning-btn" type="button" onclick="moderate('${kind}','${esc(id)}','unavailable')">🚫 Pa disponib</button>`:""}
      <button class="danger-btn" type="button" onclick="deleteListing('${kind}','${esc(id)}')">🗑️ Efase</button>
    </div>`;
  }

  window.moderate=async function(kind,id,status){
    try{
      const table=kind==="job"?"jobs":"businesses";
      await api(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,{
        method:"PATCH",
        headers:{Prefer:"return=minimal"},
        body:JSON.stringify({status})
      });
      message(`✅ ${kind==="job"?"Travay la":"Anons la"} mete kòm ${statusLabel(status)}.`,"success");
      await Promise.all([loadAdminJobs(),loadAdminBusinesses()]);
    }catch(e){message("❌ Pa kapab chanje status la: "+e.message,"error");}
  };

  window.deleteListing=async function(kind,id){
    if(!confirm("Efase anons sa a nèt nan baz done a?"))return;
    try{
      const table=kind==="job"?"jobs":"businesses";
      await api(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,{method:"DELETE"});
      message("🗑️ Anons la efase.","success");
      await Promise.all([loadAdminJobs(),loadAdminBusinesses()]);
    }catch(e){message("❌ Pa kapab efase anons la: "+e.message,"error");}
  };

  document.addEventListener("DOMContentLoaded",()=>{
    $("adminUserSearch")?.addEventListener("input",renderUsers);
    $("adminTypeFilter")?.addEventListener("change",renderUsers);
    $("adminAccountStatusFilter")?.addEventListener("change",renderUsers);
    $("adminJobSearch")?.addEventListener("input",renderJobs);
    $("adminJobStatusFilter")?.addEventListener("change",loadAdminJobs);
    $("adminBusinessSearch")?.addEventListener("input",renderBusinesses);
    $("adminBusinessStatusFilter")?.addEventListener("change",loadAdminBusinesses);
    checkAdmin();
  });
})();

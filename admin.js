/* Eagle-J Connect - secure admin dashboard client */
(function(){
  const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  let users=[];

  const $=id=>document.getElementById(id);
  const session=()=>{
    const token=localStorage.getItem("supabase_access_token");
    const raw=localStorage.getItem("supabase_user");
    if(!token||!raw)return null;
    try{return {token,user:JSON.parse(raw)};}catch(e){return null;}
  };
  const esc=v=>{const d=document.createElement("div");d.textContent=v??"";return d.innerHTML;};
  function message(text,type="error"){
    const el=$("adminMessage"); if(!el)return;
    el.textContent=text; el.className="notice-admin "+type; el.classList.remove("hidden");
  }
  async function api(path,options={}){
    const s=session();
    const headers={apikey:SUPABASE_KEY,"Content-Type":"application/json",...(options.headers||{})};
    if(s?.token) headers.Authorization=`Bearer ${s.token}`;
    const r=await fetch(SUPABASE_URL+path,{...options,headers});
    const text=await r.text(); let data=null; try{data=text?JSON.parse(text):null;}catch(e){data=text;}
    if(!r.ok) throw new Error(data?.message||data?.msg||data?.error_description||`Request failed (${r.status})`);
    return data;
  }

  async function checkAdmin(){
    const s=session();
    if(!s){ location.href="login.html"; return false; }
    try{
      // This endpoint must be protected by the SQL policies/function supplied with this release.
      const rows=await api(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(s.user.id)}&select=user_id`);
      if(!Array.isArray(rows)||!rows.length) throw new Error("Kont sa a pa gen dwa administratè.");
      $("adminApp")?.classList.remove("hidden");
      await loadAdminUsers();
      return true;
    }catch(e){
      message("❌ Aksè refize: "+e.message,"error");
      return false;
    }
  }

  window.loadAdminUsers=async function(){
    const body=$("adminUsersBody"); if(body) body.innerHTML='<tr><td colspan="6">⏳ Nap chaje itilizatè yo...</td></tr>';
    try{
      users=await api('/rest/v1/profiles?select=id,full_name,phone,account_type&order=full_name.asc');
      if(!Array.isArray(users))users=[];
      render();
    }catch(e){
      if(body)body.innerHTML=`<tr><td colspan="6">❌ ${esc(e.message)}</td></tr>`;
      message("❌ Nou pa kapab chaje itilizatè yo. Verifye RLS/admin SQL la.","error");
    }
  };

  function render(){
    const q=($("adminUserSearch")?.value||"").toLowerCase().trim();
    const type=$("adminTypeFilter")?.value||"";
    const filtered=users.filter(u=>{
      const hay=[u.full_name,u.phone,u.id].join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!type||u.account_type===type);
    });
    $("adminUserCount").textContent=users.length;
    $("adminEmployerCount").textContent=users.filter(u=>u.account_type==="employer").length;
    $("adminJobSeekerCount").textContent=users.filter(u=>u.account_type==="job_seeker").length;
    const body=$("adminUsersBody");
    if(!body)return;
    if(!filtered.length){body.innerHTML='<tr><td colspan="6">Pa gen itilizatè ki koresponn.</td></tr>';return;}
    body.innerHTML=filtered.map(u=>row(u)).join("");
  }

  function row(u){
    const role=u.account_type||"job_seeker";
    return `<tr id="user-row-${esc(u.id)}">
      <td>${esc(u.full_name||"—")}</td><td class="email-cell">—</td><td>${esc(u.phone||"—")}</td>
      <td>${esc(role)}</td><td><small>${esc(u.id)}</small></td>
      <td><button class="edit-btn" type="button" onclick="editAdminUser('${esc(u.id)}')">✏️ Modifye</button></td>
    </tr>`;
  }

  window.editAdminUser=function(id){
    const u=users.find(x=>x.id===id); if(!u)return;
    const tr=$("user-row-"+id); if(!tr)return;
    tr.innerHTML=`<td><input id="edit-name-${esc(id)}" value="${String(u.full_name||"").replace(/"/g,'&quot;')}" style="max-width:160px"></td>
      <td class="email-cell">Imèl la soti nan Auth</td>
      <td><input id="edit-phone-${esc(id)}" value="${String(u.phone||"").replace(/"/g,'&quot;')}" style="max-width:130px"></td>
      <td><select id="edit-type-${esc(id)}"><option value="job_seeker" ${u.account_type==='job_seeker'?'selected':''}>job_seeker</option><option value="employer" ${u.account_type==='employer'?'selected':''}>employer</option><option value="admin" ${u.account_type==='admin'?'selected':''}>admin</option></select></td>
      <td><small>${esc(id)}</small></td><td><button class="save-btn" type="button" onclick="saveAdminUser('${esc(id)}')">💾 Sove</button> <button class="cancel-btn" type="button" onclick="render()">Anile</button></td>`;
  };

  window.saveAdminUser=async function(id){
    try{
      const full_name=$("edit-name-"+id).value.trim(); const phone=$("edit-phone-"+id).value.trim(); const account_type=$("edit-type-"+id).value;
      await api(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({full_name,phone,account_type})});
      message("✅ Itilizatè a modifye avèk siksè.","success"); await loadAdminUsers();
    }catch(e){message("❌ Pa kapab modifye itilizatè a: "+e.message,"error");}
  };

  document.addEventListener("DOMContentLoaded",()=>{
    $("adminUserSearch")?.addEventListener("input",render);
    $("adminTypeFilter")?.addEventListener("change",render);
    checkAdmin();
  });
})();

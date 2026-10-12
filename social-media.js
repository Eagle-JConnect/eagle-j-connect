
/* Eagle-J Connect — Social Media Manager */
(function(){
  "use strict";
  const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  const FN=SUPABASE_URL+"/functions/v1/";
  const IMAGE_BUCKET="business-images";
  const $=id=>document.getElementById(id);
  const esc=v=>{const d=document.createElement("div");d.textContent=v??"";return d.innerHTML;};
  function session(){const token=localStorage.getItem("supabase_access_token");const raw=localStorage.getItem("supabase_user");if(!token||!raw)return null;try{return {token,user:JSON.parse(raw)};}catch(e){return null;}}
  function show(text,type="info"){const el=$("socialMessage");if(!el)return;el.textContent=text;el.className="social-message "+type;el.classList.remove("hidden");}
  function apiHeaders(s){return {apikey:SUPABASE_KEY,Authorization:`Bearer ${s.token}`,"Content-Type":"application/json"};}
  async function invoke(name,body){const s=session();if(!s)throw new Error("Ou dwe konekte anvan.");const r=await fetch(FN+name,{method:"POST",headers:apiHeaders(s),body:JSON.stringify(body||{})});const txt=await r.text();let data=null;try{data=txt?JSON.parse(txt):null;}catch(e){data={message:txt};}if(!r.ok)throw new Error(data?.message||data?.error||`Request failed (${r.status})`);return data;}
  async function loadConnections(){const s=session();if(!s)return;try{const r=await fetch(SUPABASE_URL+`/rest/v1/social_connections?user_id=eq.${encodeURIComponent(s.user.id)}&select=id,platform,account_name,status,created_at,updated_at&order=platform.asc`,{headers:apiHeaders(s)});const rows=r.ok?await r.json():[];document.querySelectorAll(".platform-card").forEach(card=>{const p=card.dataset.platform;const row=Array.isArray(rows)?rows.find(x=>x.platform===p&&x.status==="connected"):null;const btn=card.querySelector(".connect-btn");const badge=card.querySelector(".connected-badge");if(row){const l=localStorage.getItem("eagleJConnectLanguage")||localStorage.getItem("selectedLanguage")||"en";const labels={ht:{disconnect:"Dekonekte",connected:"● Konekte"},en:{disconnect:"Disconnect",connected:"● Connected"},fr:{disconnect:"Déconnecter",connected:"● Connecté"}}[l]||{disconnect:"Disconnect",connected:"● Connected"};btn.textContent=labels.disconnect;btn.dataset.action="disconnect";badge.textContent=`${labels.connected}${row.account_name?" — "+row.account_name:""}`;badge.classList.remove("hidden");}else{const l=localStorage.getItem("eagleJConnectLanguage")||localStorage.getItem("selectedLanguage")||"en";btn.textContent=({ht:"Konekte",en:"Connect",fr:"Connecter"}[l]||"Connect");btn.dataset.action="connect";badge.classList.add("hidden");}});}catch(e){show("Nou pa kapab li koneksyon yo. Asire SQL sosyal la enstale.","error");}}
  async function loadPosts(){const s=session();const body=$("postsBody");if(!s||!body)return;try{const r=await fetch(SUPABASE_URL+`/rest/v1/social_posts?user_id=eq.${encodeURIComponent(s.user.id)}&select=id,caption,platforms,status,created_at,published_at&order=created_at.desc&limit=50`,{headers:apiHeaders(s)});const rows=r.ok?await r.json():[];if(!Array.isArray(rows)||!rows.length){body.innerHTML='<tr><td colspan="4">Pa gen piblikasyon toujou.</td></tr>';return;}body.innerHTML=rows.map(x=>`<tr><td>${esc(new Date(x.created_at).toLocaleString())}</td><td>${esc((x.caption||"").slice(0,180))}</td><td>${esc((x.platforms||[]).join(", "))}</td><td class="${x.status==="published"?"status-ok":x.status==="failed"?"status-bad":"status-pending"}">${esc(x.status||"—")}</td></tr>`).join("");}catch(e){body.innerHTML=`<tr><td colspan="4">❌ ${esc(e.message)}</td></tr>`;}}
  async function startOAuth(platform){const s=session();if(!s){location.href="login.html";return;}try{const returnUrl=new URL("social-media.html",location.href).href;const result=await invoke("social-oauth",{action:"start",platform,return_url:returnUrl});if(!result?.authorization_url)throw new Error("OAuth URL pa retounen.");location.href=result.authorization_url;}catch(e){show(e.message,"error");}}
  async function disconnect(platform){try{await invoke("social-oauth",{action:"disconnect",platform});show("Koneksyon "+platform+" dekonekte.","success");await loadConnections();}catch(e){show(e.message,"error");}}
  function setupSocialImagePicker(){
    const type=$("postMediaType"), file=$("postMediaFile"), choose=$("chooseSocialImage"), urlLabel=$("socialVideoUrlLabel"), preview=$("socialImagePreview");
    if(!type||!file||!choose||!preview||type.dataset.pickerReady==="1")return;
    type.dataset.pickerReady="1";
    const sync=()=>{const image=type.value==="image";$("socialImagePickerLabel")?.classList.toggle("hidden",!image);urlLabel?.classList.toggle("hidden",type.value!=="video");};
    type.addEventListener("change",()=>{sync();if(type.value!=="image"){file.value="";preview.replaceChildren();}});
    choose.addEventListener("click",()=>file.click());
    choose.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();file.click();}});
    file.addEventListener("change",()=>{preview.replaceChildren();const f=file.files?.[0];if(!f)return;const allowed=["image/jpeg","image/png","image/webp"];if(!allowed.includes(f.type)||f.size>5*1024*1024){file.value="";show("Chwazi yon imaj JPG, PNG oswa WebP ki pa depase 5MB.","error");return;}const img=document.createElement("img");img.alt="Aperçu imaj pou piblikasyon";img.src=URL.createObjectURL(f);img.onload=()=>URL.revokeObjectURL(img.src);preview.append(img);});
    sync();
  }
  async function uploadSocialImage(file){
    const s=session();if(!s)throw new Error("Ou dwe konekte anvan.");
    const ext=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp"})[file.type];
    const name=`social/${s.user.id}/${Date.now()}.${ext}`;
    const r=await fetch(`${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${name}`,{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${s.token}`,"Content-Type":file.type,"x-upsert":"false"},body:file});
    if(!r.ok){let reason="Nou pa kapab monte imaj la. Verifye Storage bucket business-images ak règleman upload li yo.";try{const d=await r.json();reason=d.message||d.error||reason;}catch(_){}throw new Error(reason);}
    return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${name}`;
  }

  document.addEventListener("DOMContentLoaded",async()=>{
    const s=session();if(!s){$("socialUserStatus").textContent="🔒 Konekte pou itilize Social Media Manager";setTimeout(()=>location.href="login.html",900);return;}
    $("socialUserStatus").textContent="✅ Sesyon aktif";
    document.querySelectorAll("[data-connect]").forEach(btn=>btn.addEventListener("click",()=>{const p=btn.dataset.connect;btn.dataset.action==="disconnect"?disconnect(p):startOAuth(p);}));
    setupSocialImagePicker();
    $("refreshConnections")?.addEventListener("click",loadConnections);
    $("refreshPosts")?.addEventListener("click",loadPosts);
    $("clearPost")?.addEventListener("click",()=>{ $("socialPostForm").reset(); $("socialImagePreview")?.replaceChildren(); $("postMediaType")?.dispatchEvent(new Event("change")); });
    $("socialPostForm")?.addEventListener("submit",async e=>{
      e.preventDefault();
      const caption=$("postCaption").value.trim();
      const mediaType=$("postMediaType").value;
      const selectedFile=$("postMediaFile")?.files?.[0]||null;
      let media_url=$("postMediaUrl")?.value.trim()||"";
      const platforms=[...document.querySelectorAll('#publishPlatforms input:checked')].map(x=>x.value);
      if(!caption&&!selectedFile&&!media_url){show("Mete yon caption oswa yon medya.","error");return;}
      if(!platforms.length){show("Chwazi omwen yon platfòm.","error");return;}
      if(mediaType==="image"&&!selectedFile){show("Chwazi fichye imaj la anvan ou pibliye.","error");return;}
      if(mediaType==="video"&&!media_url){show("Mete URL videyo piblik la.","error");return;}
      if(platforms.includes("youtube")&&mediaType!=="video"){show("Pou YouTube, chwazi Videyo epi mete URL videyo piblik la.","error");return;}
      const b=$("publishBtn");b.disabled=true;b.textContent="⏳ Nap prepare piblikasyon an...";
      try{
        if(mediaType==="image"&&selectedFile) media_url=await uploadSocialImage(selectedFile);
        const result=await invoke("social-publish",{caption,media_url:media_url||null,media_type:mediaType,platforms});
        show(result.message||"Piblikasyon fini.",result.failed?.length?"info":"success");
        if(result.results?.whatsapp?.share_url)window.open(result.results.whatsapp.share_url,"_blank","noopener");
        await loadPosts();
      }catch(err){show(err.message,"error");}
      finally{b.disabled=false;b.textContent="🚀 Pibliye";}
    });
    document.addEventListener("languageChanged",()=>loadConnections());
    await Promise.all([loadConnections(),loadPosts()]);
  });
})();

/* =========================================================
   EAGLE-J CONNECT — SOCIAL MEDIA MANAGER
   Safe frontend shell. No provider secret is stored here.
   ========================================================= */
(function(){
  "use strict";

  const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  const PROVIDERS = ["facebook","instagram","tiktok","youtube","whatsapp"];

  function token(){ return localStorage.getItem("supabase_access_token") || ""; }
  function userId(){ return localStorage.getItem("supabase_user_id") || ""; }

  function message(text,type="info"){
    const el=document.getElementById("socialMessage");
    if(!el)return;
    el.textContent=text;
    el.className="social-message show "+type;
  }

  async function isAdmin(){
    const uid=userId(), t=token();
    if(!uid || !t) return false;
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(uid)}&select=user_id&limit=1`,{
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${t}`}
      });
      if(!r.ok)return false;
      const rows=await r.json();
      return Array.isArray(rows)&&rows.length>0;
    }catch(e){ return false; }
  }

  async function guard(){
    const ok=await isAdmin();
    if(!ok){
      message("Aksè Social Media Manager la rezève pou administratè a pou kounye a.","warn");
      document.querySelectorAll("[data-connect],[data-test],#socialPostForm").forEach(el=>{
        if(el.tagName==="FORM") el.querySelectorAll("button,input,textarea,select").forEach(x=>x.disabled=true);
        else el.disabled=true;
      });
    }
  }

  function providerName(p){
    return p.charAt(0).toUpperCase()+p.slice(1);
  }

  document.querySelectorAll("[data-connect]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const p=btn.dataset.connect;
      if(!PROVIDERS.includes(p))return;
      message(`${providerName(p)} OAuth pa aktive nan premye etap sa a. Nou bezwen mete App ID/Client ID ak redirect URI provider la nan backend Supabase anvan bouton Connect la ka otorize kont lan.`,"warn");
    });
  });

  document.querySelectorAll("[data-test]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const p=btn.dataset.test;
      message(`${providerName(p)} module loaded successfully. API connection still needs provider credentials + OAuth backend configuration.`,"info");
    });
  });

  const form=document.getElementById("socialPostForm");
  if(form){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const title=document.getElementById("socialTitle").value.trim();
      const caption=document.getElementById("socialCaption").value.trim();
      const platforms=[...document.querySelectorAll('input[name="platform"]:checked')].map(x=>x.value);
      if(!caption){message("Ekri caption la anvan ou prepare post la.","warn");return;}
      if(!platforms.length){message("Chwazi omwen yon platform.","warn");return;}
      const payload={title,caption,platforms,created_at:new Date().toISOString()};
      localStorage.setItem("eagleJ_social_draft",JSON.stringify(payload));
      message("Post la pare kòm draft. Publishing ap aktive lè OAuth backend provider yo konfigire.","info");
    });
  }

  guard();
})();

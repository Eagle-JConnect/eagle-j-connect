/* Eagle-J Connect — final navigation controller */
(function(){
  const SUPABASE_URL="https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY="sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";

  function getSession(){
    const token=localStorage.getItem("supabase_access_token");
    const raw=localStorage.getItem("supabase_user");
    if(!token||!raw)return null;
    try{return {token,user:JSON.parse(raw)};}catch(e){return null;}
  }

  function closeMenu(){
    const menu=document.getElementById("menu");
    const button=document.getElementById("menuToggle");
    if(menu)menu.classList.remove("show");
    if(button)button.setAttribute("aria-expanded","false");
  }

  function initMenu(){
    const menu=document.getElementById("menu");
    const button=document.getElementById("menuToggle");
    if(!menu||!button||button.dataset.menuReady==="1")return;
    button.dataset.menuReady="1";
    button.addEventListener("click",e=>{
      e.preventDefault(); e.stopPropagation();
      const open=!menu.classList.contains("show");
      menu.classList.toggle("show",open);
      button.setAttribute("aria-expanded",open?"true":"false");
    });
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
      if(a.id!=="logoutBtn")closeMenu();
    }));
    document.addEventListener("click",e=>{
      if(!menu.classList.contains("show"))return;
      if(!menu.contains(e.target)&&!button.contains(e.target))closeMenu();
    });
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
  }

  function syncAuthNav(){
    const logged=!!getSession();
    document.querySelectorAll('[data-auth="guest"]').forEach(el=>el.hidden=logged);
    document.querySelectorAll('[data-auth="user"]').forEach(el=>el.hidden=!logged);
    const logout=document.getElementById("logoutBtn");
    if(logout && !logout.dataset.logoutReady){
      logout.dataset.logoutReady="1";
      logout.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();window.logoutUser?.();});
    }
  }

  function setActiveLink(){
    const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('#menu a[href]').forEach(a=>{
      const href=a.getAttribute('href');
      if(href && href!=='#' && href.toLowerCase()===current){a.setAttribute('aria-current','page');}
    });
  }

  async function addAdminLink(){
    const menu=document.getElementById("menu"); const s=getSession();
    if(!menu||!s||menu.querySelector('[data-admin-link="1"]'))return;
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(s.user.id)}&select=user_id`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${s.token}`}});
      const rows=r.ok?await r.json():[];
      if(Array.isArray(rows)&&rows.length){
        localStorage.setItem('eagle_j_is_admin','1');
        const a=document.createElement('a'); a.href='admin.html'; a.textContent='🛡️ Admin'; a.dataset.adminLink='1';
        const lang=menu.querySelector('.language'); if(lang)menu.insertBefore(a,lang); else menu.appendChild(a);
      }
    }catch(e){}
  }

  window.toggleMenu=function(){
    const button=document.getElementById('menuToggle'); if(button)button.click();
  };

  document.addEventListener('DOMContentLoaded',()=>{initMenu();syncAuthNav();setActiveLink();addAdminLink();});
})();

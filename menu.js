/* Eagle-J Connect - Mobile Menu
   Independent menu controller so the hamburger keeps working even if
   another page script has an unrelated error.
*/
(function () {
  function initMenu() {
    const button = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
    const menu = document.getElementById('menu');
    if (!button || !menu) return;

    // Avoid attaching the handler more than once.
    if (button.dataset.eagleMenuReady === '1') return;
    button.dataset.eagleMenuReady = '1';

    function closeMenu() {
      menu.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const open = !menu.classList.contains('show');
      menu.classList.toggle('show', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', toggleMenu, false);

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu, false);
    });

    document.addEventListener('click', function (event) {
      if (!menu.classList.contains('show')) return;
      if (menu.contains(event.target) || button.contains(event.target)) return;
      closeMenu();
    }, false);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    }, false);
  }


  async function addAdminLink() {
    const menu = document.getElementById('menu');
    if (!menu) return;

    // Only show the admin link after a successful admin check during login.
    // The admin.html page performs its own server-side/RLS-backed check too.
    if (localStorage.getItem('eagle_j_is_admin') !== '1') return;
    if (menu.querySelector('a[data-admin-link="1"]')) return;

    const link = document.createElement('a');
    link.href = 'admin.html';
    link.dataset.adminLink = '1';
    link.textContent = '🛡️ Admin Dashboard';
    menu.insertBefore(link, menu.querySelector('.language') || null);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMenu();
      addAdminLink();
    });
  } else {
    initMenu();
    addAdminLink();
  }
})();

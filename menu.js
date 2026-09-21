/* Eagle-J Connect - Mobile Menu + Admin navigation */
(function () {

  const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";

  function getToken() {
    return localStorage.getItem("supabase_access_token") || "";
  }

  function getUserId() {
    const raw = localStorage.getItem("supabase_user");

    if (raw) {
      try {
        return JSON.parse(raw).id || "";
      } catch (e) {}
    }

    return localStorage.getItem("supabase_user_id") || "";
  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  function initMenu() {

    const button =
      document.getElementById("menuToggle") ||
      document.querySelector(".menu-toggle");

    const menu =
      document.getElementById("navMenu") ||
      document.getElementById("menu");

    if (!button || !menu) {
      console.warn(
        "Eagle-J Menu: #menuToggle oswa #navMenu pa jwenn."
      );
      return;
    }

    if (button.dataset.eagleMenuReady === "1") {
      return;
    }

    button.dataset.eagleMenuReady = "1";

    function closeMenu() {

      menu.classList.remove("show");

      button.setAttribute(
        "aria-expanded",
        "false"
      );

    }

    function toggleMenu(event) {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const open =
        !menu.classList.contains("show");

      menu.classList.toggle(
        "show",
        open
      );

      button.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

    }

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener(
      "click",
      toggleMenu,
      false
    );


    /* Close menu after clicking a link */

    menu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          closeMenu,
          false
        );

      });


    /* Close when clicking outside */

    document.addEventListener(
      "click",
      event => {

        if (!menu.classList.contains("show")) {
          return;
        }

        if (
          menu.contains(event.target) ||
          button.contains(event.target)
        ) {
          return;
        }

        closeMenu();

      },
      false
    );


    /* Close with ESC */

    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Escape") {
          closeMenu();
        }

      },
      false
    );

  }


  /* =========================================================
     ADMIN LINK
  ========================================================= */

  function addAdminLink() {

    const menu =
      document.getElementById("navMenu") ||
      document.getElementById("menu");

    if (!menu) {
      return;
    }

    if (
      menu.querySelector(
        'a[data-admin-link="1"]'
      )
    ) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = "admin.html";

    link.dataset.adminLink = "1";

    link.textContent =
      "🛡️ Admin Dashboard";

    menu.insertBefore(
      link,
      menu.querySelector(".language-box") ||
      menu.querySelector(".language") ||
      null
    );

  }


  /* =========================================================
     CHECK ADMIN
  ========================================================= */

  async function checkAdminAndShowMenu() {

    const userId = getUserId();
    const token = getToken();

    if (!userId || !token) {
      return false;
    }


    /* Use saved admin status first */

    if (
      localStorage.getItem(
        "eagle_j_is_admin"
      ) === "1"
    ) {

      addAdminLink();

      return true;
    }


    /* Verify directly with Supabase */

    try {

      const response = await fetch(

        `${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(userId)}&select=user_id`,

        {
          headers: {

            apikey: SUPABASE_KEY,

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json"

          }
        }

      );


      if (!response.ok) {

        console.warn(
          "Admin verification failed:",
          response.status
        );

        return false;
      }


      const rows =
        await response.json();


      const isAdmin =
        Array.isArray(rows) &&
        rows.length > 0;


      localStorage.setItem(
        "eagle_j_is_admin",
        isAdmin ? "1" : "0"
      );


      if (isAdmin) {
        addAdminLink();
      }


      return isAdmin;

    } catch (e) {

      console.warn(
        "Admin menu check failed:",
        e
      );

      return false;
    }

  }


  /* =========================================================
     ADMIN REDIRECT
  ========================================================= */

  function redirectAdminFromNormalDashboard() {

    const page =
      (
        location.pathname
          .split("/")
          .pop() || ""
      ).toLowerCase();


    if (
      page !== "dashboard.html" &&
      page !== "employer.html"
    ) {
      return;
    }


    if (
      localStorage.getItem(
        "eagle_j_is_admin"
      ) === "1"
    ) {

      location.replace(
        "admin.html"
      );

    }

  }


  /* =========================================================
     START
  ========================================================= */

  function start() {

    initMenu();


    checkAdminAndShowMenu()
      .then(isAdmin => {

        if (isAdmin) {

          redirectAdminFromNormalDashboard();

        }

      });

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  } else {

    start();

  }

})();

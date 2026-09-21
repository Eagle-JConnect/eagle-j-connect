/* Eagle-J Connect - Multilingual UI */

const translations = {

  ht: {

    "nav-home": "Akèy",
    "nav-jobs": "Travay",
    "nav-business": "Biznis",
    "nav-contact": "Kontak",
    "nav-register": "Enskri",
    "nav-login": "Konekte",
    "nav-account": "Kont Mwen",
    "nav-logout": "Dekonekte",

    "hero-title": "OPEN THE WAY. CREATE WEALTH.",
    "hero-text": "Konekte ak moun, dekouvri opòtinite, grandi rezo ou epi kreye nouvo posiblite.",

    "create-account": "Kreye Kont",
    "find-job": "Chèche Travay",

    "services-title": "Sèvis Eagle-J Connect",
    "about-title": "Poukisa Eagle-J Connect?",

    "footer-text": "OPEN THE WAY. CREATE WEALTH.",

    "jobs-title": "Opòtinite Travay",
    "jobs-description": "Jwenn travay ki disponib nan diferan kominote ak mache.",
    "category-title": "Travay ki disponib",
    "search-job": "Chèche pa tit, konpayi oswa lokalizasyon...",

    "all-jobs": "Tout Travay",
    "apply-button": "Aplike",
    "no-jobs": "Pa gen travay ki disponib pou kounye a.",

    "how-title": "Kijan sa mache?",
    "step-one": "1️⃣ Kreye Kont",
    "step-two": "2️⃣ Chèche Travay",
    "step-three": "3️⃣ Aplike",

    "business-title": "Biznis ak Sèvis",
    "create-ad": "Kreye yon Anons",

    "login": "Konekte",
    "register": "Kreye yon kont",

    "profile": "Pwofil mwen",
    "employer": "Anplwayè",
    "job-seeker": "Moun k ap chèche travay"
  },


  en: {

    "nav-home": "Home",
    "nav-jobs": "Jobs",
    "nav-business": "Business",
    "nav-contact": "Contact",
    "nav-register": "Register",
    "nav-login": "Login",
    "nav-account": "My Account",
    "nav-logout": "Logout",

    "hero-title": "OPEN THE WAY. CREATE WEALTH.",
    "hero-text": "Connect with people, discover opportunities, grow your network, and create new possibilities.",

    "create-account": "Create Account",
    "find-job": "Find Jobs",

    "services-title": "Eagle-J Connect Services",
    "about-title": "Why Eagle-J Connect?",

    "footer-text": "OPEN THE WAY. CREATE WEALTH.",

    "jobs-title": "Job Opportunities",
    "jobs-description": "Find available jobs across different communities and markets.",
    "category-title": "Available Jobs",
    "search-job": "Search by title, company or location...",

    "all-jobs": "All Jobs",
    "apply-button": "Apply",
    "no-jobs": "No jobs are available right now.",

    "how-title": "How does it work?",
    "step-one": "1️⃣ Create Account",
    "step-two": "2️⃣ Search Jobs",
    "step-three": "3️⃣ Apply",

    "business-title": "Businesses & Services",
    "create-ad": "Create an Ad",

    "login": "Login",
    "register": "Create an account",

    "profile": "My Account",
    "employer": "Employer",
    "job-seeker": "Job Seeker"
  },


  fr: {

    "nav-home": "Accueil",
    "nav-jobs": "Emplois",
    "nav-business": "Entreprise",
    "nav-contact": "Contact",
    "nav-register": "S'inscrire",
    "nav-login": "Connexion",
    "nav-account": "Mon compte",
    "nav-logout": "Déconnexion",

    "hero-title": "OUVREZ LA VOIE. CRÉEZ DE LA RICHESSE.",
    "hero-text": "Connectez-vous aux personnes, découvrez des opportunités, développez votre réseau et créez de nouvelles possibilités.",

    "create-account": "Créer un compte",
    "find-job": "Chercher un emploi",

    "services-title": "Services Eagle-J Connect",
    "about-title": "Pourquoi Eagle-J Connect ?",

    "footer-text": "OUVREZ LA VOIE. CRÉEZ DE LA RICHESSE.",

    "jobs-title": "Opportunités d'emploi",
    "jobs-description": "Trouvez des emplois disponibles dans différentes communautés et différents marchés.",
    "category-title": "Emplois disponibles",
    "search-job": "Rechercher par titre, entreprise ou lieu...",

    "all-jobs": "Tous les emplois",
    "apply-button": "Postuler",
    "no-jobs": "Aucun emploi disponible pour le moment.",

    "how-title": "Comment ça marche ?",
    "step-one": "1️⃣ Créer un compte",
    "step-two": "2️⃣ Chercher un emploi",
    "step-three": "3️⃣ Postuler",

    "business-title": "Entreprises et services",
    "create-ad": "Créer une annonce",

    "login": "Connexion",
    "register": "Créer un compte",

    "profile": "Mon compte",
    "employer": "Employeur",
    "job-seeker": "Chercheur d'emploi"
  }

};


/* ==============================
   APPLY LANGUAGE
============================== */

function applyLanguage(lang) {

  const dict = translations[lang] || translations.ht;

  document.documentElement.lang =
    lang === "ht" ? "ht" : lang;


  /* TEXT */

  document.querySelectorAll("[data-i18n]").forEach(el => {

    const key = el.getAttribute("data-i18n");

    if (dict[key]) {
      el.textContent = dict[key];
    }

  });


  /* PLACEHOLDER */

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {

    const key = el.getAttribute("data-i18n-placeholder");

    if (dict[key]) {
      el.placeholder = dict[key];
    }

  });


  /* LANGUAGE SELECTOR */

  const selector =
    document.getElementById("languageSelect");

  if (selector) {
    selector.value = lang;
  }

}


/* ==============================
   CHANGE LANGUAGE
============================== */

function changeLanguage() {

  const selector =
    document.getElementById("languageSelect");

  const lang =
    selector ? selector.value : "ht";

  localStorage.setItem(
    "selectedLanguage",
    lang
  );

  applyLanguage(lang);

}


/* ==============================
   LOAD SAVED LANGUAGE
============================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const savedLanguage =
      localStorage.getItem("selectedLanguage") || "ht";

    applyLanguage(savedLanguage);

  }
); 

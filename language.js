/* =========================================================
   EAGLE-J CONNECT
   GLOBAL LANGUAGE SYSTEM
   Kreyòl (ht) • English (en) • Français (fr)
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "eagleJConnectLanguage";
  const OLD_STORAGE_KEY = "selectedLanguage";

  const DEFAULT_LANGUAGE = "ht";
  const SUPPORTED = ["ht", "en", "fr"];

  let applying = false;
  let observerTimer = null;

  /* =========================================================
     TRANSLATIONS BY DATA-I18N KEY
     ========================================================= */

  const translations = {

    /* ---------------- NAVIGATION ---------------- */

    "nav-home": {
      ht: "Akèy",
      en: "Home",
      fr: "Accueil"
    },

    "nav-jobs": {
      ht: "Travay",
      en: "Jobs",
      fr: "Emplois"
    },

    "nav-business": {
      ht: "Biznis",
      en: "Business",
      fr: "Entreprises"
    },

    "nav-ads": {
      ht: "Anons",
      en: "Listings",
      fr: "Annonces"
    },

    "nav-contact": {
      ht: "Kontak",
      en: "Contact",
      fr: "Contact"
    },

    "nav-register": {
      ht: "Enskri",
      en: "Register",
      fr: "S'inscrire"
    },

    "nav-login": {
      ht: "Konekte",
      en: "Login",
      fr: "Connexion"
    },

    "nav-account": {
      ht: "Kont Mwen",
      en: "My Account",
      fr: "Mon compte"
    },

    "nav-logout": {
      ht: "Dekonekte",
      en: "Logout",
      fr: "Déconnexion"
    },

    /* ---------------- HERO ---------------- */

    "hero-text": {
      ht: "Konekte ak moun, dekouvri travay ak sèvis, fè biznis ou konnen, epi jwenn opòtinite nenpòt kote nan mond lan.",
      en: "Connect with people, discover jobs and services, promote your business, and find opportunities anywhere in the world.",
      fr: "Connectez-vous avec des personnes, découvrez des emplois et des services, faites connaître votre entreprise et trouvez des opportunités partout dans le monde."
    },

    "create-account": {
      ht: "Kreye Kont",
      en: "Create Account",
      fr: "Créer un compte"
    },

    "find-job": {
      ht: "Chèche Travay",
      en: "Find Jobs",
      fr: "Chercher un emploi"
    },

    "create-ad": {
      ht: "📢 Kreye yon Anons",
      en: "📢 Create a Listing",
      fr: "📢 Créer une annonce"
    },

    /* =====================================================
       EXACT TEXT MAP
       ===================================================== */

    "Connect • Discover • Grow": {
      ht: "Konekte • Dekouvri • Grandi",
      en: "Connect • Discover • Grow",
      fr: "Connecter • Découvrir • Grandir"
    },

    "WORLDWIDE • OPPORTUNITIES • CONNECTIONS": {
      ht: "TOUT MOND • OPÒTINITE • KONEKSYON",
      en: "WORLDWIDE • OPPORTUNITIES • CONNECTIONS",
      fr: "MONDE ENTIER • OPPORTUNITÉS • CONNEXIONS"
    },

    "CONNECT. DISCOVER. GROW.": {
      ht: "KONEKTE. DEKOUVRI. GRANDI.",
      en: "CONNECT. DISCOVER. GROW.",
      fr: "CONNECTEZ. DÉCOUVREZ. GRANDISSEZ."
    },

    "Have a business, service, or professional offering?": {
      ht: "Èske ou gen yon biznis, sèvis oswa yon òf pwofesyonèl?",
      en: "Have a business, service, or professional offering?",
      fr: "Vous avez une entreprise, un service ou une offre professionnelle ?"
    },

    "Put what you offer in front of people looking for products, services, professionals, and opportunities.": {
      ht: "Mete sa ou ofri devan moun k ap chèche pwodwi, sèvis, pwofesyonèl ak opòtinite.",
      en: "Put what you offer in front of people looking for products, services, professionals, and opportunities.",
      fr: "Présentez ce que vous proposez aux personnes qui recherchent des produits, des services, des professionnels et des opportunités."
    },

    "Explore what is available": {
      ht: "Eksplore sa ki disponib",
      en: "Explore what is available",
      fr: "Découvrez ce qui est disponible"
    },

    "Browse jobs, businesses, members, and listings from different locations.": {
      ht: "Gade travay, biznis, manm ak anons ki soti nan diferan lokalizasyon.",
      en: "Browse jobs, businesses, members, and listings from different locations.",
      fr: "Parcourez les emplois, entreprises, membres et annonces provenant de différents endroits."
    },

    "💼 Jobs": {
      ht: "💼 Travay",
      en: "💼 Jobs",
      fr: "💼 Emplois"
    },

    "🛍️ Businesses": {
      ht: "🛍️ Biznis",
      en: "🛍️ Businesses",
      fr: "🛍️ Entreprises"
    },

    "👥 Members": {
      ht: "👥 Manm",
      en: "👥 Members",
      fr: "👥 Membres"
    },

    "📢 Listings": {
      ht: "📢 Anons",
      en: "📢 Listings",
      fr: "📢 Annonces"
    },

    "View jobs →": {
      ht: "Gade travay →",
      en: "View jobs →",
      fr: "Voir les emplois →"
    },

    "Explore businesses →": {
      ht: "Eksplore biznis →",
      en: "Explore businesses →",
      fr: "Découvrir les entreprises →"
    },

    "View members →": {
      ht: "Gade manm yo →",
      en: "View members →",
      fr: "Voir les membres →"
    },

    "View listings →": {
      ht: "Gade anons yo →",
      en: "View listings →",
      fr: "Voir les annonces →"
    },

    /* ---------------- SERVICES ---------------- */

    "One platform. Many possibilities.": {
      ht: "Yon platfòm. Anpil posiblite.",
      en: "One platform. Many possibilities.",
      fr: "Une plateforme. De nombreuses possibilités."
    },

    "Find opportunities, showcase what you offer, and connect directly with people and organizations around the world.": {
      ht: "Jwenn opòtinite, montre sa ou ofri, epi konekte dirèkteman ak moun ak òganizasyon atravè mond lan.",
      en: "Find opportunities, showcase what you offer, and connect directly with people and organizations around the world.",
      fr: "Trouvez des opportunités, présentez ce que vous proposez et connectez-vous directement avec des personnes et des organisations partout dans le monde."
    },

    "01 • JOBS": {
      ht: "01 • TRAVAY",
      en: "01 • JOBS",
      fr: "01 • EMPLOIS"
    },

    "💼 Find a Job": {
      ht: "💼 Jwenn yon Travay",
      en: "💼 Find a Job",
      fr: "💼 Trouver un emploi"
    },

    "Search for opportunities by title, company, location, and job type.": {
      ht: "Chèche opòtinite selon tit travay la, konpayi an, lokalizasyon ak kalite travay.",
      en: "Search for opportunities by title, company, location, and job type.",
      fr: "Recherchez des opportunités par titre, entreprise, localisation et type d'emploi."
    },

    "Browse Jobs →": {
      ht: "Gade Travay →",
      en: "Browse Jobs →",
      fr: "Parcourir les emplois →"
    },

    "02 • BUSINESS": {
      ht: "02 • BIZNIS",
      en: "02 • BUSINESS",
      fr: "02 • ENTREPRISE"
    },

    "🛍️ Discover Businesses": {
      ht: "🛍️ Dekouvri Biznis",
      en: "🛍️ Discover Businesses",
      fr: "🛍️ Découvrir les entreprises"
    },

    "Find businesses, professionals, employers, services, and local offerings.": {
      ht: "Jwenn biznis, pwofesyonèl, anplwayè, sèvis ak òf lokal.",
      en: "Find businesses, professionals, employers, services, and local offerings.",
      fr: "Trouvez des entreprises, des professionnels, des employeurs, des services et des offres locales."
    },

    "Explore Businesses →": {
      ht: "Eksplore Biznis →",
      en: "Explore Businesses →",
      fr: "Découvrir les entreprises →"
    },

    "03 • LISTINGS": {
      ht: "03 • ANONS",
      en: "03 • LISTINGS",
      fr: "03 • ANNONCES"
    },

    "📢 Publish What You Offer": {
      ht: "📢 Pibliye Sa Ou Ofri",
      en: "📢 Publish What You Offer",
      fr: "📢 Publiez ce que vous proposez"
    },

    "Promote your business, service, professional skills, products, or property.": {
      ht: "Fè pwomosyon pou biznis ou, sèvis ou, konpetans pwofesyonèl ou, pwodwi ou oswa byen ou.",
      en: "Promote your business, service, professional skills, products, or property.",
      fr: "Faites la promotion de votre entreprise, service, compétences professionnelles, produits ou biens."
    },

    "Create a Listing →": {
      ht: "Kreye yon Anons →",
      en: "Create a Listing →",
      fr: "Créer une annonce →"
    },

    /* ---------------- HOW IT WORKS ---------------- */

    "How it works": {
      ht: "Kijan sa mache",
      en: "How it works",
      fr: "Comment ça marche"
    },

    "Create an Account": {
      ht: "Kreye yon Kont",
      en: "Create an Account",
      fr: "Créer un compte"
    },

    "Build your profile and unlock access to opportunities.": {
      ht: "Konplete pwofil ou epi jwenn aksè ak opòtinite yo.",
      en: "Build your profile and unlock access to opportunities.",
      fr: "Créez votre profil et accédez aux opportunités."
    },

    "Search or Publish": {
      ht: "Chèche oswa Pibliye",
      en: "Search or Publish",
      fr: "Rechercher ou publier"
    },

    "Find a job, discover a service, or publish your own offering.": {
      ht: "Jwenn yon travay, dekouvri yon sèvis oswa pibliye sa ou menm ou ofri.",
      en: "Find a job, discover a service, or publish your own offering.",
      fr: "Trouvez un emploi, découvrez un service ou publiez votre propre offre."
    },

    "Connect Directly": {
      ht: "Konekte Dirèkteman",
      en: "Connect Directly",
      fr: "Connectez-vous directement"
    },

    "Reach people, businesses, and employers connected to your goals.": {
      ht: "Konekte ak moun, biznis ak anplwayè ki gen rapò ak objektif ou.",
      en: "Reach people, businesses, and employers connected to your goals.",
      fr: "Entrez en contact avec des personnes, entreprises et employeurs liés à vos objectifs."
    },

    /* ---------------- CTA ---------------- */

    "Your next opportunity can start with one connection.": {
      ht: "Pwochen opòtinite ou ka kòmanse ak yon sèl koneksyon.",
      en: "Your next opportunity can start with one connection.",
      fr: "Votre prochaine opportunité peut commencer par une seule connexion."
    },

    "Create your account and start discovering what is available around you and around the world.": {
      ht: "Kreye kont ou epi kòmanse dekouvri sa ki disponib bò kote ou ak atravè mond lan.",
      en: "Create your account and start discovering what is available around you and around the world.",
      fr: "Créez votre compte et commencez à découvrir ce qui est disponible autour de vous et partout dans le monde."
    },

    "Contact Us": {
      ht: "Kontakte Nou",
      en: "Contact Us",
      fr: "Contactez-nous"
    },

    /* ---------------- FOOTER ---------------- */

    "Home": {
      ht: "Akèy",
      en: "Home",
      fr: "Accueil"
    },

    "Jobs": {
      ht: "Travay",
      en: "Jobs",
      fr: "Emplois"
    },

    "Business": {
      ht: "Biznis",
      en: "Business",
      fr: "Entreprise"
    },

    "Listings": {
      ht: "Anons",
      en: "Listings",
      fr: "Annonces"
    },

    "Contact": {
      ht: "Kontak",
      en: "Contact",
      fr: "Contact"
    },

    "Register": {
      ht: "Enskri",
      en: "Register",
      fr: "S'inscrire"
    },

    "Connect people, discover opportunities, and grow anywhere in the world.": {
      ht: "Konekte moun, dekouvri opòtinite epi grandi nenpòt kote nan mond lan.",
      en: "Connect people, discover opportunities, and grow anywhere in the world.",
      fr: "Connectez les personnes, découvrez des opportunités et développez-vous partout dans le monde."
    },

    /* =====================================================
       EXISTING COMMON SYSTEM TEXT
       ===================================================== */

    "Konekte": {
      ht: "Konekte",
      en: "Login",
      fr: "Connexion"
    },

    "Dekonekte": {
      ht: "Dekonekte",
      en: "Logout",
      fr: "Déconnexion"
    },

    "Enskri": {
      ht: "Enskri",
      en: "Register",
      fr: "S'inscrire"
    },

    "Akèy": {
      ht: "Akèy",
      en: "Home",
      fr: "Accueil"
    },

    "Travay": {
      ht: "Travay",
      en: "Jobs",
      fr: "Emplois"
    },

    "Biznis": {
      ht: "Biznis",
      en: "Business",
      fr: "Entreprises"
    },

    "Anons": {
      ht: "Anons",
      en: "Listings",
      fr: "Annonces"
    },

    "Kontak": {
      ht: "Kontak",
      en: "Contact",
      fr: "Contact"
    },

    "Kreye yon kont": {
      ht: "Kreye yon kont",
      en: "Create an account",
      fr: "Créer un compte"
    },

    "Kreye Kont": {
      ht: "Kreye Kont",
      en: "Create Account",
      fr: "Créer un compte"
    },

    "Chèche Travay": {
      ht: "Chèche Travay",
      en: "Find Jobs",
      fr: "Chercher un emploi"
    },

    "Kreye yon Anons": {
      ht: "Kreye yon Anons",
      en: "Create a Listing",
      fr: "Créer une annonce"
    },

    "Tout Anons": {
      ht: "Tout Anons",
      en: "All Listings",
      fr: "Toutes les annonces"
    },

    "Gade sa moun ak biznis ap ofri sou Eagle-J Connect.": {
      ht: "Gade sa moun ak biznis ap ofri sou Eagle-J Connect.",
      en: "See what people and businesses are offering on Eagle-J Connect.",
      fr: "Découvrez ce que les particuliers et les entreprises proposent sur Eagle-J Connect."
    },

    "Ap chaje...": {
      ht: "Ap chaje...",
      en: "Loading...",
      fr: "Chargement..."
    },

    "Anons yo ap chaje...": {
      ht: "Anons yo ap chaje...",
      en: "Listings are loading...",
      fr: "Chargement des annonces..."
    },

    "Anons lan ap chaje...": {
      ht: "Anons lan ap chaje...",
      en: "Listing is loading...",
      fr: "Chargement de l'annonce..."
    },

    "Itilizatè": {
      ht: "Itilizatè",
      en: "User",
      fr: "Utilisateur"
    },

    "Itilizatè yo ap chaje...": {
      ht: "Itilizatè yo ap chaje...",
      en: "Users are loading...",
      fr: "Chargement des utilisateurs..."
    },

    "Pwofil": {
      ht: "Pwofil",
      en: "Profile",
      fr: "Profil"
    },

    "Pwofil mwen": {
      ht: "Pwofil mwen",
      en: "My Profile",
      fr: "Mon profil"
    },

    "Deskripsyon": {
      ht: "Deskripsyon",
      en: "Description",
      fr: "Description"
    },

    "Lokalizasyon": {
      ht: "Lokalizasyon",
      en: "Location",
      fr: "Localisation"
    },

    "Non": {
      ht: "Non",
      en: "Name",
      fr: "Nom"
    },

    "Siyati": {
      ht: "Siyati",
      en: "Last Name",
      fr: "Nom de famille"
    },

    "Imèl": {
      ht: "Imèl",
      en: "Email",
      fr: "E-mail"
    },

    "Modpas": {
      ht: "Modpas",
      en: "Password",
      fr: "Mot de passe"
    },

    "Mesaj": {
      ht: "Mesaj",
      en: "Message",
      fr: "Message"
    },

    "Telefòn / WhatsApp": {
      ht: "Telefòn / WhatsApp",
      en: "Phone / WhatsApp",
      fr: "Téléphone / WhatsApp"
    },

    "Telefòn": {
      ht: "Telefòn",
      en: "Phone",
      fr: "Téléphone"
    },

    "Chwazi": {
      ht: "Chwazi",
      en: "Select",
      fr: "Sélectionner"
    },

    "Full-time": {
      ht: "Full-time",
      en: "Full-time",
      fr: "Temps plein"
    },

    "Part-time": {
      ht: "Part-time",
      en: "Part-time",
      fr: "Temps partiel"
    },

    "Contract": {
      ht: "Contract",
      en: "Contract",
      fr: "Contrat"
    },

    "Temporary": {
      ht: "Temporary",
      en: "Temporary",
      fr: "Temporaire"
    },

    "MARKETPLACE": {
      ht: "MARKETPLACE",
      en: "MARKETPLACE",
      fr: "MARCHÉ"
    },

    "EAGLE-J COMMUNITY": {
      ht: "EAGLE-J COMMUNITY",
      en: "EAGLE-J COMMUNITY",
      fr: "COMMUNAUTÉ EAGLE-J"
    }

  };


  /* =========================================================
     BUILD REVERSE MAP
     ========================================================= */

  const reverseMap = {};

  Object.keys(textMap()).forEach(function (source) {
    const row = textMap()[source];

    Object.keys(row).forEach(function (lang) {

      const value = normalize(row[lang]);

      if (!value) return;

      if (!reverseMap[value]) {
        reverseMap[value] = row;
      }
    });
  });


  function textMap() {
    return TEXT_MAP;
  }

  const TEXT_MAP = {
    ...translations
  };


  /* =========================================================
     NORMALIZE TEXT
     ========================================================= */

  function normalize(value) {
    return String(value || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* =========================================================
     FIND TRANSLATION
     ========================================================= */

  function findTranslation(source) {

    const normalized = normalize(source);

    if (!normalized) {
      return null;
    }

    if (TEXT_MAP[normalized]) {
      return TEXT_MAP[normalized];
    }

    if (reverseMap[normalized]) {
      return reverseMap[normalized];
    }

    return null;
  }


  /* =========================================================
     GET LANGUAGE
     ========================================================= */

  function getLanguage() {

    let lang = null;

    try {
      lang = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (!SUPPORTED.includes(lang)) {

      try {
        lang = localStorage.getItem(OLD_STORAGE_KEY);
      } catch (e) {}
    }

    if (!SUPPORTED.includes(lang)) {
      lang = DEFAULT_LANGUAGE;
    }

    return lang;
  }


  /* =========================================================
     TRANSLATE DATA-I18N
     ========================================================= */

  function translateElement(element, lang) {

    if (!element) return;

    const key = element.getAttribute("data-i18n");

    if (!key) return;

    let translation = null;

    if (
      translations[key] &&
      translations[key][lang] !== undefined
    ) {
      translation = translations[key][lang];
    }

    if (translation === null) {
      const row = findTranslation(key);

      if (row && row[lang] !== undefined) {
        translation = row[lang];
      }
    }

    if (translation === null || translation === undefined) {
      return;
    }

    element.textContent = translation;
  }


  /* =========================================================
     TRANSLATE ATTRIBUTES
     ========================================================= */

  function translateAttributes(element, lang) {

    if (!element) return;

    const attributes = [
      ["data-i18n-placeholder", "placeholder"],
      ["data-i18n-title", "title"],
      ["data-i18n-aria", "aria-label"]
    ];

    attributes.forEach(function (pair) {

      const key = pair[0];
      const attribute = pair[1];

      const translationKey =
        element.getAttribute(key);

      if (!translationKey) return;

      let translation = null;

      if (
        translations[translationKey] &&
        translations[translationKey][lang] !== undefined
      ) {
        translation =
          translations[translationKey][lang];
      }

      if (translation === null) {

        const row =
          findTranslation(translationKey);

        if (row && row[lang] !== undefined) {
          translation = row[lang];
        }
      }

      if (
        translation !== null &&
        translation !== undefined
      ) {
        element.setAttribute(
          attribute,
          translation
        );
      }

    });
  }


  /* =========================================================
     ELEMENTS THAT MUST NOT BE AUTO-TRANSLATED
     ========================================================= */

  function shouldIgnore(element) {

    if (!element) return true;

    const tag = element.tagName;

    if (
      tag === "SCRIPT" ||
      tag === "STYLE" ||
      tag === "NOSCRIPT" ||
      tag === "INPUT" ||
      tag === "TEXTAREA"
    ) {
      return true;
    }

    if (
      element.closest &&
      element.closest(
        "#languageSelect, .language, select"
      )
    ) {
      return true;
    }

    /*
      User-generated content should stay untouched.
      This is important for:
      - business names
      - job descriptions
      - member names
      - user listings
      - uploaded content
    */

    if (
      element.closest &&
      element.closest(
        "[data-user-content], .user-content, .business-content, .job-content, .listing-content"
      )
    ) {
      return true;
    }

    return false;
  }


  /* =========================================================
     TRANSLATE EXACT UNTAGGED SYSTEM TEXT
     ========================================================= */

  function translateUnTaggedText(root, lang) {

    if (!root) return;

    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {

            if (!node.parentElement) {
              return NodeFilter.FILTER_REJECT;
            }

            if (
              shouldIgnore(node.parentElement)
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            const original =
              normalize(node.nodeValue);

            if (!original) {
              return NodeFilter.FILTER_REJECT;
            }

            const row =
              findTranslation(original);

            if (!row) {
              return NodeFilter.FILTER_REJECT;
            }

            if (
              row[lang] === undefined
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

    const nodes = [];

    let node;

    while (
      (node = walker.nextNode())
    ) {
      nodes.push(node);
    }

    nodes.forEach(function (textNode) {

      const original =
        normalize(textNode.nodeValue);

      const row =
        findTranslation(original);

      if (!row) return;

      if (
        row[lang] === undefined
      ) {
        return;
      }

      const raw =
        String(textNode.nodeValue);

      const leading =
        raw.match(/^\s*/)?.[0] || "";

      const trailing =
        raw.match(/\s*$/)?.[0] || "";

      textNode.nodeValue =
        leading +
        row[lang] +
        trailing;

    });
  }


  /* =========================================================
     LANGUAGE SELECT
     ========================================================= */

  function updateLanguageSelectors(lang) {

    const selectors =
      document.querySelectorAll(
        "#languageSelect, #languageSelector, #language-select, .language-selector, select[data-language]"
      );

    selectors.forEach(function (select) {

      if (
        select &&
        select.tagName === "SELECT"
      ) {

        if (
          select.value !== lang
        ) {
          select.value = lang;
        }

      }

    });
  }


  /* =========================================================
     CONNECT LANGUAGE SELECTOR
     ========================================================= */

  function connectLanguageSelector() {

    const selectors =
      document.querySelectorAll(
        "#languageSelect, #languageSelector, #language-select, .language-selector, select[data-language]"
      );

    selectors.forEach(function (select) {

      if (
        select.dataset.eagleLanguageReady === "true"
      ) {
        return;
      }

      select.dataset.eagleLanguageReady = "true";

      select.addEventListener(
        "change",
        function () {

          const selected =
            select.value;

          if (
            SUPPORTED.includes(selected)
          ) {

            changeLanguage(selected);

          }

        }
      );

    });
  }


  /* =========================================================
     APPLY LANGUAGE
     ========================================================= */

  function applyLanguage(lang) {

    if (
      !SUPPORTED.includes(lang)
    ) {
      lang = DEFAULT_LANGUAGE;
    }

    if (applying) {
      return;
    }

    applying = true;

    try {

      document.documentElement
        .setAttribute(
          "lang",
          lang
        );

      try {
        localStorage.setItem(
          STORAGE_KEY,
          lang
        );

        localStorage.setItem(
          OLD_STORAGE_KEY,
          lang
        );
      } catch (e) {}

      /* ---------------- DATA-I18N ---------------- */

      document
        .querySelectorAll("[data-i18n]")
        .forEach(function (element) {

          translateElement(
            element,
            lang
          );

        });


      /* ---------------- ATTRIBUTES ---------------- */

      document
        .querySelectorAll(
          "[data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]"
        )
        .forEach(function (element) {

          translateAttributes(
            element,
            lang
          );

        });


      /* ---------------- UNTAGGED SYSTEM TEXT ---------------- */

      if (document.body) {

        translateUnTaggedText(
          document.body,
          lang
        );

      }


      /* ---------------- SELECTORS ---------------- */

      updateLanguageSelectors(
        lang
      );

      connectLanguageSelector();


      window.currentLanguage =
        lang;

      window.selectedLanguage =
        lang;

    } finally {

      applying = false;

    }


    /* ---------------- NOTIFY OTHER SCRIPTS ---------------- */

    try {

      document.dispatchEvent(
        new CustomEvent(
          "languageChanged",
          {
            detail: {
              language: lang
            }
          }
        )
      );

    } catch (e) {}

  }


  /* =========================================================
     CHANGE LANGUAGE
     ========================================================= */

  function changeLanguage(lang) {

    if (
      !SUPPORTED.includes(lang)
    ) {

      console.warn(
        "Eagle-J Connect: Unsupported language:",
        lang
      );

      return;
    }

    applyLanguage(lang);
  }


  /* =========================================================
     GLOBAL FUNCTIONS
     ========================================================= */

  window.changeLanguage =
    changeLanguage;

  window.applyLanguage =
    applyLanguage;

  window.getLanguage =
    getLanguage;


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initializeLanguage() {

    connectLanguageSelector();

    const lang =
      getLanguage();

    applyLanguage(lang);

    /*
      Reconnect after other scripts
      finish loading.
    */

    setTimeout(function () {

      connectLanguageSelector();

      updateLanguageSelectors(
        getLanguage()
      );

    }, 300);

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeLanguage,
      {
        once: true
      }
    );

  } else {

    initializeLanguage();

  }


  /* =========================================================
     MUTATION OBSERVER
     ========================================================= */

  function startObserver() {

    if (
      typeof MutationObserver === "undefined"
    ) {
      return;
    }

    if (!document.body) {
      return;
    }

    const observer =
      new MutationObserver(
        function (mutations) {

          let added = false;

          mutations.forEach(
            function (mutation) {

              if (
                mutation.type === "childList" &&
                mutation.addedNodes &&
                mutation.addedNodes.length
              ) {

                added = true;

              }

            }
          );

          if (!added) {
            return;
          }

          clearTimeout(
            observerTimer
          );

          observerTimer =
            setTimeout(
              function () {

                if (applying) {
                  return;
                }

                const lang =
                  getLanguage();

                document
                  .querySelectorAll(
                    "[data-i18n]"
                  )
                  .forEach(
                    function (element) {

                      translateElement(
                        element,
                        lang
                      );

                    }
                  );

                document
                  .querySelectorAll(
                    "[data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]"
                  )
                  .forEach(
                    function (element) {

                      translateAttributes(
                        element,
                        lang
                      );

                    }
                  );

                if (document.body) {

                  translateUnTaggedText(
                    document.body,
                    lang
                  );

                }

                connectLanguageSelector();

                updateLanguageSelectors(
                  lang
                );

              },
              150
            );

        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    window.eagleJLanguageObserver =
      observer;
  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startObserver,
      {
        once: true
      }
    );

  } else {

    startObserver();

  }


  /* =========================================================
     PUBLIC DEBUG OBJECT
     ========================================================= */

  window.EagleJLanguage = {

    supported:
      SUPPORTED.slice(),

    defaultLanguage:
      DEFAULT_LANGUAGE,

    getLanguage:
      getLanguage,

    changeLanguage:
      changeLanguage,

    applyLanguage:
      applyLanguage

  };

})(); 

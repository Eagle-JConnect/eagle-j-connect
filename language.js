/* =========================================================
   EAGLE-J CONNECT — GLOBAL LANGUAGE SYSTEM
   Kreyòl (ht) • English (en) • Français (fr)

   GLOBAL VERSION — FIXED
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "eagleJConnectLanguage";
  const OLD_STORAGE_KEY = "selectedLanguage";

  const DEFAULT_LANGUAGE = "ht";
  const SUPPORTED = ["ht", "en", "fr"];

  /* =======================================================
     MAIN TRANSLATIONS
     ======================================================= */

  const translations = {

    ht: {
      "nav-home": "Akèy",
      "nav-jobs": "Travay",
      "nav-business": "Biznis",
      "nav-ads": "Anons",
      "nav-contact": "Kontak",
      "nav-register": "Enskri",
      "nav-login": "Konekte",
      "nav-account": "Kont Mwen",
      "nav-logout": "Dekonekte",

      "hero-text":
        "Konekte ak moun, dekouvri opòtinite, devlope rezo ou, epi kreye nouvo posiblite.",

      "create-account": "Kreye Kont",
      "find-job": "Chèche Travay",
      "create-ad": "Kreye yon Anons",

      "stats-jobs": "Travay",
      "stats-business": "Biznis",
      "stats-users": "Itilizatè",
      "stats-ads": "Anons",

      "services-title": "Sèvis Eagle-J Connect",

      "footer-text":
        "Konekte ak moun, dekouvri opòtinite epi grandi ansanm."
    },

    en: {
      "nav-home": "Home",
      "nav-jobs": "Jobs",
      "nav-business": "Business",
      "nav-ads": "Listings",
      "nav-contact": "Contact",
      "nav-register": "Register",
      "nav-login": "Login",
      "nav-account": "My Account",
      "nav-logout": "Logout",

      "hero-text":
        "Connect with people, discover opportunities, grow your network, and create new possibilities.",

      "create-account": "Create Account",
      "find-job": "Find Jobs",
      "create-ad": "Create a Listing",

      "stats-jobs": "Jobs",
      "stats-business": "Businesses",
      "stats-users": "Users",
      "stats-ads": "Listings",

      "services-title":
        "Eagle-J Connect Services",

      "footer-text":
        "Connect with people, discover opportunities, and grow together."
    },

    fr: {
      "nav-home": "Accueil",
      "nav-jobs": "Emplois",
      "nav-business": "Entreprises",
      "nav-ads": "Annonces",
      "nav-contact": "Contact",
      "nav-register": "S'inscrire",
      "nav-login": "Connexion",
      "nav-account": "Mon compte",
      "nav-logout": "Déconnexion",

      "hero-text":
        "Connectez-vous avec les gens, découvrez des opportunités, développez votre réseau et créez de nouvelles possibilités.",

      "create-account":
        "Créer un compte",

      "find-job":
        "Chercher un emploi",

      "create-ad":
        "Créer une annonce",

      "stats-jobs":
        "Emplois",

      "stats-business":
        "Entreprises",

      "stats-users":
        "Utilisateurs",

      "stats-ads":
        "Annonces",

      "services-title":
        "Services Eagle-J Connect",

      "footer-text":
        "Connectez-vous avec les gens, découvrez des opportunités et grandissez ensemble."
    }
  };


  /* =======================================================
     EXACT TEXT MAP
     ======================================================= */

  const textMap = {

    "Connect • Discover • Grow": {
      ht: "Konekte • Dekouvri • Grandi",
      en: "Connect • Discover • Grow",
      fr: "Connecter • Découvrir • Grandir"
    },

    "🌐 English": {
      ht: "🌐 English",
      en: "🌐 English",
      fr: "🌐 Anglais"
    },

    "🇫🇷 Français": {
      ht: "🇫🇷 Français",
      en: "🇫🇷 French",
      fr: "🇫🇷 Français"
    },

    "🗣️ Kreyòl": {
      ht: "🗣️ Kreyòl",
      en: "🗣️ Haitian Creole",
      fr: "🗣️ Créole haïtien"
    },

    "🔐 Konekte": {
      ht: "🔐 Konekte",
      en: "🔐 Login",
      fr: "🔐 Connexion"
    },

    "Antre imèl ak modpas ou pou kontinye.": {
      ht: "Antre imèl ak modpas ou pou kontinye.",
      en: "Enter your email and password to continue.",
      fr: "Entrez votre e-mail et votre mot de passe pour continuer."
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

    "Ou poko gen kont?": {
      ht: "Ou poko gen kont?",
      en: "Don't have an account yet?",
      fr: "Vous n'avez pas encore de compte ?"
    },

    "Kreye yon kont": {
      ht: "Kreye yon kont",
      en: "Create an account",
      fr: "Créer un compte"
    },

    "MARKETPLACE": {
      ht: "MARKETPLACE",
      en: "MARKETPLACE",
      fr: "MARCHÉ"
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

    "📢 Kreye yon Anons": {
      ht: "📢 Kreye yon Anons",
      en: "📢 Create a Listing",
      fr: "📢 Créer une annonce"
    },

    "← Biznis & Sèvis": {
      ht: "← Biznis & Sèvis",
      en: "← Business & Services",
      fr: "← Entreprises & Services"
    },

    "🌎 Tout": {
      ht: "🌎 Tout",
      en: "🌎 All",
      fr: "🌎 Tous"
    },

    "👷 Anplwaye": {
      ht: "👷 Anplwaye",
      en: "👷 Employee",
      fr: "👷 Employé"
    },

    "🏢 Anplwayè": {
      ht: "🏢 Anplwayè",
      en: "🏢 Employer",
      fr: "🏢 Employeur"
    },

    "🧑🏾‍🔧 Pwofesyonèl": {
      ht: "🧑🏾‍🔧 Pwofesyonèl",
      en: "🧑🏾‍🔧 Professional",
      fr: "🧑🏾‍🔧 Professionnel"
    },

    "🛠️ Sèvis": {
      ht: "🛠️ Sèvis",
      en: "🛠️ Services",
      fr: "🛠️ Services"
    },

    "🛍️ Biznis": {
      ht: "🛍️ Biznis",
      en: "🛍️ Business",
      fr: "🛍️ Entreprise"
    },

    "🏠 Byen": {
      ht: "🏠 Byen",
      en: "🏠 Property",
      fr: "🏠 Bien immobilier"
    },

    "📍 Tout lokalizasyon": {
      ht: "📍 Tout lokalizasyon",
      en: "📍 All locations",
      fr: "📍 Toutes les localisations"
    },

    "Anons yo ap chaje...": {
      ht: "Anons yo ap chaje...",
      en: "Listings are loading...",
      fr: "Chargement des annonces..."
    },

    "📩 Kontakte Nou": {
      ht: "📩 Kontakte Nou",
      en: "📩 Contact Us",
      fr: "📩 Contactez-nous"
    },

    "Non ou": {
      ht: "Non ou",
      en: "Your Name",
      fr: "Votre nom"
    },

    "Telefòn / WhatsApp": {
      ht: "Telefòn / WhatsApp",
      en: "Phone / WhatsApp",
      fr: "Téléphone / WhatsApp"
    },

    "Mesaj": {
      ht: "Mesaj",
      en: "Message",
      fr: "Message"
    },

    "📧 Voye Mesaj": {
      ht: "📧 Voye Mesaj",
      en: "📧 Send Message",
      fr: "📧 Envoyer le message"
    },

    "👷 Moun k ap chèche travay": {
      ht: "👷 Moun k ap chèche travay",
      en: "👷 Job Seekers",
      fr: "👷 Chercheurs d'emploi"
    },

    "Chèche opòtinite ki disponib sou platfòm lan.": {
      ht: "Chèche opòtinite ki disponib sou platfòm lan.",
      en: "Find opportunities available on the platform.",
      fr: "Trouvez les opportunités disponibles sur la plateforme."
    },

    "🔎 Chèche Travay": {
      ht: "🔎 Chèche Travay",
      en: "🔎 Find Jobs",
      fr: "🔎 Chercher un emploi"
    },

    "← Retounen nan Biznis": {
      ht: "← Retounen nan Biznis",
      en: "← Back to Business",
      fr: "← Retour aux entreprises"
    },

    "Anons lan ap chaje...": {
      ht: "Anons lan ap chaje...",
      en: "Listing is loading...",
      fr: "Chargement de l'annonce..."
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

    "🏢 Zòn Anplwayè": {
      ht: "🏢 Zòn Anplwayè",
      en: "🏢 Employer Area",
      fr: "🏢 Espace employeur"
    },

    "Ap chaje...": {
      ht: "Ap chaje...",
      en: "Loading...",
      fr: "Chargement..."
    },

    "Pwofil Anplwayè": {
      ht: "Pwofil Anplwayè",
      en: "Employer Profile",
      fr: "Profil employeur"
    },

    "Non:": {
      ht: "Non:",
      en: "Name:",
      fr: "Nom :"
    },

    "Imèl:": {
      ht: "Imèl:",
      en: "Email:",
      fr: "E-mail :"
    },

    "Telefòn:": {
      ht: "Telefòn:",
      en: "Phone:",
      fr: "Téléphone :"
    },

    "📢 Pibliye yon travay": {
      ht: "📢 Pibliye yon travay",
      en: "📢 Post a Job",
      fr: "📢 Publier un emploi"
    },

    "Tit travay la": {
      ht: "Tit travay la",
      en: "Job Title",
      fr: "Titre du poste"
    },

    "Non konpayi an": {
      ht: "Non konpayi an",
      en: "Company Name",
      fr: "Nom de l'entreprise"
    },

    "Lokalizasyon": {
      ht: "Lokalizasyon",
      en: "Location",
      fr: "Localisation"
    },

    "Kalite travay": {
      ht: "Kalite travay",
      en: "Job Type",
      fr: "Type d'emploi"
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

    "Salè / Tarif (opsyonèl)": {
      ht: "Salè / Tarif (opsyonèl)",
      en: "Salary / Rate (optional)",
      fr: "Salaire / Tarif (facultatif)"
    },

    "Deskripsyon": {
      ht: "Deskripsyon",
      en: "Description",
      fr: "Description"
    },

    "Telefòn kontak": {
      ht: "Telefòn kontak",
      en: "Contact Phone",
      fr: "Téléphone de contact"
    },

    "📢 Pibliye Travay": {
      ht: "📢 Pibliye Travay",
      en: "📢 Post Job",
      fr: "📢 Publier l'emploi"
    },

    "💼 Travay mwen yo": {
      ht: "💼 Travay mwen yo",
      en: "💼 My Jobs",
      fr: "💼 Mes emplois"
    },

    "🚪 Dekonekte": {
      ht: "🚪 Dekonekte",
      en: "🚪 Logout",
      fr: "🚪 Déconnexion"
    },

    "EAGLE-J COMMUNITY": {
      ht: "EAGLE-J COMMUNITY",
      en: "EAGLE-J COMMUNITY",
      fr: "COMMUNAUTÉ EAGLE-J"
    },

    "Itilizatè": {
      ht: "Itilizatè",
      en: "Users",
      fr: "Utilisateurs"
    },

    "Manm kominote a": {
      ht: "Manm kominote a",
      en: "Community Members",
      fr: "Membres de la communauté"
    },

    "⏳ Ap chaje...": {
      ht: "⏳ Ap chaje...",
      en: "⏳ Loading...",
      fr: "⏳ Chargement..."
    },

    "Itilizatè yo ap chaje...": {
      ht: "Itilizatè yo ap chaje...",
      en: "Users are loading...",
      fr: "Chargement des utilisateurs..."
    },

    "👋 Pwofil mwen": {
      ht: "👋 Pwofil mwen",
      en: "👋 My Profile",
      fr: "👋 Mon profil"
    },

    "👤 Enfòmasyon mwen": {
      ht: "👤 Enfòmasyon mwen",
      en: "👤 My Information",
      fr: "👤 Mes informations"
    },

    "Kalite kont:": {
      ht: "Kalite kont:",
      en: "Account Type:",
      fr: "Type de compte :"
    },

    "➕ Poste yon Travay": {
      ht: "➕ Poste yon Travay",
      en: "➕ Post a Job",
      fr: "➕ Publier un emploi"
    },

    "Kreye kont ou pou chèche travay oswa poste travay.": {
      ht: "Kreye kont ou pou chèche travay oswa poste travay.",
      en: "Create your account to find jobs or post jobs.",
      fr: "Créez votre compte pour chercher ou publier des emplois."
    },

    "NON": {
      ht: "NON",
      en: "FIRST NAME",
      fr: "PRÉNOM"
    },

    "Non": {
      ht: "Non",
      en: "First Name",
      fr: "Prénom"
    },

    "SIYATI": {
      ht: "SIYATI",
      en: "LAST NAME",
      fr: "NOM"
    },

    "Siyati": {
      ht: "Siyati",
      en: "Last Name",
      fr: "Nom"
    },

    "EMAIL": {
      ht: "EMAIL",
      en: "EMAIL",
      fr: "E-MAIL"
    },

    "TELEFON": {
      ht: "TELEFON",
      en: "PHONE",
      fr: "TÉLÉPHONE"
    },

    "KALITE KONT": {
      ht: "KALITE KONT",
      en: "ACCOUNT TYPE",
      fr: "TYPE DE COMPTE"
    },

    "Kalite kont": {
      ht: "Kalite kont",
      en: "Account Type",
      fr: "Type de compte"
    },

    "Chwazi...": {
      ht: "Chwazi...",
      en: "Choose...",
      fr: "Choisissez..."
    },

    "MODPAS": {
      ht: "MODPAS",
      en: "PASSWORD",
      fr: "MOT DE PASSE"
    },

    "KONFIME MODPAS": {
      ht: "KONFIME MODPAS",
      en: "CONFIRM PASSWORD",
      fr: "CONFIRMER LE MOT DE PASSE"
    },

    "Konfime modpas": {
      ht: "Konfime modpas",
      en: "Confirm Password",
      fr: "Confirmer le mot de passe"
    },

    "✅ Kreye Kont": {
      ht: "✅ Kreye Kont",
      en: "✅ Create Account",
      fr: "✅ Créer un compte"
    },

    "Ou deja gen kont?": {
      ht: "Ou deja gen kont?",
      en: "Already have an account?",
      fr: "Vous avez déjà un compte ?"
    },

    "Konekte moun, travay, biznis ak sèvis ant Ayiti ak Bahamas.": {
      ht: "Konekte moun, travay, biznis ak sèvis ant Ayiti ak Bahamas.",
      en: "Connect people, jobs, businesses, and services between Haiti and The Bahamas.",
      fr: "Connectez les personnes, les emplois, les entreprises et les services entre Haïti et les Bahamas."
    },

    "WORLDWIDE • OPPORTUNITIES • CONNECTIONS": {
      ht: "MOND • OPÒTINITE • KONEKSYON",
      en: "WORLDWIDE • OPPORTUNITIES • CONNECTIONS",
      fr: "MONDE • OPPORTUNITÉS • CONNEXIONS"
    },

    "CONNECT.": {
      ht: "KONEKTE.",
      en: "CONNECT.",
      fr: "CONNECTEZ."
    },

    "DISCOVER.": {
      ht: "DEKOUVRI.",
      en: "DISCOVER.",
      fr: "DÉCOUVREZ."
    },

    "GROW.": {
      ht: "GRANDI.",
      en: "GROW.",
      fr: "GRANDISSEZ."
    },

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
    }

  };


  /* =======================================================
     BUILD REVERSE MAP
     ======================================================= */

  const reverseMap = {
    ht: {},
    en: {},
    fr: {}
  };

  function normalize(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  Object.keys(textMap).forEach(function (source) {

    const row = textMap[source];

    SUPPORTED.forEach(function (lang) {

      if (row[lang]) {
        reverseMap[lang][normalize(row[lang])] = row;
      }

    });

  });


  /* =======================================================
     GET LANGUAGE
     ======================================================= */

  function getLanguage() {

    const saved =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem(OLD_STORAGE_KEY) ||
      DEFAULT_LANGUAGE;

    return SUPPORTED.includes(saved)
      ? saved
      : DEFAULT_LANGUAGE;
  }


  /* =======================================================
     TRANSLATE TAGGED ELEMENT
     ======================================================= */

  function translateElement(element, lang) {

    const dict =
      translations[lang] ||
      translations[DEFAULT_LANGUAGE];

    const key =
      element.getAttribute("data-i18n");

    if (
      key &&
      dict[key] !== undefined
    ) {
      element.textContent = dict[key];
    }


    const placeholderKey =
      element.getAttribute(
        "data-i18n-placeholder"
      );

    if (
      placeholderKey &&
      dict[placeholderKey] !== undefined
    ) {
      element.setAttribute(
        "placeholder",
        dict[placeholderKey]
      );
    }


    const titleKey =
      element.getAttribute(
        "data-i18n-title"
      );

    if (
      titleKey &&
      dict[titleKey] !== undefined
    ) {
      element.setAttribute(
        "title",
        dict[titleKey]
      );
    }

     }
     /* =======================================================
     TRANSLATE ATTRIBUTES
     ======================================================= */

  function translateAttributes(element, lang) {

    const dict =
      translations[lang] ||
      translations[DEFAULT_LANGUAGE];

    /* Placeholder */
    const placeholderKey =
      element.getAttribute("data-i18n-placeholder");

    if (
      placeholderKey &&
      dict[placeholderKey] !== undefined
    ) {
      element.setAttribute(
        "placeholder",
        dict[placeholderKey]
      );
    }

    /* Title */
    const titleKey =
      element.getAttribute("data-i18n-title");

    if (
      titleKey &&
      dict[titleKey] !== undefined
    ) {
      element.setAttribute(
        "title",
        dict[titleKey]
      );
    }

    /* aria-label */
    const ariaKey =
      element.getAttribute("data-i18n-aria");

    if (
      ariaKey &&
      dict[ariaKey] !== undefined
    ) {
      element.setAttribute(
        "aria-label",
        dict[ariaKey]
      );
    }

  }


  /* =======================================================
     TRANSLATE UNTAGGED TEXT
     ======================================================= */

  function translateUnTaggedText(element, lang) {

    if (!element) return;

    /*
      Nou pa modifye eleman ki gen data-i18n.
      Sa anpeche sistèm nan tradui menm bagay la 2 fwa.
    */

    if (
      element.nodeType === Node.ELEMENT_NODE &&
      element.hasAttribute("data-i18n")
    ) {
      return;
    }

    const row =
      reverseMap[lang] || {};

    const walker =
      document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {

            const parent =
              node.parentElement;

            if (!parent) {
              return NodeFilter.FILTER_REJECT;
            }

            /*
              Pa manyen script/style/code
            */
            const tag =
              parent.tagName.toLowerCase();

            if (
              tag === "script" ||
              tag === "style" ||
              tag === "noscript" ||
              tag === "code" ||
              tag === "pre"
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            /*
              Pa tradui espas vid
            */
            const original =
              normalize(node.nodeValue);

            if (!original) {
              return NodeFilter.FILTER_REJECT;
            }

            /*
              Si tèks la egziste nan lang aktyèl la,
              chèche liy korespondan li.
            */
            if (row[original]) {
              return NodeFilter.FILTER_ACCEPT;
            }

            return NodeFilter.FILTER_REJECT;
          }
        }
      );


    const nodes = [];

    let current;

    while (
      (current = walker.nextNode())
    ) {
      nodes.push(current);
    }


    nodes.forEach(function (node) {

      const original =
        normalize(node.nodeValue);

      const translation =
        row[original];

      if (
        translation &&
        translation[lang]
      ) {

        node.nodeValue =
          node.nodeValue.replace(
            original,
            translation[lang]
          );

      }

    });

  }


  /* =======================================================
     TRANSLATE SELECT OPTIONS
     ======================================================= */

  function translateOptions(lang) {

    const row =
      reverseMap[lang] || {};

    document
      .querySelectorAll("option")
      .forEach(function (option) {

        const original =
          normalize(
            option.textContent
          );

        if (
          row[original] &&
          row[original][lang]
        ) {
          option.textContent =
            row[original][lang];
        }

      });

  }


  /* =======================================================
     APPLY LANGUAGE
     ======================================================= */

  function applyLanguage(lang) {

    if (
      !SUPPORTED.includes(lang)
    ) {
      lang = DEFAULT_LANGUAGE;
    }

    /*
      Mete lang sou HTML la
    */
    document.documentElement
      .setAttribute(
        "lang",
        lang
      );


    /*
      Sove lang chwazi a
    */
    localStorage.setItem(
      STORAGE_KEY,
      lang
    );

    /*
      Kenbe ansyen sistèm nan
      konpatib tou.
    */
    localStorage.setItem(
      OLD_STORAGE_KEY,
      lang
    );


    /*
      1. Eleman ki gen data-i18n
    */
    document
      .querySelectorAll(
        "[data-i18n]"
      )
      .forEach(function (element) {

        translateElement(
          element,
          lang
        );

      });


    /*
      2. Placeholder / title / aria-label
    */
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


    /*
      3. Tèks ki pa gen data-i18n
    */
    translateUnTaggedText(
      document.body,
      lang
    );


    /*
      4. Select options
    */
    translateOptions(lang);


    /*
      5. Mete lang aktyèl la sou tout
         dropdown language selector
    */
    document
      .querySelectorAll(
        ".language-selector, #languageSelector, #language-select, select[data-language]"
      )
      .forEach(function (selector) {

        if (
          selector.tagName === "SELECT"
        ) {
          selector.value = lang;
        }

      });


    /*
      6. Evite JavaScript lòt paj yo
         pèdi lang aktyèl la.
    */
    window.currentLanguage =
      lang;

    window.selectedLanguage =
      lang;


    /*
      Event pou lòt script yo
      ka konnen lang lan chanje.
    */
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

  }


  /* =======================================================
     CHANGE LANGUAGE
     ======================================================= */

  function changeLanguage(lang) {

    if (
      !SUPPORTED.includes(lang)
    ) {
      console.warn(
        "Unsupported language:",
        lang
      );

      return;
    }

    applyLanguage(lang);

  }


  /* =======================================================
     GLOBAL FUNCTION
     ======================================================= */

  window.changeLanguage =
    changeLanguage;

  window.applyLanguage =
    applyLanguage;

  window.getLanguage =
    getLanguage;


  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  function initializeLanguage() {

    const lang =
      getLanguage();

    applyLanguage(lang);

  }


  /*
    Lè DOM lan pare.
  */
  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeLanguage
    );

  } else {

    initializeLanguage();

  }


  /* =======================================================
     MUTATION OBSERVER
     =======================================================

     Sa pèmèt nouvo eleman ki parèt
     apre yon fetch / Supabase / AJAX
     resevwa lang lan tou.

     IMPORTANT:
     Nou pa rele applyLanguage()
     andedan observer la.

     Sa anpeche infinite loop.
     ======================================================= */

  let observerTimer = null;

  const observer =
    new MutationObserver(
      function (mutations) {

        let shouldTranslate = false;

        mutations.forEach(
          function (mutation) {

            /*
              Si se sèlman yon
              attribute ki chanje,
              pa relanse tradiksyon an.
            */
            if (
              mutation.type ===
              "childList" &&
              mutation.addedNodes.length
            ) {
              shouldTranslate = true;
            }

          }
        );


        if (!shouldTranslate) {
          return;
        }


        /*
          Pa kouri twòp fwa youn dèyè lòt.
        */
        clearTimeout(
          observerTimer
        );


        observerTimer =
          setTimeout(
            function () {

              const lang =
                getLanguage();


              /*
                Sèlman tradui nouvo
                tèks ki bezwen li.
              */
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


              translateUnTaggedText(
                document.body,
                lang
              );


              translateOptions(
                lang
              );

            },
            100
          );

      }
    );


  /*
    Kòmanse observer la
  */
  if (document.body) {

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

  }


})();
   

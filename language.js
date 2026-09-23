/* =========================================================
   EAGLE-J CONNECT — GLOBAL LANGUAGE SYSTEM
   Kreyòl (ht) • English (en) • Français (fr)

   FINAL GLOBAL VERSION
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const STORAGE_KEY = "eagleJConnectLanguage";
  const OLD_STORAGE_KEY = "selectedLanguage";

  const DEFAULT_LANGUAGE = "ht";
  const SUPPORTED = ["ht", "en", "fr"];

  let observerTimer = null;
  let isApplyingLanguage = false;


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

      "services-title":
        "Sèvis Eagle-J Connect",

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

      "create-account":
        "Create Account",

      "find-job":
        "Find Jobs",

      "create-ad":
        "Create a Listing",

      "stats-jobs":
        "Jobs",

      "stats-business":
        "Businesses",

      "stats-users":
        "Users",

      "stats-ads":
        "Listings",

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
     NORMALIZE TEXT
     ======================================================= */

  function normalize(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }


  /* =======================================================
     BUILD COMPLETE REVERSE MAP
     =======================================================

     Diferans ak ansyen vèsyon an:
     Nou chèche tèks la nan HT, EN oswa FR.
     Konsa:

     HT → EN → FR → HT

     ap toujou mache.
     ======================================================= */

  const reverseMap = {
    ht: {},
    en: {},
    fr: {}
  };

  Object.keys(textMap).forEach(function (source) {

    const row = textMap[source];

    SUPPORTED.forEach(function (lang) {

      if (row[lang]) {

        reverseMap[lang][
          normalize(row[lang])
        ] = row;

      }

    });

  });


  /* =======================================================
     FIND TRANSLATION ROW
     ======================================================= */

  function findTranslationRow(text) {

    const normalized =
      normalize(text);

    if (!normalized) {
      return null;
    }

    for (
      let i = 0;
      i < SUPPORTED.length;
      i++
    ) {

      const lang =
        SUPPORTED[i];

      if (
        reverseMap[lang] &&
        reverseMap[lang][normalized]
      ) {
        return reverseMap[lang][normalized];
      }

    }

    return null;
  }


  /* =======================================================
     GET CURRENT LANGUAGE
     ======================================================= */

  function getLanguage() {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      ) ||
      localStorage.getItem(
        OLD_STORAGE_KEY
      ) ||
      DEFAULT_LANGUAGE;

    return SUPPORTED.includes(saved)
      ? saved
      : DEFAULT_LANGUAGE;
  }


  /* =======================================================
     TRANSLATE TAGGED ELEMENT
     ======================================================= */

  function translateElement(
    element,
    lang
  ) {

    if (!element) {
      return;
    }

    const dict =
      translations[lang] ||
      translations[DEFAULT_LANGUAGE];


    /* -----------------------------------------------------
       MAIN TEXT
       ----------------------------------------------------- */

    const key =
      element.getAttribute(
        "data-i18n"
      );

    if (
      key &&
      dict[key] !== undefined
    ) {

      element.textContent =
        dict[key];

    }


    /* -----------------------------------------------------
       PLACEHOLDER
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       TITLE
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       ARIA LABEL
       ----------------------------------------------------- */

    const ariaKey =
      element.getAttribute(
        "data-i18n-aria"
      );

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
     TRANSLATE ATTRIBUTES
     ======================================================= */

  function translateAttributes(
    element,
    lang
  ) {

    if (!element) {
      return;
    }

    const dict =
      translations[lang] ||
      translations[DEFAULT_LANGUAGE];


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


    const ariaKey =
      element.getAttribute(
        "data-i18n-aria"
      );

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
     SHOULD IGNORE ELEMENT?
     ======================================================= */

  function shouldIgnoreElement(element) {

    if (!element) {
      return true;
    }

    const tag =
      element.tagName
        ? element.tagName.toLowerCase()
        : "";

    return (
      tag === "script" ||
      tag === "style" ||
      tag === "noscript" ||
      tag === "code" ||
      tag === "pre"
    );

  }


  /* =======================================================
     TRANSLATE UNTAGGED TEXT
     ======================================================= */

  function translateUnTaggedText(
    root,
    lang
  ) {

    if (!root) {
      return;
    }

    /*
      Pa tradui tèks andedan script,
      style, code, pre, elatriye.
    */

    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {

            const parent =
              node.parentElement;

            if (!parent) {
              return NodeFilter.FILTER_REJECT;
            }

            if (
              shouldIgnoreElement(parent)
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            /*
              Si parent la gen data-i18n,
              translateElement() ap okipe li.
            */
            if (
              parent.hasAttribute(
                "data-i18n"
              )
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            const original =
              normalize(
                node.nodeValue
              );

            if (!original) {
              return NodeFilter.FILTER_REJECT;
            }

            /*
              Chèche tèks la nan tout
              3 lang yo.
            */
            const row =
              findTranslationRow(
                original
              );

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

    let current;

    while (
      (current = walker.nextNode())
    ) {

      nodes.push(current);

    }


    nodes.forEach(function (node) {

      const original =
        normalize(
          node.nodeValue
        );

      const row =
        findTranslationRow(
          original
        );

      if (
        !row ||
        row[lang] === undefined
      ) {
        return;
      }

      const translated =
        row[lang];

      /*
        Kenbe espas ki te devan/dèyè
        tèks la pou layout paj la pa chanje.
      */

      const raw =
        String(node.nodeValue);

      const leading =
        raw.match(/^\s*/)?.[0] || "";

      const trailing =
        raw.match(/\s*$/)?.[0] || "";

      node.nodeValue =
        leading +
        translated +
        trailing;

    });

  }


  /* =======================================================
     TRANSLATE SELECT OPTIONS
     ======================================================= */

  function translateOptions(lang) {

    document
      .querySelectorAll("option")
      .forEach(function (option) {

        const original =
          normalize(
            option.textContent
          );

        const row =
          findTranslationRow(
            original
          );

        if (
          row &&
          row[lang] !== undefined
        ) {

          option.textContent =
            row[lang];

        }

      });

  }


  /* =======================================================
     TRANSLATE LANGUAGE SELECTORS
     ======================================================= */

  function updateLanguageSelectors(
    lang
  ) {

    document
      .querySelectorAll(
        ".language-selector, #languageSelector, #language-select, select[data-language]"
      )
      .forEach(function (selector) {

        if (
          selector.tagName ===
          "SELECT"
        ) {

          selector.value =
            lang;

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

      lang =
        DEFAULT_LANGUAGE;

    }


    /*
      Protection kont infinite loop.
    */

    if (isApplyingLanguage) {
      return;
    }

    isApplyingLanguage = true;


    try {

      /* ---------------------------------------------------
         HTML LANGUAGE
         --------------------------------------------------- */

      document.documentElement
        .setAttribute(
          "lang",
          lang
        );


      /* ---------------------------------------------------
         SAVE LANGUAGE
         --------------------------------------------------- */

      localStorage.setItem(
        STORAGE_KEY,
        lang
      );

      localStorage.setItem(
        OLD_STORAGE_KEY,
        lang
      );


      /* ---------------------------------------------------
         DATA-I18N
         --------------------------------------------------- */

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


      /* ---------------------------------------------------
         ATTRIBUTES
         --------------------------------------------------- */

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


      /* ---------------------------------------------------
         UNTAGGED TEXT
         --------------------------------------------------- */

      if (document.body) {

        translateUnTaggedText(
          document.body,
          lang
        );

      }


      /* ---------------------------------------------------
         OPTIONS
         --------------------------------------------------- */

      translateOptions(
        lang
      );


      /* ---------------------------------------------------
         LANGUAGE SELECTORS
         --------------------------------------------------- */

      updateLanguageSelectors(
        lang
      );


      /* ---------------------------------------------------
         GLOBAL VARIABLES
         --------------------------------------------------- */

      window.currentLanguage =
        lang;

      window.selectedLanguage =
        lang;


    } finally {

      isApplyingLanguage =
        false;

    }


    /* =====================================================
       NOTIFY OTHER SCRIPTS
       ===================================================== */

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

    } catch (error) {

      /*
        Older browser compatibility.
      */

      const event =
        document.createEvent(
          "Event"
        );

      event.initEvent(
        "languageChanged",
        true,
        true
      );

      document.dispatchEvent(
        event
      );

    }

  }


  /* =======================================================
     CHANGE LANGUAGE
     ======================================================= */

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

    applyLanguage(
      lang
    );

  }


  /* =======================================================
     GLOBAL FUNCTIONS
     ======================================================= */

  window.changeLanguage =
    changeLanguage;

  window.applyLanguage =
    applyLanguage;

  window.getLanguage =
    getLanguage;


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function initializeLanguage() {

    const lang =
      getLanguage();

    applyLanguage(
      lang
    );

  }


  if (
    document.readyState ===
    "loading"
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


  /* =======================================================
     MUTATION OBSERVER
     =======================================================

     Supabase / fetch / AJAX ka ka kreye
     nouvo eleman apre paj la fin chaje.

     Observer sa a pèmèt nouvo tèks yo
     resevwa lang aktyèl la.

     Li pa rele applyLanguage(),
     konsa li pa kreye infinite loop.
     ======================================================= */

  function startLanguageObserver() {

    if (
      typeof MutationObserver ===
      "undefined"
    ) {
      return;
    }

    if (!document.body) {
      return;
    }


    const observer =
      new MutationObserver(
        function (mutations) {

          let hasNewNodes = false;

          for (
            let i = 0;
            i < mutations.length;
            i++
          ) {

            const mutation =
              mutations[i];

            if (
              mutation.type ===
                "childList" &&
              mutation.addedNodes &&
              mutation.addedNodes.length
            ) {

              hasNewNodes = true;
              break;

            }

          }


          if (!hasNewNodes) {
            return;
          }


          clearTimeout(
            observerTimer
          );


          observerTimer =
            setTimeout(
              function () {

                /*
                  Pa fè anyen si sistèm nan
                  deja ap aplike lang lan.
                */

                if (
                  isApplyingLanguage
                ) {
                  return;
                }


                const lang =
                  getLanguage();


                /*
                  Nouvo eleman ki gen
                  data-i18n.
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


                /*
                  Nouvo attributes.
                */

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


                /*
                  Nouvo tèks.
                */

                if (
                  document.body
                ) {

                  translateUnTaggedText(
                    document.body,
                    lang
                  );

                }


                /*
                  Nouvo options.
                */

                translateOptions(
                  lang
                );


                /*
                  Selector language.
                */

                updateLanguageSelectors(
                  lang
                );

              },
              100
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


    /*
      Kenbe observer la disponib
      pou debug si sa nesesè.
    */

    window.eagleJLanguageObserver =
      observer;

  }


  /* =======================================================
     START OBSERVER
     ======================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startLanguageObserver,
      {
        once: true
      }
    );

  } else {

    startLanguageObserver();

  }


  /* =======================================================
     DEBUG / PUBLIC OBJECT
     ======================================================= */

  window.EagleJLanguage = {

    supported: SUPPORTED.slice(),

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

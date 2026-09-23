/* =========================================================
   EAGLE-J CONNECT — GLOBAL LANGUAGE SYSTEM
   Kreyòl (ht) • English (en) • Français (fr)
   ========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "eagleJConnectLanguage";
  const OLD_STORAGE_KEY = "selectedLanguage";

  const DEFAULT_LANGUAGE = "ht";
  const SUPPORTED = ["ht", "en", "fr"];

  let isApplying = false;
  let observerTimer = null;

  /* =========================================================
     KEY-BASED TRANSLATIONS
     ========================================================= */

  const translations = {

    /* NAVIGATION */
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

    /* HERO */
    "hero-text": {
      ht: "Konekte ak moun, dekouvri opòtinite, devlope rezo ou, epi kreye nouvo posiblite.",
      en: "Connect with people, discover opportunities, grow your network, and create new possibilities.",
      fr: "Connectez-vous avec les gens, découvrez des opportunités, développez votre réseau et créez de nouvelles possibilités."
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
      ht: "Kreye yon Anons",
      en: "Create a Listing",
      fr: "Créer une annonce"
    },

    "stats-jobs": {
      ht: "Travay",
      en: "Jobs",
      fr: "Emplois"
    },

    "stats-business": {
      ht: "Biznis",
      en: "Businesses",
      fr: "Entreprises"
    },

    "stats-users": {
      ht: "Itilizatè",
      en: "Users",
      fr: "Utilisateurs"
    },

    "stats-ads": {
      ht: "Anons",
      en: "Listings",
      fr: "Annonces"
    },

    "services-title": {
      ht: "Sèvis Eagle-J Connect",
      en: "Eagle-J Connect Services",
      fr: "Services Eagle-J Connect"
    },

    "footer-text": {
      ht: "Konekte ak moun, dekouvri opòtinite epi grandi ansanm.",
      en: "Connect with people, discover opportunities, and grow together.",
      fr: "Connectez-vous avec les gens, découvrez des opportunités et grandissez ensemble."
    }
  };


  /* =========================================================
     EXACT VISIBLE TEXT
     ========================================================= */

  const textMap = {

    /* BRAND / LANGUAGE */

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

    "EAGLE-J COMMUNITY": {
      ht: "EAGLE-J COMMUNITY",
      en: "EAGLE-J COMMUNITY",
      fr: "COMMUNAUTÉ EAGLE-J"
    },

    "EAGLE-J MARKETPLACE": {
      ht: "EAGLE-J MARKETPLACE",
      en: "EAGLE-J MARKETPLACE",
      fr: "MARCHÉ EAGLE-J"
    },

    "MARKETPLACE": {
      ht: "MARKETPLACE",
      en: "MARKETPLACE",
      fr: "MARCHÉ"
    },

    /* HOMEPAGE */

    "WORLDWIDE • OPPORTUNITIES • CONNECTIONS": {
      ht: "MOND • OPÒTINITE • KONEKSYON",
      en: "WORLDWIDE • OPPORTUNITIES • CONNECTIONS",
      fr: "MONDE • OPPORTUNITÉS • CONNEXIONS"
    },

    "CONNECT. DISCOVER. GROW.": {
      ht: "KONEKTE. DEKOUVRI. GRANDI.",
      en: "CONNECT. DISCOVER. GROW.",
      fr: "CONNECTEZ. DÉCOUVREZ. GRANDISSEZ."
    },

    "Have a business, service, or professional offering?": {
      ht: "Èske ou gen yon biznis, sèvis oswa òf pwofesyonèl?",
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
      fr: "Parcourez les emplois, entreprises, membres et annonces de différents endroits."
    },

    "💼 Jobs": {
      ht: "💼 Travay",
      en: "💼 Jobs",
      fr: "💼 Emplois"
    },

    "View jobs →": {
      ht: "Gade travay →",
      en: "View jobs →",
      fr: "Voir les emplois →"
    },

    "🛍️ Businesses": {
      ht: "🛍️ Biznis",
      en: "🛍️ Businesses",
      fr: "🛍️ Entreprises"
    },

    "Explore businesses →": {
      ht: "Eksplore biznis →",
      en: "Explore businesses →",
      fr: "Découvrir les entreprises →"
    },

    "👥 Members": {
      ht: "👥 Manm",
      en: "👥 Members",
      fr: "👥 Membres"
    },

    "View members →": {
      ht: "Gade manm →",
      en: "View members →",
      fr: "Voir les membres →"
    },

    "📢 Listings": {
      ht: "📢 Anons",
      en: "📢 Listings",
      fr: "📢 Annonces"
    },

    "View listings →": {
      ht: "Gade anons →",
      en: "View listings →",
      fr: "Voir les annonces →"
    },

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
      ht: "Chèche opòtinite selon tit, konpayi, lokalizasyon ak kalite travay.",
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
      fr: "02 • ENTREPRISES"
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
      ht: "Pwomote biznis ou, sèvis ou, konpetans pwofesyonèl ou, pwodwi ou oswa byen ou.",
      en: "Promote your business, service, professional skills, products, or property.",
      fr: "Promouvez votre entreprise, service, compétences professionnelles, produits ou propriété."
    },

    "Create a Listing →": {
      ht: "Kreye yon Anons →",
      en: "Create a Listing →",
      fr: "Créer une annonce →"
    },

    /* HOW IT WORKS */

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
      ht: "Kreye pwofil ou epi jwenn aksè ak opòtinite yo.",
      en: "Build your profile and unlock access to opportunities.",
      fr: "Créez votre profil et accédez aux opportunités."
    },

    "Search or Publish": {
      ht: "Chèche oswa Pibliye",
      en: "Search or Publish",
      fr: "Rechercher ou publier"
    },

    "Find a job, discover a service, or publish your own offering.": {
      ht: "Jwenn yon travay, dekouvri yon sèvis oswa pibliye sa w ap ofri.",
      en: "Find a job, discover a service, or publish your own offering.",
      fr: "Trouvez un emploi, découvrez un service ou publiez votre propre offre."
    },

    "Connect Directly": {
      ht: "Konekte Dirèkteman",
      en: "Connect Directly",
      fr: "Connectez-vous directement"
    },

    "Reach people, businesses, and employers connected to your goals.": {
      ht: "Kontakte moun, biznis ak anplwayè ki konekte ak objektif ou.",
      en: "Reach people, businesses, and employers connected to your goals.",
      fr: "Contactez les personnes, entreprises et employeurs liés à vos objectifs."
    },

    /* CTA */

    "Your next opportunity can start with one connection.": {
      ht: "Pwochen opòtinite ou a ka kòmanse ak yon sèl koneksyon.",
      en: "Your next opportunity can start with one connection.",
      fr: "Votre prochaine opportunité peut commencer par une seule connexion."
    },

    "Create your account and start discovering what is available around you and around the world.": {
      ht: "Kreye kont ou epi kòmanse dekouvri sa ki disponib bò kote w ak atravè mond lan.",
      en: "Create your account and start discovering what is available around you and around the world.",
      fr: "Créez votre compte et commencez à découvrir ce qui est disponible autour de vous et dans le monde."
    },

    "Contact Us": {
      ht: "Kontakte Nou",
      en: "Contact Us",
      fr: "Contactez-nous"
    },

    /* LOGIN */

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

    /* COMMON */

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

    "📢 Kreye yon Anons": {
      ht: "📢 Kreye yon Anons",
      en: "📢 Create a Listing",
      fr: "📢 Créer une annonce"
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

    "Telefòn": {
      ht: "Telefòn",
      en: "Phone",
      fr: "Téléphone"
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

    "Non ou": {
      ht: "Non ou",
      en: "Your Name",
      fr: "Votre nom"
    },

    "Non": {
      ht: "Non",
      en: "First Name",
      fr: "Prénom"
    },

    "Siyati": {
      ht: "Siyati",
      en: "Last Name",
      fr: "Nom de famille"
    },

    "Dat": {
      ht: "Dat",
      en: "Date",
      fr: "Date"
    },

    "Aksyon": {
      ht: "Aksyon",
      en: "Action",
      fr: "Action"
    },

    "Status": {
      ht: "Status",
      en: "Status",
      fr: "Statut"
    },

    "Kalite": {
      ht: "Kalite",
      en: "Type",
      fr: "Type"
    },

    "Kategori": {
      ht: "Kategori",
      en: "Category",
      fr: "Catégorie"
    },

    "Pri / Tarif": {
      ht: "Pri / Tarif",
      en: "Price / Rate",
      fr: "Prix / Tarif"
    },

    "Chwazi": {
      ht: "Chwazi",
      en: "Select",
      fr: "Sélectionner"
    },

    "Chwazi...": {
      ht: "Chwazi...",
      en: "Choose...",
      fr: "Choisissez..."
    },

    /* JOB TYPES */

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

    /* JOBS */

    "💼 Travay mwen yo": {
      ht: "💼 Travay mwen yo",
      en: "💼 My Jobs",
      fr: "💼 Mes emplois"
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

    "Kalite travay": {
      ht: "Kalite travay",
      en: "Job Type",
      fr: "Type d'emploi"
    },

    "Salè / Tarif (opsyonèl)": {
      ht: "Salè / Tarif (opsyonèl)",
      en: "Salary / Rate (optional)",
      fr: "Salaire / Tarif (facultatif)"
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

    "🔎 Chèche Travay": {
      ht: "🔎 Chèche Travay",
      en: "🔎 Find Jobs",
      fr: "🔎 Chercher un emploi"
    },

    "Opòtinite Travay": {
      ht: "Opòtinite Travay",
      en: "Job Opportunities",
      fr: "Opportunités d'emploi"
    },

    "Travay ki disponib": {
      ht: "Travay ki disponib",
      en: "Available Jobs",
      fr: "Emplois disponibles"
    },

    "Gade Travay": {
      ht: "Gade Travay",
      en: "View Jobs",
      fr: "Voir les emplois"
    },

    "⏳ Ap chaje travay yo...": {
      ht: "⏳ Ap chaje travay yo...",
      en: "⏳ Loading jobs...",
      fr: "⏳ Chargement des emplois..."
    },

    /* BUSINESS */

    "Non biznis la": {
      ht: "Non biznis la",
      en: "Business Name",
      fr: "Nom de l'entreprise"
    },

    "Ki kalite anons?": {
      ht: "Ki kalite anons?",
      en: "Listing Type",
      fr: "Type d'annonce"
    },

    "Chwazi kalite anons": {
      ht: "Chwazi kalite anons",
      en: "Choose listing type",
      fr: "Choisissez le type d'annonce"
    },

    "🛍️ Biznis / Konpayi": {
      ht: "🛍️ Biznis / Konpayi",
      en: "🛍️ Business / Company",
      fr: "🛍️ Entreprise / Société"
    },

    "👨🏾‍🔧 Pwofesyonèl": {
      ht: "👨🏾‍🔧 Pwofesyonèl",
      en: "👨🏾‍🔧 Professional",
      fr: "👨🏾‍🔧 Professionnel"
    },

    "🏠 Byen / Pwopriyete": {
      ht: "🏠 Byen / Pwopriyete",
      en: "🏠 Property / Real Estate",
      fr: "🏠 Bien / Propriété"
    },

    "📢 Pibliye Anons": {
      ht: "📢 Pibliye Anons",
      en: "📢 Publish Listing",
      fr: "📢 Publier l'annonce"
    },

    "📸 Foto (1 foto, max 5MB)": {
      ht: "📸 Foto (1 foto, max 5MB)",
      en: "📸 Photo (1 photo, max 5MB)",
      fr: "📸 Photo (1 photo, max 5 Mo)"
    },

    /* CATEGORIES */

    "🍽 Restoran": {
      ht: "🍽 Restoran",
      en: "🍽 Restaurant",
      fr: "🍽 Restaurant"
    },

    "🛒 Komès": {
      ht: "🛒 Komès",
      en: "🛒 Retail",
      fr: "🛒 Commerce"
    },

    "🔧 Sèvis jeneral": {
      ht: "🔧 Sèvis jeneral",
      en: "🔧 General Services",
      fr: "🔧 Services généraux"
    },

    "🏗️ Konstriksyon": {
      ht: "🏗️ Konstriksyon",
      en: "🏗️ Construction",
      fr: "🏗️ Construction"
    },

    "🚗 Transpò": {
      ht: "🚗 Transpò",
      en: "🚗 Transportation",
      fr: "🚗 Transport"
    },

    "🧹 Netwayaj": {
      ht: "🧹 Netwayaj",
      en: "🧹 Cleaning",
      fr: "🧹 Nettoyage"
    },

    "🔧 Reparasyon": {
      ht: "🔧 Reparasyon",
      en: "🔧 Repairs",
      fr: "🔧 Réparation"
    },

    "🚰 Plonbri": {
      ht: "🚰 Plonbri",
      en: "🚰 Plumbing",
      fr: "🚰 Plomberie"
    },

    "⚡ Elektrisite": {
      ht: "⚡ Elektrisite",
      en: "⚡ Electrical",
      fr: "⚡ Électricité"
    },

    "💄 Beauty / Bote": {
      ht: "💄 Beauty / Bote",
      en: "💄 Beauty",
      fr: "💄 Beauté"
    },

    "🍔 Manje": {
      ht: "🍔 Manje",
      en: "🍔 Food",
      fr: "🍔 Alimentation"
    },

    "💻 Digital Services": {
      ht: "💻 Digital Services",
      en: "💻 Digital Services",
      fr: "💻 Services numériques"
    },

    "💻 IT / Teknoloji": {
      ht: "💻 IT / Teknoloji",
      en: "💻 IT / Technology",
      fr: "💻 Informatique / Technologie"
    },

    "👗 Kouti / Rad": {
      ht: "👗 Kouti / Rad",
      en: "👗 Fashion / Clothing",
      fr: "👗 Mode / Vêtements"
    },

    "💇🏾 Bote / Barber": {
      ht: "💇🏾 Bote / Barber",
      en: "💇🏾 Beauty / Barber",
      fr: "💇🏾 Beauté / Barbier"
    },

    "🏠 Imobilye": {
      ht: "🏠 Imobilye",
      en: "🏠 Real Estate",
      fr: "🏠 Immobilier"
    },

    "🚗 Machin / Veyikil": {
      ht: "🚗 Machin / Veyikil",
      en: "🚗 Cars / Vehicles",
      fr: "🚗 Voitures / Véhicules"
    },

    "📦 Lòt": {
      ht: "📦 Lòt",
      en: "📦 Other",
      fr: "📦 Autre"
    },

    /* ADMIN */

    "🛡️ Dashboard Administratè": {
      ht: "🛡️ Dashboard Administratè",
      en: "🛡️ Administrator Dashboard",
      fr: "🛡️ Tableau de bord administrateur"
    },

    "STATISTICS": {
      ht: "STATISTICS",
      en: "STATISTICS",
      fr: "STATISTIQUES"
    },

    "Travay pou valide": {
      ht: "Travay pou valide",
      en: "Jobs to Review",
      fr: "Emplois à valider"
    },

    "Anons pou valide": {
      ht: "Anons pou valide",
      en: "Listings to Review",
      fr: "Annonces à valider"
    },

    "Travay piblik": {
      ht: "Travay piblik",
      en: "Public Jobs",
      fr: "Emplois publics"
    },

    "Anons piblik": {
      ht: "Anons piblik",
      en: "Public Listings",
      fr: "Annonces publiques"
    },

    "Kont dezaktive": {
      ht: "Kont dezaktive",
      en: "Deactivated Accounts",
      fr: "Comptes désactivés"
    },

    "JOBS": {
      ht: "JOBS",
      en: "JOBS",
      fr: "EMPLOIS"
    },

    "⏳ Pending": {
      ht: "⏳ Pending",
      en: "⏳ Pending",
      fr: "⏳ En attente"
    },

    "✅ Piblik": {
      ht: "✅ Piblik",
      en: "✅ Public",
      fr: "✅ Public"
    },

    "❌ Refize": {
      ht: "❌ Refize",
      en: "❌ Rejected",
      fr: "❌ Refusé"
    },

    "🚫 Pa disponib": {
      ht: "🚫 Pa disponib",
      en: "🚫 Unavailable",
      fr: "🚫 Indisponible"
    },

    "Tout": {
      ht: "Tout",
      en: "All",
      fr: "Tous"
    },

    "🔄 Rafrechi": {
      ht: "🔄 Rafrechi",
      en: "🔄 Refresh",
      fr: "🔄 Actualiser"
    },

    "👥 Jere itilizatè yo": {
      ht: "👥 Jere itilizatè yo",
      en: "👥 Manage Users",
      fr: "👥 Gérer les utilisateurs"
    },

    "Tout kalite kont": {
      ht: "Tout kalite kont",
      en: "All account types",
      fr: "Tous les types de comptes"
    },

    "👷 Job Seeker": {
      ht: "👷 Job Seeker",
      en: "👷 Job Seeker",
      fr: "👷 Chercheur d'emploi"
    },

    "🛡️ Administratè": {
      ht: "🛡️ Administratè",
      en: "🛡️ Administrator",
      fr: "🛡️ Administrateur"
    },

    "Tout status": {
      ht: "Tout status",
      en: "All statuses",
      fr: "Tous les statuts"
    },

    "✅ Aktif": {
      ht: "✅ Aktif",
      en: "✅ Active",
      fr: "✅ Actif"
    },

    "🚫 Dezaktive": {
      ht: "🚫 Dezaktive",
      en: "🚫 Deactivated",
      fr: "🚫 Désactivé"
    },

    /* FOOTER */

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
    }
  };


  /* =========================================================
     REVERSE MAP
     ========================================================= */

  const reverseMap = {
    ht: {},
    en: {},
    fr: {}
  };

  function normalize(value) {
    return String(value || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

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


  /* =========================================================
     GET CURRENT LANGUAGE
     ========================================================= */

  function getLanguage() {

    let lang = null;

    try {
      lang =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(OLD_STORAGE_KEY);
    } catch (error) {
      lang = null;
    }

    if (!SUPPORTED.includes(lang)) {
      lang = DEFAULT_LANGUAGE;
    }

    return lang;
  }


  /* =========================================================
     SAVE LANGUAGE
     ========================================================= */

  function saveLanguage(lang) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        lang
      );

      localStorage.setItem(
        OLD_STORAGE_KEY,
        lang
      );

    } catch (error) {
      console.warn(
        "Eagle-J Connect: Could not save language."
      );
    }
  }


  /* =========================================================
     TRANSLATE DATA-I18N ELEMENTS
     ========================================================= */

  function translateElement(
    element,
    lang
  ) {

    if (!element) return;

    const key =
      element.getAttribute(
        "data-i18n"
      );

    if (key) {

      let translation = null;

      if (
        translations[lang] &&
        translations[lang][key] !== undefined
      ) {

        translation =
          translations[lang][key];

      } else {

        const row =
          textMap[key];

        if (
          row &&
          row[lang] !== undefined
        ) {

          translation =
            row[lang];

        }

      }

      if (
        translation !== null &&
        translation !== undefined
      ) {

        element.textContent =
          translation;

      }

    }

    /* PLACEHOLDER */

    const placeholderKey =
      element.getAttribute(
        "data-i18n-placeholder"
      );

    if (placeholderKey) {

      let translation = null;

      if (
        translations[lang] &&
        translations[lang][placeholderKey] !== undefined
      ) {

        translation =
          translations[lang][placeholderKey];

      } else if (
        textMap[placeholderKey] &&
        textMap[placeholderKey][lang] !== undefined
      ) {

        translation =
          textMap[placeholderKey][lang];

      }

      if (
        translation !== null &&
        translation !== undefined
      ) {

        element.setAttribute(
          "placeholder",
          translation
        );

      }

    }

    /* TITLE */

    const titleKey =
      element.getAttribute(
        "data-i18n-title"
      );

    if (titleKey) {

      const row =
        textMap[titleKey];

      if (
        row &&
        row[lang] !== undefined
      ) {

        element.setAttribute(
          "title",
          row[lang]
        );

      }

    }

    /* ARIA */

    const ariaKey =
      element.getAttribute(
        "data-i18n-aria"
      );

    if (ariaKey) {

      const row =
        textMap[ariaKey];

      if (
        row &&
        row[lang] !== undefined
      ) {

        element.setAttribute(
          "aria-label",
          row[lang]
        );

      }

    }

  }


  /* =========================================================
     ELEMENTS THAT SHOULD NOT BE AUTO TRANSLATED
     ========================================================= */

  function shouldIgnore(element) {

    if (!element) {
      return true;
    }

    const tag =
      element.tagName;

    if (
      tag === "SCRIPT" ||
      tag === "STYLE" ||
      tag === "NOSCRIPT" ||
      tag === "OPTION"
    ) {

      return true;

    }

    /*
      IMPORTANT:
      User-generated content must remain untouched.
    */

    if (
      element.closest &&
      element.closest(
        "[data-no-translate], [data-user-content]"
      )
    ) {

      return true;

    }

    return false;
  }


  /* =========================================================
     TRANSLATE UNTAGGED SYSTEM TEXT
     ========================================================= */

  function translateUnTaggedText(
    lang,
    root
  ) {

    if (!root) {
      return;
    }

    const lookup =
      reverseMap[lang];

    if (!lookup) {
      return;
    }

    const walker =
      document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {

          acceptNode: function (node) {

            if (!node.nodeValue) {
              return NodeFilter.FILTER_REJECT;
            }

            const parent =
              node.parentElement;

            if (!parent) {
              return NodeFilter.FILTER_REJECT;
            }

            if (
              shouldIgnore(parent)
            ) {

              return NodeFilter.FILTER_REJECT;

            }

            const value =
              normalize(
                node.nodeValue
              );

            if (!value) {
              return NodeFilter.FILTER_REJECT;
            }

            if (!lookup[value]) {
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
        normalize(
          textNode.nodeValue
        );

      const row =
        lookup[original];

      if (!row) {
        return;
      }

      const translated =
        row[lang];

      if (!translated) {
        return;
      }

      const raw =
        String(
          textNode.nodeValue
        );

      const leading =
        raw.match(/^\s*/)?.[0] || "";

      const trailing =
        raw.match(/\s*$/)?.[0] || "";

      textNode.nodeValue =
        leading +
        translated +
        trailing;

    });

  }


  /* =========================================================
     TRANSLATE ATTRIBUTES
     ========================================================= */

  function translateAttributes(lang) {

    const lookup =
      reverseMap[lang];

    if (!lookup) {
      return;
    }

    document
      .querySelectorAll(
        "input[placeholder], textarea[placeholder], button, a, label"
      )
      .forEach(function (element) {

        if (
          element.closest &&
          element.closest(
            "[data-no-translate]"
          )
        ) {

          return;

        }

        [
          "placeholder",
          "title",
          "aria-label"
        ].forEach(function (attribute) {

          const value =
            normalize(
              element.getAttribute(
                attribute
              )
            );

          if (!value) {
            return;
          }

          const row =
            lookup[value];

          if (
            row &&
            row[lang]
          ) {

            element.setAttribute(
              attribute,
              row[lang]
            );

          }

        });

      });

  }


  /* =========================================================
     LANGUAGE SELECTOR
     ========================================================= */

  function getLanguageSelectors() {

    return document.querySelectorAll(
      [
        "#languageSelect",
        "#languageSelector",
        "#language-select",
        "select[name='language']",
        ".language-selector",
        ".language-select",
        "select[data-language]"
      ].join(",")
    );

  }


  function connectLanguageSelectors() {

    getLanguageSelectors()
      .forEach(function (select) {

        if (
          select.dataset.eagleJLanguageReady ===
          "true"
        ) {

          return;

        }

        select.dataset.eagleJLanguageReady =
          "true";

        select.addEventListener(
          "change",
          function () {

            const lang =
              this.value;

            if (
              SUPPORTED.includes(lang)
            ) {

              changeLanguage(lang);

            }

          }
        );

      });

  }


  function updateLanguageSelectors(
    lang
  ) {

    getLanguageSelectors()
      .forEach(function (select) {

        if (
          select.value !== lang
        ) {

          select.value =
            lang;

        }

      });

  }


  /* =========================================================
     APPLY LANGUAGE
     ========================================================= */

  function applyLanguage(lang) {

    if (
      !SUPPORTED.includes(lang)
    ) {

      lang =
        DEFAULT_LANGUAGE;

    }

    /*
      Prevent MutationObserver
      from repeatedly calling this
      while we modify the DOM.
    */

    if (isApplying) {
      return;
    }

    isApplying = true;

    try {

      saveLanguage(lang);

      document.documentElement
        .setAttribute(
          "lang",
          lang
        );

      /* DATA-I18N */

      document
        .querySelectorAll(
          "[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]"
        )
        .forEach(function (element) {

          translateElement(
            element,
            lang
          );

        });

      /*
        Only exact known system phrases
        are translated here.
      */

      if (document.body) {

        translateUnTaggedText(
          lang,
          document.body
        );

      }

      translateAttributes(
        lang
      );

      connectLanguageSelectors();

      updateLanguageSelectors(
        lang
      );

      window.currentLanguage =
        lang;

      window.selectedLanguage =
        lang;

    } finally {

      isApplying = false;

    }

    /*
      Notify other scripts.
    */

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

    } catch (error) {}

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

    connectLanguageSelectors();

    applyLanguage(
      getLanguage()
    );

    /*
      Some pages create their
      language selector later.
    */

    setTimeout(function () {

      connectLanguageSelectors();

      updateLanguageSelectors(
        getLanguage()
      );

    }, 500);

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


  /* =========================================================
     SAFE MUTATION OBSERVER
     ========================================================= */

  function startObserver() {

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

          /*
            Do not immediately re-run the
            whole translation system.

            Only react when new elements
            containing data-i18n appear.
          */

          let relevant = false;

          mutations.forEach(
            function (mutation) {

              if (
                mutation.type !==
                "childList"
              ) {

                return;

              }

              mutation.addedNodes.forEach(
                function (node) {

                  if (
                    node.nodeType !==
                    Node.ELEMENT_NODE
                  ) {

                    return;

                  }

                  if (
                    node.matches &&
                    (
                      node.matches(
                        "[data-i18n], [data-i18n-placeholder]"
                      ) ||
                      node.querySelector(
                        "[data-i18n], [data-i18n-placeholder]"
                      )
                    )
                  ) {

                    relevant = true;

                  }

                }
              );

            }
          );

          if (!relevant) {
            return;
          }

          clearTimeout(
            observerTimer
          );

          observerTimer =
            setTimeout(
              function () {

                if (isApplying) {
                  return;
                }

                const lang =
                  getLanguage();

                /*
                  Only translate the new
                  tagged elements.
                */

                document
                  .querySelectorAll(
                    "[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]"
                  )
                  .forEach(
                    function (element) {

                      translateElement(
                        element,
                        lang
                      );

                    }
                  );

                connectLanguageSelectors();

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
    document.readyState ===
    "loading"
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
     PUBLIC API
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

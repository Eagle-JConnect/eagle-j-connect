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
     EXTENDED GLOBAL TRANSLATIONS — ALL PROJECT PAGES
     ========================================================= */
  Object.assign(textMap, {
    "Members | Eagle-J Connect": { ht: "Manm | Eagle-J Connect", en: "Members | Eagle-J Connect", fr: "Membres | Eagle-J Connect" },
    "Login | Eagle-J Connect": { ht: "Konekte | Eagle-J Connect", en: "Login | Eagle-J Connect", fr: "Connexion | Eagle-J Connect" },
    "Itilizatè | Eagle-J Connect": { ht: "Itilizatè | Eagle-J Connect", en: "Users | Eagle-J Connect", fr: "Utilisateurs | Eagle-J Connect" },
    "Post a Job | Eagle-J Connect": { ht: "Poste yon Travay | Eagle-J Connect", en: "Post a Job | Eagle-J Connect", fr: "Publier un emploi | Eagle-J Connect" },
    "Contact | Eagle-J Connect": { ht: "Kontak | Eagle-J Connect", en: "Contact | Eagle-J Connect", fr: "Contact | Eagle-J Connect" },
    "Register | Eagle-J Connect": { ht: "Enskri | Eagle-J Connect", en: "Register | Eagle-J Connect", fr: "Inscription | Eagle-J Connect" },
    "Jobs | Eagle-J Connect": { ht: "Travay | Eagle-J Connect", en: "Jobs | Eagle-J Connect", fr: "Emplois | Eagle-J Connect" },
    "Listings | Eagle-J Connect": { ht: "Anons | Eagle-J Connect", en: "Listings | Eagle-J Connect", fr: "Annonces | Eagle-J Connect" },
    "Listing Details | Eagle-J Connect": { ht: "Detay Anons | Eagle-J Connect", en: "Listing Details | Eagle-J Connect", fr: "Détails de l’annonce | Eagle-J Connect" },
    "Create a Listing | Eagle-J Connect": { ht: "Kreye yon Anons | Eagle-J Connect", en: "Create a Listing | Eagle-J Connect", fr: "Créer une annonce | Eagle-J Connect" },
    "Businesses & Services | Eagle-J Connect": { ht: "Biznis ak Sèvis | Eagle-J Connect", en: "Businesses & Services | Eagle-J Connect", fr: "Entreprises et services | Eagle-J Connect" },
    "Admin Dashboard | Eagle-J Connect": { ht: "Dashboard Administratè | Eagle-J Connect", en: "Admin Dashboard | Eagle-J Connect", fr: "Tableau de bord administrateur | Eagle-J Connect" },
    "Dashboard | Eagle-J Connect": { ht: "Dashboard | Eagle-J Connect", en: "Dashboard | Eagle-J Connect", fr: "Tableau de bord | Eagle-J Connect" },
    "Profile | Eagle-J Connect": { ht: "Pwofil | Eagle-J Connect", en: "Profile | Eagle-J Connect", fr: "Profil | Eagle-J Connect" },
    "Employer Area | Eagle-J Connect": { ht: "Zòn Anplwayè | Eagle-J Connect", en: "Employer Area | Eagle-J Connect", fr: "Espace employeur | Eagle-J Connect" },
    "Job Seeker | Eagle-J Connect": { ht: "Moun k ap chèche travay | Eagle-J Connect", en: "Job Seeker | Eagle-J Connect", fr: "Chercheur d’emploi | Eagle-J Connect" },
    "Akèy": { ht: "Akèy", en: "Home", fr: "Accueil" },
    "Travay": { ht: "Travay", en: "Jobs", fr: "Emplois" },
    "Biznis": { ht: "Biznis", en: "Business", fr: "Entreprises" },
    "Anons": { ht: "Anons", en: "Listings", fr: "Annonces" },
    "Kontak": { ht: "Kontak", en: "Contact", fr: "Contact" },
    "Enskri": { ht: "Enskri", en: "Register", fr: "S’inscrire" },
    "Konekte": { ht: "Konekte", en: "Login", fr: "Connexion" },
    "Kont Mwen": { ht: "Kont Mwen", en: "My Account", fr: "Mon compte" },
    "Dekonekte": { ht: "Dekonekte", en: "Logout", fr: "Déconnexion" },
    "Itilizatè": { ht: "Itilizatè", en: "Users", fr: "Utilisateurs" },
    "Dekouvri manm ki gen pwofil piblik sou Eagle-J Connect.": { ht: "Dekouvri manm ki gen pwofil piblik sou Eagle-J Connect.", en: "Discover members with public profiles on Eagle-J Connect.", fr: "Découvrez les membres ayant un profil public sur Eagle-J Connect." },
    "Manm kominote a": { ht: "Manm kominote a", en: "Community members", fr: "Membres de la communauté" },
    "⏳ Ap chaje...": { ht: "⏳ Ap chaje...", en: "⏳ Loading...", fr: "⏳ Chargement..." },
    "Itilizatè yo ap chaje...": { ht: "Itilizatè yo ap chaje...", en: "Users are loading...", fr: "Les utilisateurs se chargent..." },
    "Konekte moun, travay, biznis ak sèvis ant Ayiti ak Bahamas.": { ht: "Konekte moun, travay, biznis ak sèvis ant Ayiti ak Bahamas.", en: "Connect people, jobs, businesses, and services between Haiti and the Bahamas.", fr: "Connectez les personnes, emplois, entreprises et services entre Haïti et les Bahamas." },
    "📢 Poste yon Travay": { ht: "📢 Poste yon Travay", en: "📢 Post a Job", fr: "📢 Publier un emploi" },
    "Paj sa a itilize menm espas anplwayè a pou pibliye travay.": { ht: "Paj sa a itilize menm espas anplwayè a pou pibliye travay.", en: "This page uses the same employer area to post jobs.", fr: "Cette page utilise le même espace employeur pour publier des emplois." },
    "Ale nan Zòn Anplwayè": { ht: "Ale nan Zòn Anplwayè", en: "Go to Employer Area", fr: "Aller à l’espace employeur" },
    "📩 Kontakte Nou": { ht: "📩 Kontakte Nou", en: "📩 Contact Us", fr: "📩 Contactez-nous" },
    "Voye yon mesaj; n ap prepare li nan aplikasyon imèl ou.": { ht: "Voye yon mesaj; n ap prepare li nan aplikasyon imèl ou.", en: "Send a message; we will prepare it in your email application.", fr: "Envoyez un message ; nous le préparerons dans votre application e-mail." },
    "Kreye kont ou pou chèche travay oswa poste travay.": { ht: "Kreye kont ou pou chèche travay oswa poste travay.", en: "Create your account to find jobs or post jobs.", fr: "Créez votre compte pour trouver ou publier des emplois." },
    "📧 Apre enskripsyon an, verifye imèl ou. Lè ou klike sou lyen konfimasyon an, w ap retounen sou paj Konekte a.": { ht: "📧 Apre enskripsyon an, verifye imèl ou. Lè ou klike sou lyen konfimasyon an, w ap retounen sou paj Konekte a.", en: "📧 After registration, check your email. When you click the confirmation link, you will return to the Login page.", fr: "📧 Après l’inscription, vérifiez votre e-mail. Lorsque vous cliquez sur le lien de confirmation, vous reviendrez à la page Connexion." },
    "NON": { ht: "NON", en: "FIRST NAME", fr: "PRÉNOM" },
    "SIYATI": { ht: "SIYATI", en: "LAST NAME", fr: "NOM" },
    "EMAIL": { ht: "IMÈL", en: "EMAIL", fr: "E-MAIL" },
    "TELEFON": { ht: "TELEFÒN", en: "PHONE", fr: "TÉLÉPHONE" },
    "KALITE KONT": { ht: "KALITE KONT", en: "ACCOUNT TYPE", fr: "TYPE DE COMPTE" },
    "MODPAS": { ht: "MODPAS", en: "PASSWORD", fr: "MOT DE PASSE" },
    "KONFIME MODPAS": { ht: "KONFIME MODPAS", en: "CONFIRM PASSWORD", fr: "CONFIRMER LE MOT DE PASSE" },
    "Kalite kont": { ht: "Kalite kont", en: "Account type", fr: "Type de compte" },
    "Konfime modpas": { ht: "Konfime modpas", en: "Confirm password", fr: "Confirmer le mot de passe" },
    "Ou deja gen kont?": { ht: "Ou deja gen kont?", en: "Already have an account?", fr: "Vous avez déjà un compte ?" },
    "Ou gen yon travay pou poste?": { ht: "Ou gen yon travay pou poste?", en: "Have a job to post?", fr: "Vous avez un emploi à publier ?" },
    "1️⃣ Kreye Kont": { ht: "1️⃣ Kreye Kont", en: "1️⃣ Create Account", fr: "1️⃣ Créer un compte" },
    "2️⃣ Chèche Travay": { ht: "2️⃣ Chèche Travay", en: "2️⃣ Find Jobs", fr: "2️⃣ Chercher un emploi" },
    "3️⃣ Aplike": { ht: "3️⃣ Aplike", en: "3️⃣ Apply", fr: "3️⃣ Postuler" },
    "Chèche opòtinite ki disponib sou platfòm lan.": { ht: "Chèche opòtinite ki disponib sou platfòm lan.", en: "Find opportunities available on the platform.", fr: "Trouvez les opportunités disponibles sur la plateforme." },
    "👷 Moun k ap chèche travay": { ht: "👷 Moun k ap chèche travay", en: "👷 Job Seeker", fr: "👷 Chercheur d’emploi" },
    "🏢 Zòn Anplwayè": { ht: "🏢 Zòn Anplwayè", en: "🏢 Employer Area", fr: "🏢 Espace employeur" },
    "Pwofil Anplwayè": { ht: "Pwofil Anplwayè", en: "Employer Profile", fr: "Profil employeur" },
    "Non:": { ht: "Non:", en: "Name:", fr: "Nom :" },
    "Imèl:": { ht: "Imèl:", en: "Email:", fr: "E-mail :" },
    "Telefòn:": { ht: "Telefòn:", en: "Phone:", fr: "Téléphone :" },
    "Kalite kont:": { ht: "Kalite kont:", en: "Account type:", fr: "Type de compte :" },
    "📢 Pibliye yon travay": { ht: "📢 Pibliye yon travay", en: "📢 Post a Job", fr: "📢 Publier un emploi" },
    "🚪 Dekonekte": { ht: "🚪 Dekonekte", en: "🚪 Logout", fr: "🚪 Déconnexion" },
    "Dekouvri travay ki disponib epi jwenn opòtinite ki koresponn ak konpetans ou.": { ht: "Dekouvri travay ki disponib epi jwenn opòtinite ki koresponn ak konpetans ou.", en: "Discover available jobs and find opportunities that match your skills.", fr: "Découvrez les emplois disponibles et trouvez des opportunités correspondant à vos compétences." },
    "Chèche opòtinite travay selon tit, konpayi, lokalizasyon ak kalite travay.": { ht: "Chèche opòtinite travay selon tit, konpayi, lokalizasyon ak kalite travay.", en: "Search for job opportunities by title, company, location, and job type.", fr: "Recherchez des opportunités d’emploi par titre, entreprise, lieu et type d’emploi." },
    "Chèche opòtinite travay selon tit, konpayi, lokalizasyon oswa kalite travay.": { ht: "Chèche opòtinite travay selon tit, konpayi, lokalizasyon oswa kalite travay.", en: "Search for job opportunities by title, company, location, or job type.", fr: "Recherchez des opportunités d’emploi par titre, entreprise, lieu ou type d’emploi." },
    "Kijan sa mache?": { ht: "Kijan sa mache?", en: "How does it work?", fr: "Comment ça marche ?" },
    "Biznis, sèvis & pwofesyonèl": { ht: "Biznis, sèvis & pwofesyonèl", en: "Businesses, services & professionals", fr: "Entreprises, services et professionnels" },
    "Jwenn moun ak biznis ki ka ede w. Oswa mete sa w ap ofri devan kominote a.": { ht: "Jwenn moun ak biznis ki ka ede w. Oswa mete sa w ap ofri devan kominote a.", en: "Find people and businesses that can help you, or put what you offer in front of the community.", fr: "Trouvez des personnes et des entreprises qui peuvent vous aider, ou présentez votre offre à la communauté." },
    "📢 Mete yon Anons": { ht: "📢 Mete yon Anons", en: "📢 Create a Listing", fr: "📢 Créer une annonce" },
    "Gade Tout Anons": { ht: "Gade Tout Anons", en: "View All Listings", fr: "Voir toutes les annonces" },
    "← Biznis & Sèvis": { ht: "← Biznis & Sèvis", en: "← Businesses & Services", fr: "← Entreprises et services" },
    "← Retounen nan Biznis": { ht: "← Retounen nan Biznis", en: "← Back to Business", fr: "← Retour aux entreprises" },
    "⏳ Anons lan ap chaje...": { ht: "⏳ Anons lan ap chaje...", en: "⏳ Listing is loading...", fr: "⏳ L’annonce se charge..." },
    "Fè moun jwenn biznis, pwofesyon, sèvis oswa byen ou ap ofri.": { ht: "Fè moun jwenn biznis, pwofesyon, sèvis oswa byen ou ap ofri.", en: "Help people find the business, profession, service, or property you offer.", fr: "Aidez les gens à trouver l’entreprise, le service, le professionnel ou le bien que vous proposez." },
    "📢 Kreye yon Anons Biznis": { ht: "📢 Kreye yon Anons Biznis", en: "📢 Create a Business Listing", fr: "📢 Créer une annonce d’entreprise" },
    "📢 Create a Listing": { ht: "📢 Kreye yon Anons", en: "📢 Create a Listing", fr: "📢 Créer une annonce" },
    "🌎 Tout": { ht: "🌎 Tout", en: "🌎 All", fr: "🌎 Tout" },
    "👷 Anplwaye": { ht: "👷 Anplwaye", en: "👷 Employees", fr: "👷 Employés" },
    "🏢 Anplwayè": { ht: "🏢 Anplwayè", en: "🏢 Employers", fr: "🏢 Employeurs" },
    "🧑🏾‍🔧 Pwofesyonèl": { ht: "🧑🏾‍🔧 Pwofesyonèl", en: "🧑🏾‍🔧 Professionals", fr: "🧑🏾‍🔧 Professionnels" },
    "🛠️ Sèvis": { ht: "🛠️ Sèvis", en: "🛠️ Services", fr: "🛠️ Services" },
    "🛍️ Biznis": { ht: "🛍️ Biznis", en: "🛍️ Business", fr: "🛍️ Entreprises" },
    "🏠 Byen": { ht: "🏠 Byen", en: "🏠 Property", fr: "🏠 Biens" },
    "🏠 Byen / Pwopriyete": { ht: "🏠 Byen / Pwopriyete", en: "🏠 Property", fr: "🏠 Bien / Propriété" },
    "👷 Job Seeker": { ht: "👷 Moun k ap chèche travay", en: "👷 Job Seeker", fr: "👷 Chercheur d’emploi" },
    "Tout": { ht: "Tout", en: "All", fr: "Tout" },
    "Tout kalite kont": { ht: "Tout kalite kont", en: "All account types", fr: "Tous les types de comptes" },
    "Tout kalite travay": { ht: "Tout kalite travay", en: "All job types", fr: "Tous les types d’emploi" },
    "Tout status": { ht: "Tout status", en: "All statuses", fr: "Tous les statuts" },
    "Chwazi": { ht: "Chwazi", en: "Choose", fr: "Choisir" },
    "Chwazi...": { ht: "Chwazi...", en: "Choose...", fr: "Choisir..." },
    "Chwazi kalite anons": { ht: "Chwazi kalite anons", en: "Choose listing type", fr: "Choisir le type d’annonce" },
    "Chwazi yon kategori": { ht: "Chwazi yon kategori", en: "Choose a category", fr: "Choisir une catégorie" },
    "Contract": { ht: "Kontra", en: "Contract", fr: "Contrat" },
    "Full-time": { ht: "Tan plen", en: "Full-time", fr: "Temps plein" },
    "Part-time": { ht: "Tan pasyèl", en: "Part-time", fr: "Temps partiel" },
    "Temporary": { ht: "Tanporè", en: "Temporary", fr: "Temporaire" },
    "⏳ Pending": { ht: "⏳ An atant", en: "⏳ Pending", fr: "⏳ En attente" },
    "⚡ Elektrisite": { ht: "⚡ Elektrisite", en: "⚡ Electricity", fr: "⚡ Électricité" },
    "✅ Aktif": { ht: "✅ Aktif", en: "✅ Active", fr: "✅ Actif" },
    "✅ Piblik": { ht: "✅ Piblik", en: "✅ Public", fr: "✅ Public" },
    "❌ Refize": { ht: "❌ Refize", en: "❌ Rejected", fr: "❌ Refusé" },
    "🚫 Dezaktive": { ht: "🚫 Dezaktive", en: "🚫 Disabled", fr: "🚫 Désactivé" },
    "🚫 Pa disponib": { ht: "🚫 Pa disponib", en: "🚫 Unavailable", fr: "🚫 Indisponible" },
    "🍔 Manje": { ht: "🍔 Manje", en: "🍔 Food", fr: "🍔 Alimentation" },
    "🍽 Restoran": { ht: "🍽 Restoran", en: "🍽 Restaurant", fr: "🍽 Restaurant" },
    "🏗️ Konstriksyon": { ht: "🏗️ Konstriksyon", en: "🏗️ Construction", fr: "🏗️ Construction" },
    "🏠 Imobilye": { ht: "🏠 Imobilye", en: "🏠 Real Estate", fr: "🏠 Immobilier" },
    "👗 Kouti / Rad": { ht: "👗 Kouti / Rad", en: "👗 Sewing / Clothing", fr: "👗 Couture / Vêtements" },
    "💄 Beauty / Bote": { ht: "💄 Bote", en: "💄 Beauty", fr: "💄 Beauté" },
    "💇🏾 Bote / Barber": { ht: "💇🏾 Bote / Barber", en: "💇🏾 Beauty / Barber", fr: "💇🏾 Beauté / Barbier" },
    "💻 Digital Services": { ht: "💻 Sèvis Dijital", en: "💻 Digital Services", fr: "💻 Services numériques" },
    "💻 IT / Teknoloji": { ht: "💻 IT / Teknoloji", en: "💻 IT / Technology", fr: "💻 Informatique / Technologie" },
    "📍 Tout lokalizasyon": { ht: "📍 Tout lokalizasyon", en: "📍 All locations", fr: "📍 Toutes les localisations" },
    "📦 Lòt": { ht: "📦 Lòt", en: "📦 Other", fr: "📦 Autre" },
    "🔧 Reparasyon": { ht: "🔧 Reparasyon", en: "🔧 Repairs", fr: "🔧 Réparations" },
    "🔧 Sèvis jeneral": { ht: "🔧 Sèvis jeneral", en: "🔧 General services", fr: "🔧 Services généraux" },
    "🛡️ Administratè": { ht: "🛡️ Administratè", en: "🛡️ Administrator", fr: "🛡️ Administrateur" },
    "🧹 Netwayaj": { ht: "🧹 Netwayaj", en: "🧹 Cleaning", fr: "🧹 Nettoyage" },
    "📧 Envoyer le message": { ht: "📧 Voye mesaj la", en: "📧 Send the message", fr: "📧 Envoyer le message" },
    "Connect with people, discover jobs and services, promote your business, and find opportunities anywhere in the world.": { ht: "Konekte ak moun, dekouvri travay ak sèvis, pwomote biznis ou, epi jwenn opòtinite nenpòt kote nan mond lan.", en: "Connect with people, discover jobs and services, promote your business, and find opportunities anywhere in the world.", fr: "Connectez-vous avec des personnes, découvrez des emplois et des services, faites connaître votre entreprise et trouvez des opportunités partout dans le monde." },
    "Create Account": { ht: "Kreye Kont", en: "Create Account", fr: "Créer un compte" },
    "Find Jobs": { ht: "Chèche Travay", en: "Find Jobs", fr: "Chercher un emploi" },
    "CONNECT. DISCOVER.": { ht: "KONEKTE. DEKOUVRI.", en: "CONNECT. DISCOVER.", fr: "CONNECTEZ. DÉCOUVREZ." },
    "GROW.": { ht: "GRANDI.", en: "GROW.", fr: "GRANDISSEZ." },
    "👋 Pwofil mwen": { ht: "👋 Pwofil mwen", en: "👋 My Profile", fr: "👋 Mon profil" },
    "⏳ Nap chaje pwofil ou...": { ht: "⏳ Nap chaje pwofil ou...", en: "⏳ Loading your profile...", fr: "⏳ Chargement de votre profil..." },
    "👤 Enfòmasyon mwen": { ht: "👤 Enfòmasyon mwen", en: "👤 My Information", fr: "👤 Mes informations" },
    "➕ Poste yon Travay": { ht: "➕ Poste yon Travay", en: "➕ Post a Job", fr: "➕ Publier un emploi" },
    "Jesyon pwofil ou disponib nan": { ht: "Jesyon pwofil ou disponib nan", en: "Profile management is available in", fr: "La gestion de votre profil est disponible dans" },
    "Se Admin ki valide sa ki vin piblik sou Eagle-J Connect.": { ht: "Se Admin ki valide sa ki vin piblik sou Eagle-J Connect.", en: "The administrator reviews and approves what becomes public on Eagle-J Connect.", fr: "L’administrateur examine et valide ce qui devient public sur Eagle-J Connect." },
    "⏳ Travay ki bezwen validasyon": { ht: "⏳ Travay ki bezwen validasyon", en: "⏳ Jobs awaiting approval", fr: "⏳ Emplois en attente de validation" },
    "📢 Anons biznis/sèvis ki bezwen validasyon": { ht: "📢 Anons biznis/sèvis ki bezwen validasyon", en: "📢 Business/service listings awaiting approval", fr: "📢 Annonces d’entreprises/services en attente de validation" },
    "⏳ Nap chaje...": { ht: "⏳ Nap chaje...", en: "⏳ Loading...", fr: "⏳ Chargement..." },
    "HEADER ADMIN": { ht: "HEADER ADMIN", en: "ADMIN HEADER", fr: "EN-TÊTE ADMINISTRATEUR" },
    "ADMIN APPLICATION": { ht: "ADMIN APPLICATION", en: "ADMIN APPLICATION", fr: "APPLICATION ADMINISTRATEUR" },
    "BUSINESS ADS": { ht: "ANONS BIZNIS", en: "BUSINESS ADS", fr: "ANNONCES D’ENTREPRISES" },
    "USERS": { ht: "ITILIZATÈ", en: "USERS", fr: "UTILISATEURS" },
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
      tag === "NOSCRIPT"
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

      /* Translate the browser tab title too. */
      if (document.title) {
        const titleKey = normalize(document.title);
        const titleRow = reverseMap[lang][titleKey];
        if (titleRow && titleRow[lang]) {
          document.title = titleRow[lang];
        }
      }

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

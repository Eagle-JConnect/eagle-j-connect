/* Eagle-J Connect — Global language, Google login, presence & notifications */
(function(){
  "use strict";

  const SUPABASE_URL = "https://glwyqrvufmjscjbbszzz.supabase.co";
  const SUPABASE_KEY = "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";
  const PRESENCE_CHANNEL = "eagle-j-connect-online";

  const T = {
  "Akèy": [
    "Akèy",
    "Home",
    "Accueil"
  ],
  "Travay": [
    "Travay",
    "Jobs",
    "Emplois"
  ],
  "Biznis": [
    "Biznis",
    "Business",
    "Entreprise"
  ],
  "Anons": [
    "Anons",
    "Listings",
    "Annonces"
  ],
  "Kontak": [
    "Kontak",
    "Contact",
    "Contact"
  ],
  "Enskri": [
    "Enskri",
    "Register",
    "S'inscrire"
  ],
  "Konekte": [
    "Konekte",
    "Login",
    "Connexion"
  ],
  "Kont Mwen": [
    "Kont Mwen",
    "My Account",
    "Mon compte"
  ],
  "Dekonekte": [
    "Dekonekte",
    "Logout",
    "Déconnexion"
  ],
  "Connect • Discover • Grow": [
    "Konekte • Dekouvri • Grandi",
    "Connect • Discover • Grow",
    "Connecter • Découvrir • Grandir"
  ],
  "Se Admin ki valide sa ki vin piblik sou Eagle-J Connect.": [
    "Se Admin ki valide sa ki vin piblik sou Eagle-J Connect.",
    "The administrator reviews and approves what becomes public on Eagle-J Connect.",
    "L’administrateur examine et valide ce qui devient public sur Eagle-J Connect."
  ],
  "🛡️ Dashboard Administratè": [
    "🛡️ Dashboard Administratè",
    "🛡️ Administrator Dashboard",
    "🛡️ Tableau de bord administrateur"
  ],
  "Travay pou valide": [
    "Travay pou valide",
    "Jobs pending approval",
    "Emplois à valider"
  ],
  "Anons pou valide": [
    "Anons pou valide",
    "Listings pending approval",
    "Annonces à valider"
  ],
  "Travay piblik": [
    "Travay piblik",
    "Public jobs",
    "Emplois publics"
  ],
  "Anons piblik": [
    "Anons piblik",
    "Public listings",
    "Annonces publiques"
  ],
  "Itilizatè": [
    "Itilizatè",
    "Users",
    "Utilisateurs"
  ],
  "Kont dezaktive": [
    "Kont dezaktive",
    "Disabled accounts",
    "Comptes désactivés"
  ],
  "⏳ Travay ki bezwen validasyon": [
    "⏳ Travay ki bezwen validasyon",
    "⏳ Jobs awaiting approval",
    "⏳ Emplois en attente de validation"
  ],
  "⏳ Pending": [
    "⏳ Pending",
    "⏳ Pending",
    "⏳ En attente"
  ],
  "✅ Piblik": [
    "✅ Piblik",
    "✅ Public",
    "✅ Public"
  ],
  "❌ Refize": [
    "❌ Refize",
    "❌ Rejected",
    "❌ Refusé"
  ],
  "🚫 Pa disponib": [
    "🚫 Pa disponib",
    "🚫 Unavailable",
    "🚫 Indisponible"
  ],
  "Tout": [
    "Tout",
    "All",
    "Tous"
  ],
  "🔄 Rafrechi": [
    "🔄 Rafrechi",
    "🔄 Refresh",
    "🔄 Actualiser"
  ],
  "Konpayi": [
    "Konpayi",
    "Company",
    "Entreprise"
  ],
  "Lokalizasyon": [
    "Lokalizasyon",
    "Location",
    "Localisation"
  ],
  "Status": [
    "Status",
    "Status",
    "Statut"
  ],
  "Dat": [
    "Dat",
    "Date",
    "Date"
  ],
  "Aksyon": [
    "Aksyon",
    "Action",
    "Action"
  ],
  "⏳ Nap chaje...": [
    "⏳ Nap chaje...",
    "⏳ Loading...",
    "⏳ Chargement..."
  ],
  "📢 Anons biznis/sèvis ki bezwen validasyon": [
    "📢 Anons biznis/sèvis ki bezwen validasyon",
    "📢 Business/service listings awaiting approval",
    "📢 Annonces d’entreprises/services à valider"
  ],
  "Biznis/Anons": [
    "Biznis/Anons",
    "Business/Listing",
    "Entreprise/Annonce"
  ],
  "Kategori": [
    "Kategori",
    "Category",
    "Catégorie"
  ],
  "👥 Jere itilizatè yo": [
    "👥 Jere itilizatè yo",
    "👥 Manage users",
    "👥 Gérer les utilisateurs"
  ],
  "Tout kalite kont": [
    "Tout kalite kont",
    "All account types",
    "Tous les types de compte"
  ],
  "👷 Job Seeker": [
    "👷 Job Seeker",
    "👷 Job Seeker",
    "👷 Chercheur d’emploi"
  ],
  "🏢 Anplwayè": [
    "🏢 Anplwayè",
    "🏢 Employer",
    "🏢 Employeur"
  ],
  "🛡️ Administratè": [
    "🛡️ Administratè",
    "🛡️ Administrator",
    "🛡️ Administrateur"
  ],
  "Tout status": [
    "Tout status",
    "All statuses",
    "Tous les statuts"
  ],
  "✅ Aktif": [
    "✅ Aktif",
    "✅ Active",
    "✅ Actif"
  ],
  "🚫 Dezaktive": [
    "🚫 Dezaktive",
    "🚫 Disabled",
    "🚫 Désactivé"
  ],
  "Non": [
    "Non",
    "Name",
    "Nom"
  ],
  "Imèl": [
    "Imèl",
    "Email",
    "E-mail"
  ],
  "Telefòn": [
    "Telefòn",
    "Phone",
    "Téléphone"
  ],
  "Kalite": [
    "Kalite",
    "Type",
    "Type"
  ],
  "Tout Anons": [
    "Tout Anons",
    "All Listings",
    "Toutes les annonces"
  ],
  "Gade sa moun ak biznis ap ofri sou Eagle-J Connect.": [
    "Gade sa moun ak biznis ap ofri sou Eagle-J Connect.",
    "See what people and businesses are offering on Eagle-J Connect.",
    "Découvrez ce que les personnes et les entreprises proposent sur Eagle-J Connect."
  ],
  "📢 Kreye yon Anons": [
    "📢 Kreye yon Anons",
    "📢 Create a Listing",
    "📢 Créer une annonce"
  ],
  "← Biznis & Sèvis": [
    "← Biznis & Sèvis",
    "← Business & Services",
    "← Entreprises & Services"
  ],
  "🌎 Tout": [
    "🌎 Tout",
    "🌎 All",
    "🌎 Tous"
  ],
  "👷 Anplwaye": [
    "👷 Anplwaye",
    "👷 Employee",
    "👷 Employé"
  ],
  "🧑🏾‍🔧 Pwofesyonèl": [
    "🧑🏾‍🔧 Pwofesyonèl",
    "🧑🏾‍🔧 Professional",
    "🧑🏾‍🔧 Professionnel"
  ],
  "🛠️ Sèvis": [
    "🛠️ Sèvis",
    "🛠️ Services",
    "🛠️ Services"
  ],
  "🛍️ Biznis": [
    "🛍️ Biznis",
    "🛍️ Business",
    "🛍️ Entreprise"
  ],
  "🏠 Byen": [
    "🏠 Byen",
    "🏠 Property",
    "🏠 Biens"
  ],
  "📍 Tout lokalizasyon": [
    "📍 Tout lokalizasyon",
    "📍 All locations",
    "📍 Toutes les localisations"
  ],
  "Anons yo ap chaje...": [
    "Anons yo ap chaje...",
    "Listings are loading...",
    "Chargement des annonces..."
  ],
  "← Retounen nan Biznis": [
    "← Retounen nan Biznis",
    "← Back to Business",
    "← Retour aux entreprises"
  ],
  "⏳ Anons lan ap chaje...": [
    "⏳ Anons lan ap chaje...",
    "⏳ Listing is loading...",
    "⏳ Chargement de l’annonce..."
  ],
  "EAGLE-J MARKETPLACE": [
    "EAGLE-J MARKETPLACE",
    "EAGLE-J MARKETPLACE",
    "EAGLE-J MARKETPLACE"
  ],
  "Biznis, sèvis & pwofesyonèl": [
    "Biznis, sèvis & pwofesyonèl",
    "Businesses, services & professionals",
    "Entreprises, services & professionnels"
  ],
  "Jwenn moun ak biznis ki ka ede w. Oswa mete sa w ap ofri devan kominote a.": [
    "Jwenn moun ak biznis ki ka ede w. Oswa mete sa w ap ofri devan kominote a.",
    "Find people and businesses that can help you, or showcase what you offer to the community.",
    "Trouvez des personnes et des entreprises qui peuvent vous aider, ou présentez ce que vous proposez à la communauté."
  ],
  "📢 Mete yon Anons": [
    "📢 Mete yon Anons",
    "📢 Post a Listing",
    "📢 Publier une annonce"
  ],
  "Gade Tout Anons": [
    "Gade Tout Anons",
    "View All Listings",
    "Voir toutes les annonces"
  ],
  "👋 Pwofil mwen": [
    "👋 Pwofil mwen",
    "👋 My Profile",
    "👋 Mon profil"
  ],
  "⏳ Nap chaje pwofil ou...": [
    "⏳ Nap chaje pwofil ou...",
    "⏳ Loading your profile...",
    "⏳ Chargement de votre profil..."
  ],
  "👤 Enfòmasyon mwen": [
    "👤 Enfòmasyon mwen",
    "👤 My Information",
    "👤 Mes informations"
  ],
  "Non:": [
    "Non:",
    "Name:",
    "Nom :"
  ],
  "Imèl:": [
    "Imèl:",
    "Email:",
    "E-mail :"
  ],
  "Telefòn:": [
    "Telefòn:",
    "Phone:",
    "Téléphone :"
  ],
  "Kalite kont:": [
    "Kalite kont:",
    "Account type:",
    "Type de compte :"
  ],
  "➕ Poste yon Travay": [
    "➕ Poste yon Travay",
    "➕ Post a Job",
    "➕ Publier un emploi"
  ],
  "🔎 Chèche Travay": [
    "🔎 Chèche Travay",
    "🔎 Find Jobs",
    "🔎 Chercher un emploi"
  ],
  "🚪 Dekonekte": [
    "🚪 Dekonekte",
    "🚪 Logout",
    "🚪 Déconnexion"
  ],
  "🏢 Zòn Anplwayè": [
    "🏢 Zòn Anplwayè",
    "🏢 Employer Area",
    "🏢 Espace employeur"
  ],
  "Ap chaje...": [
    "Ap chaje...",
    "Loading...",
    "Chargement..."
  ],
  "Pwofil Anplwayè": [
    "Pwofil Anplwayè",
    "Employer Profile",
    "Profil employeur"
  ],
  "Tit travay la": [
    "Tit travay la",
    "Job title",
    "Titre du poste"
  ],
  "Non konpayi an": [
    "Non konpayi an",
    "Company name",
    "Nom de l’entreprise"
  ],
  "Kalite travay": [
    "Kalite travay",
    "Job type",
    "Type d’emploi"
  ],
  "Chwazi": [
    "Chwazi",
    "Select",
    "Sélectionner"
  ],
  "Salè / Tarif (opsyonèl)": [
    "Salè / Tarif (opsyonèl)",
    "Salary / Rate (optional)",
    "Salaire / Tarif (facultatif)"
  ],
  "Deskripsyon": [
    "Deskripsyon",
    "Description",
    "Description"
  ],
  "Telefòn kontak": [
    "Telefòn kontak",
    "Contact phone",
    "Téléphone de contact"
  ],
  "📢 Pibliye Travay": [
    "📢 Pibliye Travay",
    "📢 Publish Job",
    "📢 Publier l’emploi"
  ],
  "💼 Travay mwen yo": [
    "💼 Travay mwen yo",
    "💼 My Jobs",
    "💼 Mes emplois"
  ],
  "Kreye Kont": [
    "Kreye Kont",
    "Create Account",
    "Créer un compte"
  ],
  "Kreye kont ou pou chèche travay oswa poste travay.": [
    "Kreye kont ou pou chèche travay oswa poste travay.",
    "Create an account to find jobs or post jobs.",
    "Créez un compte pour chercher un emploi ou publier une offre."
  ],
  "📧 Apre enskripsyon an, verifye imèl ou. Lè ou klike sou lyen konfimasyon an, w ap retounen sou paj Konekte a.": [
    "📧 Apre enskripsyon an, verifye imèl ou. Lè ou klike sou lyen konfimasyon an, w ap retounen sou paj Konekte a.",
    "📧 After registration, check your email. When you click the confirmation link, you will return to the Login page.",
    "📧 Après l’inscription, vérifiez votre e-mail. En cliquant sur le lien de confirmation, vous reviendrez à la page de connexion."
  ],
  "NON": [
    "NON",
    "FIRST NAME",
    "PRÉNOM"
  ],
  "SIYATI": [
    "SIYATI",
    "LAST NAME",
    "NOM DE FAMILLE"
  ],
  "Siyati": [
    "Siyati",
    "Last name",
    "Nom de famille"
  ],
  "EMAIL": [
    "EMAIL",
    "EMAIL",
    "E-MAIL"
  ],
  "TELEFON": [
    "TELEFON",
    "PHONE",
    "TÉLÉPHONE"
  ],
  "Telefòn / WhatsApp": [
    "Telefòn / WhatsApp",
    "Phone / WhatsApp",
    "Téléphone / WhatsApp"
  ],
  "KALITE KONT": [
    "KALITE KONT",
    "ACCOUNT TYPE",
    "TYPE DE COMPTE"
  ],
  "Kalite kont": [
    "Kalite kont",
    "Account type",
    "Type de compte"
  ],
  "Chwazi...": [
    "Chwazi...",
    "Select...",
    "Sélectionner..."
  ],
  "👷 Moun k ap chèche travay": [
    "👷 Moun k ap chèche travay",
    "👷 Job Seeker",
    "👷 Chercheur d’emploi"
  ],
  "MODPAS": [
    "MODPAS",
    "PASSWORD",
    "MOT DE PASSE"
  ],
  "Modpas": [
    "Modpas",
    "Password",
    "Mot de passe"
  ],
  "KONFIME MODPAS": [
    "KONFIME MODPAS",
    "CONFIRM PASSWORD",
    "CONFIRMER LE MOT DE PASSE"
  ],
  "Konfime modpas": [
    "Konfime modpas",
    "Confirm password",
    "Confirmer le mot de passe"
  ],
  "✅ Kreye Kont": [
    "✅ Kreye Kont",
    "✅ Create Account",
    "✅ Créer un compte"
  ],
  "Ou deja gen kont?": [
    "Ou deja gen kont?",
    "Already have an account?",
    "Vous avez déjà un compte ?"
  ],
  "🔐 Konekte": [
    "🔐 Konekte",
    "🔐 Login",
    "🔐 Connexion"
  ],
  "Antre imèl ak modpas ou pou kontinye.": [
    "Antre imèl ak modpas ou pou kontinye.",
    "Enter your email and password to continue.",
    "Entrez votre e-mail et votre mot de passe pour continuer."
  ],
  "Ou poko gen kont?": [
    "Ou poko gen kont?",
    "Don't have an account yet?",
    "Vous n’avez pas encore de compte ?"
  ],
  "Kreye yon kont": [
    "Kreye yon kont",
    "Create an account",
    "Créer un compte"
  ],
  "📢 Poste yon Travay": [
    "📢 Poste yon Travay",
    "📢 Post a Job",
    "📢 Publier un emploi"
  ],
  "Paj sa a itilize menm espas anplwayè a pou pibliye travay.": [
    "Paj sa a itilize menm espas anplwayè a pou pibliye travay.",
    "This page uses the employer area to publish jobs.",
    "Cette page utilise l’espace employeur pour publier des emplois."
  ],
  "Ale nan Zòn Anplwayè": [
    "Ale nan Zòn Anplwayè",
    "Go to Employer Area",
    "Aller à l’espace employeur"
  ],
  "Pwofil": [
    "Pwofil",
    "Profile",
    "Profil"
  ],
  "Jesyon pwofil ou disponib nan": [
    "Jesyon pwofil ou disponib nan",
    "Profile management is available in",
    "La gestion de votre profil est disponible dans"
  ],
  "Pwofil mwen": [
    "Pwofil mwen",
    "My Profile",
    "Mon profil"
  ],
  "Opòtinite Travay": [
    "Opòtinite Travay",
    "Job Opportunities",
    "Opportunités d’emploi"
  ],
  "Dekouvri travay ki disponib epi jwenn opòtinite ki koresponn ak konpetans ou.": [
    "Dekouvri travay ki disponib epi jwenn opòtinite ki koresponn ak konpetans ou.",
    "Discover available jobs and find opportunities that match your skills.",
    "Découvrez les emplois disponibles et trouvez des opportunités correspondant à vos compétences."
  ],
  "Travay ki disponib": [
    "Travay ki disponib",
    "Available Jobs",
    "Emplois disponibles"
  ],
  "Chèche opòtinite travay selon tit, konpayi, lokalizasyon oswa kalite travay.": [
    "Chèche opòtinite travay selon tit, konpayi, lokalizasyon oswa kalite travay.",
    "Search for jobs by title, company, location, or job type.",
    "Recherchez des emplois par titre, entreprise, localisation ou type d’emploi."
  ],
  "Tout kalite travay": [
    "Tout kalite travay",
    "All job types",
    "Tous les types d’emploi"
  ],
  "⏳ Ap chaje travay yo...": [
    "⏳ Ap chaje travay yo...",
    "⏳ Loading jobs...",
    "⏳ Chargement des emplois..."
  ],
  "Kijan sa mache?": [
    "Kijan sa mache?",
    "How does it work?",
    "Comment ça marche ?"
  ],
  "1️⃣ Kreye Kont": [
    "1️⃣ Kreye Kont",
    "1️⃣ Create an Account",
    "1️⃣ Créer un compte"
  ],
  "Kreye kont ou sou Eagle-J Connect pou jwenn aksè ak opòtinite yo.": [
    "Kreye kont ou sou Eagle-J Connect pou jwenn aksè ak opòtinite yo.",
    "Create your Eagle-J Connect account to access opportunities.",
    "Créez votre compte Eagle-J Connect pour accéder aux opportunités."
  ],
  "2️⃣ Chèche Travay": [
    "2️⃣ Chèche Travay",
    "2️⃣ Find Jobs",
    "2️⃣ Chercher un emploi"
  ],
  "Chèche travay selon tit, konpayi, lokalizasyon oswa kalite travay.": [
    "Chèche travay selon tit, konpayi, lokalizasyon oswa kalite travay.",
    "Search by title, company, location, or job type.",
    "Recherchez par titre, entreprise, localisation ou type d’emploi."
  ],
  "Gade Travay": [
    "Gade Travay",
    "View Jobs",
    "Voir les emplois"
  ],
  "3️⃣ Aplike": [
    "3️⃣ Aplike",
    "3️⃣ Apply",
    "3️⃣ Postuler"
  ],
  "Lè ou jwenn yon travay ki enterese w, itilize enfòmasyon kontak yo pou aplike.": [
    "Lè ou jwenn yon travay ki enterese w, itilize enfòmasyon kontak yo pou aplike.",
    "When you find a job that interests you, use the contact information to apply.",
    "Lorsque vous trouvez un emploi qui vous intéresse, utilisez les coordonnées pour postuler."
  ],
  "Kontakte Nou": [
    "Kontakte Nou",
    "Contact Us",
    "Nous contacter"
  ],
  "Ou gen yon travay pou poste?": [
    "Ou gen yon travay pou poste?",
    "Do you have a job to post?",
    "Vous avez un emploi à publier ?"
  ],
  "Pibliye opòtinite travay ou pou moun k ap chèche travay kapab dekouvri li.": [
    "Pibliye opòtinite travay ou pou moun k ap chèche travay kapab dekouvri li.",
    "Publish your job opportunity so job seekers can discover it.",
    "Publiez votre offre afin que les chercheurs d’emploi puissent la découvrir."
  ],
  "Poste yon Travay": [
    "Poste yon Travay",
    "Post a Job",
    "Publier un emploi"
  ],
  "MARKETPLACE": [
    "MARKETPLACE",
    "MARKETPLACE",
    "MARCHÉ"
  ],
  "📩 Kontakte Nou": [
    "📩 Kontakte Nou",
    "📩 Contact Us",
    "📩 Nous contacter"
  ],
  "Voye yon mesaj; n ap prepare li nan aplikasyon imèl ou.": [
    "Voye yon mesaj; n ap prepare li nan aplikasyon imèl ou.",
    "Send a message; we will prepare it in your email application.",
    "Envoyez un message ; nous le préparerons dans votre application e-mail."
  ],
  "Non ou": [
    "Non ou",
    "Your name",
    "Votre nom"
  ],
  "Mesaj": [
    "Mesaj",
    "Message",
    "Message"
  ],
  "📧 Voye Mesaj": [
    "📧 Voye Mesaj",
    "📧 Send Message",
    "📧 Envoyer le message"
  ],
  "📢 Kreye yon Anons Biznis": [
    "📢 Kreye yon Anons Biznis",
    "📢 Create a Business Listing",
    "📢 Créer une annonce d’entreprise"
  ],
  "Fè moun jwenn biznis, pwofesyon, sèvis oswa byen ou ap ofri.": [
    "Fè moun jwenn biznis, pwofesyon, sèvis oswa byen ou ap ofri.",
    "Help people find the business, profession, service, or property you offer.",
    "Aidez les gens à trouver l’entreprise, le métier, le service ou le bien que vous proposez."
  ],
  "Non biznis la": [
    "Non biznis la",
    "Business name",
    "Nom de l’entreprise"
  ],
  "Ki kalite anons?": [
    "Ki kalite anons?",
    "What type of listing?",
    "Quel type d’annonce ?"
  ],
  "Chwazi kalite anons": [
    "Chwazi kalite anons",
    "Choose listing type",
    "Choisir le type d’annonce"
  ],
  "🛍️ Biznis / Konpayi": [
    "🛍️ Biznis / Konpayi",
    "🛍️ Business / Company",
    "🛍️ Entreprise / Société"
  ],
  "🏠 Byen / Pwopriyete": [
    "🏠 Byen / Pwopriyete",
    "🏠 Property",
    "🏠 Bien / Propriété"
  ],
  "Chwazi yon kategori": [
    "Chwazi yon kategori",
    "Choose a category",
    "Choisir une catégorie"
  ],
  "🍽 Restoran": [
    "🍽 Restoran",
    "🍽 Restaurant",
    "🍽 Restaurant"
  ],
  "🛒 Komès": [
    "🛒 Komès",
    "🛒 Retail",
    "🛒 Commerce"
  ],
  "🔧 Sèvis jeneral": [
    "🔧 Sèvis jeneral",
    "🔧 General services",
    "🔧 Services généraux"
  ],
  "🏗️ Konstriksyon": [
    "🏗️ Konstriksyon",
    "🏗️ Construction",
    "🏗️ Construction"
  ],
  "🚗 Transpò": [
    "🚗 Transpò",
    "🚗 Transportation",
    "🚗 Transport"
  ],
  "🧹 Netwayaj": [
    "🧹 Netwayaj",
    "🧹 Cleaning",
    "🧹 Nettoyage"
  ],
  "🔧 Reparasyon": [
    "🔧 Reparasyon",
    "🔧 Repairs",
    "🔧 Réparation"
  ],
  "🚰 Plonbri": [
    "🚰 Plonbri",
    "🚰 Plumbing",
    "🚰 Plomberie"
  ],
  "⚡ Elektrisite": [
    "⚡ Elektrisite",
    "⚡ Electrical",
    "⚡ Électricité"
  ],
  "💄 Beauty / Bote": [
    "💄 Beauty / Bote",
    "💄 Beauty",
    "💄 Beauté"
  ],
  "🍔 Manje": [
    "🍔 Manje",
    "🍔 Food",
    "🍔 Alimentation"
  ],
  "💻 Digital Services": [
    "💻 Digital Services",
    "💻 Digital Services",
    "💻 Services numériques"
  ],
  "💻 IT / Teknoloji": [
    "💻 IT / Teknoloji",
    "💻 IT / Technology",
    "💻 Informatique / Technologie"
  ],
  "👗 Kouti / Rad": [
    "👗 Kouti / Rad",
    "👗 Sewing / Clothing",
    "👗 Couture / Vêtements"
  ],
  "💇🏾 Bote / Barber": [
    "💇🏾 Bote / Barber",
    "💇🏾 Beauty / Barber",
    "💇🏾 Beauté / Barbier"
  ],
  "🏠 Imobilye": [
    "🏠 Imobilye",
    "🏠 Real Estate",
    "🏠 Immobilier"
  ],
  "🚗 Machin / Veyikil": [
    "🚗 Machin / Veyikil",
    "🚗 Cars / Vehicles",
    "🚗 Voitures / Véhicules"
  ],
  "📦 Lòt": [
    "📦 Lòt",
    "📦 Other",
    "📦 Autre"
  ],
  "WhatsApp": [
    "WhatsApp",
    "WhatsApp",
    "WhatsApp"
  ],
  "Pri / Tarif": [
    "Pri / Tarif",
    "Price / Rate",
    "Prix / Tarif"
  ],
  "📸 Foto (1 foto, max 5MB)": [
    "📸 Foto (1 foto, max 5MB)",
    "📸 Photo (1 photo, max 5MB)",
    "📸 Photo (1 photo, max 5 Mo)"
  ],
  "📢 Pibliye Anons": [
    "📢 Pibliye Anons",
    "📢 Publish Listing",
    "📢 Publier l’annonce"
  ],
  "EAGLE-J COMMUNITY": [
    "EAGLE-J COMMUNITY",
    "EAGLE-J COMMUNITY",
    "COMMUNAUTÉ EAGLE-J"
  ],
  "Manm kominote a": [
    "Manm kominote a",
    "Community members",
    "Membres de la communauté"
  ],
  "⏳ Ap chaje...": [
    "⏳ Ap chaje...",
    "⏳ Loading...",
    "⏳ Chargement..."
  ],
  "Itilizatè yo ap chaje...": [
    "Itilizatè yo ap chaje...",
    "Users are loading...",
    "Chargement des utilisateurs..."
  ],
  "Développez votre réseau": [
    "Développez votre réseau",
    "Grow your network",
    "Développez votre réseau"
  ],
  "Connect with people, discover jobs and services, promote your business, and find opportunities anywhere in the world.": [
    "Konekte ak moun, dekouvri travay ak sèvis, fè pwomosyon pou biznis ou, epi jwenn opòtinite nenpòt kote nan mond lan.",
    "Connect with people, discover jobs and services, promote your business, and find opportunities anywhere in the world.",
    "Connectez-vous avec des personnes, découvrez des emplois et des services, faites connaître votre entreprise et trouvez des opportunités partout dans le monde."
  ],
  "Create Account": [
    "Kreye Kont",
    "Create Account",
    "Créer un compte"
  ],
  "Find Jobs": [
    "Chèche Travay",
    "Find Jobs",
    "Chercher un emploi"
  ],
  "Have a business, service, or professional offering?": [
    "Èske ou gen yon biznis, sèvis oswa yon òf pwofesyonèl?",
    "Have a business, service, or professional offering?",
    "Vous avez une entreprise, un service ou une offre professionnelle ?"
  ],
  "Put what you offer in front of people looking for products, services, professionals, and opportunities.": [
    "Mete sa ou ofri devan moun k ap chèche pwodwi, sèvis, pwofesyonèl ak opòtinite.",
    "Put what you offer in front of people looking for products, services, professionals, and opportunities.",
    "Présentez votre offre aux personnes qui recherchent des produits, des services, des professionnels et des opportunités."
  ],
  "📢 Create a Listing": [
    "📢 Kreye yon Anons",
    "📢 Create a Listing",
    "📢 Créer une annonce"
  ],
  "Explore what is available": [
    "Dekouvri sa ki disponib",
    "Explore what is available",
    "Découvrez ce qui est disponible"
  ],
  "Browse jobs, businesses, members, and listings from different locations.": [
    "Gade travay, biznis, manm ak anons ki soti nan diferan lokalizasyon.",
    "Browse jobs, businesses, members, and listings from different locations.",
    "Parcourez les emplois, entreprises, membres et annonces de différentes localisations."
  ],
  "💼 Jobs": [
    "💼 Travay",
    "💼 Jobs",
    "💼 Emplois"
  ],
  "View jobs →": [
    "Gade travay →",
    "View jobs →",
    "Voir les emplois →"
  ],
  "🛍️ Businesses": [
    "🛍️ Biznis",
    "🛍️ Businesses",
    "🛍️ Entreprises"
  ],
  "Explore businesses →": [
    "Dekouvri biznis →",
    "Explore businesses →",
    "Découvrir les entreprises →"
  ],
  "👥 Members": [
    "👥 Manm",
    "👥 Members",
    "👥 Membres"
  ],
  "View members →": [
    "Gade manm yo →",
    "View members →",
    "Voir les membres →"
  ],
  "📢 Listings": [
    "📢 Anons",
    "📢 Listings",
    "📢 Annonces"
  ],
  "View listings →": [
    "Gade anons yo →",
    "View listings →",
    "Voir les annonces →"
  ],
  "One platform. Many possibilities.": [
    "Yon platfòm. Anpil posiblite.",
    "One platform. Many possibilities.",
    "Une plateforme. De nombreuses possibilités."
  ],
  "Find opportunities, showcase what you offer, and connect directly with people and organizations around the world.": [
    "Jwenn opòtinite, montre sa ou ofri, epi konekte dirèkteman ak moun ak òganizasyon atravè mond lan.",
    "Find opportunities, showcase what you offer, and connect directly with people and organizations around the world.",
    "Trouvez des opportunités, présentez votre offre et connectez-vous directement avec des personnes et des organisations dans le monde entier."
  ],
  "01 • JOBS": [
    "01 • TRAVAY",
    "01 • JOBS",
    "01 • EMPLOIS"
  ],
  "💼 Find a Job": [
    "💼 Jwenn yon Travay",
    "💼 Find a Job",
    "💼 Trouver un emploi"
  ],
  "Search for opportunities by title, company, location, and job type.": [
    "Chèche opòtinite selon tit, konpayi, lokalizasyon ak kalite travay.",
    "Search for opportunities by title, company, location, and job type.",
    "Recherchez des opportunités par titre, entreprise, localisation et type d’emploi."
  ],
  "Browse Jobs →": [
    "Gade Travay →",
    "Browse Jobs →",
    "Parcourir les emplois →"
  ],
  "02 • BUSINESS": [
    "02 • BIZNIS",
    "02 • BUSINESS",
    "02 • ENTREPRISES"
  ],
  "🛍️ Discover Businesses": [
    "🛍️ Dekouvri Biznis",
    "🛍️ Discover Businesses",
    "🛍️ Découvrir les entreprises"
  ],
  "Find businesses, professionals, employers, services, and local offerings.": [
    "Jwenn biznis, pwofesyonèl, anplwayè, sèvis ak òf lokal.",
    "Find businesses, professionals, employers, services, and local offerings.",
    "Trouvez des entreprises, des professionnels, des employeurs, des services et des offres locales."
  ],
  "Explore Businesses →": [
    "Dekouvri Biznis →",
    "Explore Businesses →",
    "Découvrir les entreprises →"
  ],
  "03 • LISTINGS": [
    "03 • ANONS",
    "03 • LISTINGS",
    "03 • ANNONCES"
  ],
  "📢 Publish What You Offer": [
    "📢 Pibliye Sa Ou Ofri",
    "📢 Publish What You Offer",
    "📢 Publiez ce que vous proposez"
  ],
  "Promote your business, service, professional skills, products, or property.": [
    "Fè pwomosyon pou biznis, sèvis, konpetans pwofesyonèl, pwodwi oswa pwopriyete ou.",
    "Promote your business, service, professional skills, products, or property.",
    "Faites la promotion de votre entreprise, de vos services, compétences, produits ou biens."
  ],
  "Create a Listing →": [
    "Kreye yon Anons →",
    "Create a Listing →",
    "Créer une annonce →"
  ],
  "How it works": [
    "Kijan sa mache",
    "How it works",
    "Comment ça marche"
  ],
  "Create an Account": [
    "Kreye yon Kont",
    "Create an Account",
    "Créer un compte"
  ],
  "Build your profile and unlock access to opportunities.": [
    "Kreye pwofil ou epi jwenn aksè ak opòtinite yo.",
    "Build your profile and unlock access to opportunities.",
    "Créez votre profil et accédez aux opportunités."
  ],
  "Search or Publish": [
    "Chèche oswa Pibliye",
    "Search or Publish",
    "Rechercher ou publier"
  ],
  "Find a job, discover a service, or publish your own offering.": [
    "Jwenn yon travay, dekouvri yon sèvis oswa pibliye sa ou ofri.",
    "Find a job, discover a service, or publish your own offering.",
    "Trouvez un emploi, découvrez un service ou publiez votre propre offre."
  ],
  "Connect Directly": [
    "Konekte Dirèkteman",
    "Connect Directly",
    "Connectez-vous directement"
  ],
  "Reach people, businesses, and employers connected to your goals.": [
    "Jwenn moun, biznis ak anplwayè ki konekte ak objektif ou.",
    "Reach people, businesses, and employers connected to your goals.",
    "Contactez des personnes, entreprises et employeurs liés à vos objectifs."
  ],
  "Your next opportunity can start with one connection.": [
    "Pwochen opòtinite ou a ka kòmanse ak yon sèl koneksyon.",
    "Your next opportunity can start with one connection.",
    "Votre prochaine opportunité peut commencer par une seule connexion."
  ],
  "Create your account and start discovering what is available around you and around the world.": [
    "Kreye kont ou epi kòmanse dekouvri sa ki disponib bò kote ou ak atravè mond lan.",
    "Create your account and start discovering what is available around you and around the world.",
    "Créez votre compte et commencez à découvrir ce qui est disponible autour de vous et dans le monde."
  ],
  "Contact Us": [
    "Kontakte Nou",
    "Contact Us",
    "Nous contacter"
  ],
  "Home": [
    "Akèy",
    "Home",
    "Accueil"
  ],
  "Jobs": [
    "Travay",
    "Jobs",
    "Emplois"
  ],
  "Business": [
    "Biznis",
    "Business",
    "Entreprise"
  ],
  "Listings": [
    "Anons",
    "Listings",
    "Annonces"
  ],
  "Contact": [
    "Kontak",
    "Contact",
    "Contact"
  ],
  "Register": [
    "Enskri",
    "Register",
    "S'inscrire"
  ],
  "Members": [
    "Manm",
    "Members",
    "Membres"
  ],
  "Connect people, discover opportunities, and grow anywhere in the world.": [
    "Konekte ak moun, dekouvri opòtinite epi grandi nenpòt kote nan mond lan.",
    "Connect people, discover opportunities, and grow anywhere in the world.",
    "Connectez-vous avec des personnes, découvrez des opportunités et grandissez partout dans le monde."
  ],
  "Worldwide • Opportunities • Connections": [
    "Atravè mond lan • Opòtinite • Koneksyon",
    "Worldwide • Opportunities • Connections",
    "Monde entier • Opportunités • Connexions"
  ]
};

  const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

    /* Expose the shared translation table to language.js. */
  window.EJC_TRANSLATIONS = T;

function lang(){
    if(window.EagleJLanguage && typeof window.EagleJLanguage.getLanguage === "function"){
      return window.EagleJLanguage.getLanguage();
    }
    return localStorage.getItem("eagleJConnectLanguage") || localStorage.getItem("selectedLanguage") || "ht";
  }

  function tr(original, language=lang()){
    const key = norm(original);
    const row = T[key];
    if(row) {
      const map = {ht:0,en:1,fr:2};
      return row[map[language] ?? 1] || row[1] || original;
    }
    return original;
  }

  window.EJC = window.EJC || {};
  window.EJC.t = tr;
  window.EJC.language = lang;

  function translateTextNodes(){
    /*
      Eagle-J Connect now uses language.js as the single global
      translation engine. Keeping a second DOM translator here caused
      pages to switch back to their original text. Re-apply the main
      engine instead, including dynamically created elements.
    */
    if(window.EagleJLanguage && typeof window.EagleJLanguage.applyLanguage === "function"){
      window.EagleJLanguage.applyLanguage(window.EagleJLanguage.getLanguage());
    }
  }

  function injectOnlineUI(){
    if(document.getElementById("ejcOnlineWidget")) return;

    const widget=document.createElement("div");
    widget.id="ejcOnlineWidget";
    widget.className="ejc-online-widget";
    widget.innerHTML='<span class="ejc-online-dot">●</span><span id="ejcOnlineText">🟢 1 online</span>';
    document.body.appendChild(widget);

    const toast=document.createElement("div");
    toast.id="ejcToast";
    toast.className="ejc-toast";
    document.body.appendChild(toast);
  }

  function showToast(text){
    const el=document.getElementById("ejcToast");
    if(!el) return;
    el.textContent=text;
    el.classList.add("show");
    clearTimeout(window.__ejcToastTimer);
    window.__ejcToastTimer=setTimeout(()=>el.classList.remove("show"),4200);
  }

  function updateOnline(count){
    const el=document.getElementById("ejcOnlineText");
    if(!el) return;
    const l=lang();
    const label = l==="ht"
      ? `${count} moun konekte`
      : l==="fr"
        ? `${count} personne${count>1?"s":""} en ligne`
        : `${count} person${count>1?"s":""} online`;
    el.textContent="🟢 "+label;
  }

  async function startPresence(){
    if(!window.WebSocket && !window.fetch) return;
    injectOnlineUI();

    const sessionId = sessionStorage.getItem("ejc_presence_id") ||
      (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
    sessionStorage.setItem("ejc_presence_id", sessionId);

    const wsUrl = SUPABASE_URL.replace(/^http/,"ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(SUPABASE_KEY) + "&vsn=1.0.0";
    let socket;
    try {
      socket = new WebSocket(wsUrl);
    } catch(e) {
      return;
    }

    let ref=1;
    let joined=false;
    let selfRef=String(ref++);
    let heartbeat;

    const send=(payload)=>{ if(socket.readyState===1) socket.send(JSON.stringify(payload)); };

    socket.addEventListener("open",()=>{
      send({topic:"realtime:eagle-j-connect-online",event:"phx_join",payload:{config:{presence:{key:sessionId}}},ref:selfRef});
      heartbeat=setInterval(()=>send({topic:"phoenix",event:"heartbeat",payload:{},ref:String(ref++)}),25000);
    });

    socket.addEventListener("message",event=>{
      let msg;
      try{ msg=JSON.parse(event.data); }catch(e){ return; }

      if(msg.event==="phx_reply" && msg.ref===selfRef){
        joined=true;
      }

      if(msg.topic==="realtime:eagle-j-connect-online" && msg.event==="presence_state"){
        const state=msg.payload || {};
        updateOnline(Math.max(1,Object.keys(state).length));
      }

      if(msg.topic==="realtime:eagle-j-connect-online" && msg.event==="presence_diff"){
        const joins=msg.payload?.joins || {};
        const leaves=msg.payload?.leaves || {};
        if(Object.keys(joins).length) {
          updateOnline(currentOnlineCount()+Object.keys(joins).length);
          if(joined) showToast(lang()==="ht" ? "👋 Gen yon moun ki fèk konekte." : lang()==="fr" ? "👋 Une personne vient de se connecter." : "👋 Someone just connected.");
        }
        if(Object.keys(leaves).length) updateOnline(Math.max(1,currentOnlineCount()-Object.keys(leaves).length));
      }
    });

    socket.addEventListener("close",()=>clearInterval(heartbeat));

    function currentOnlineCount(){
      const el=document.getElementById("ejcOnlineText");
      if(!el) return 1;
      const m=el.textContent.match(/(\d+)/);
      return m ? Number(m[1]) : 1;
    }

    window.addEventListener("beforeunload",()=>{
      try{ socket.close(); }catch(e){}
    });
  }

  function addGoogleButton(){
    const form=document.getElementById("loginForm");
    if(!form || document.getElementById("googleLoginBtn")) return;

    const wrap=document.createElement("div");
    wrap.className="google-login-wrap";
    wrap.innerHTML=`
      <div class="google-divider"><span>OR</span></div>
      <button type="button" id="googleLoginBtn" class="google-login-btn">
        <span class="google-g">G</span>
        <span data-google-label>Continue with Google</span>
      </button>`;
    form.insertAdjacentElement("afterend",wrap);

    const label=wrap.querySelector("[data-google-label]");
    const update=()=>{ label.textContent = lang()==="ht" ? "Kontinye ak Google" : lang()==="fr" ? "Continuer avec Google" : "Continue with Google"; };
    update();

    const selector=document.getElementById("languageSelect");
    selector?.addEventListener("change",()=>setTimeout(update,20));

    document.getElementById("googleLoginBtn").addEventListener("click",()=>{
      const redirect = location.origin + location.pathname;
      const url = SUPABASE_URL + "/auth/v1/authorize?provider=google&redirect_to=" +
        encodeURIComponent(redirect) + "&flow_type=implicit";
      location.href=url;
    });
  }

  async function finishGoogleLogin(){
    const hash = new URLSearchParams(location.hash.replace(/^#/,""));
    const access=hash.get("access_token");
    const refresh=hash.get("refresh_token");
    if(!access) return false;

    try{
      localStorage.setItem("supabase_access_token",access);
      if(refresh) localStorage.setItem("supabase_refresh_token",refresh);

      const r=await fetch(SUPABASE_URL+"/auth/v1/user",{
        headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+access}
      });
      if(!r.ok) throw new Error("Google session could not be verified.");
      const user=await r.json();

      localStorage.setItem("supabase_user",JSON.stringify(user));
      localStorage.setItem("supabase_user_id",user.id);
      localStorage.setItem("supabase_user_email",user.email||"");

      const profileR=await fetch(SUPABASE_URL+"/rest/v1/profiles?id=eq."+encodeURIComponent(user.id)+"&select=*",{
        headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+access}
      });
      const profiles=profileR.ok ? await profileR.json() : [];

      if(!Array.isArray(profiles) || !profiles.length){
        const meta=user.user_metadata || {};
        const fullName=meta.full_name || meta.name || (user.email||"").split("@")[0] || "Eagle-J Member";
        const insert=await fetch(SUPABASE_URL+"/rest/v1/profiles",{
          method:"POST",
          headers:{
            apikey:SUPABASE_KEY,
            Authorization:"Bearer "+access,
            "Content-Type":"application/json",
            Prefer:"return=representation"
          },
          body:JSON.stringify({
            id:user.id,
            full_name:fullName,
            email:user.email||"",
            phone:"",
            account_type:"job_seeker",
            account_status:"active"
          })
        });
        if(!insert.ok) throw new Error("Google account was authenticated, but the profile could not be created. Run the profile INSERT policy in the SQL file included with this update.");
      } else {
        const p=profiles[0];
        if(p.account_status && p.account_status!=="active") throw new Error("Your account is not active.");
        localStorage.setItem("user_full_name",p.full_name||"");
        localStorage.setItem("user_phone",p.phone||"");
        localStorage.setItem("user_account_type",p.account_type||"");
      }

      history.replaceState(null,"",location.pathname+location.search);
      showToast(lang()==="ht" ? "✅ Google koneksyon an reyisi." : lang()==="fr" ? "✅ Connexion Google réussie." : "✅ Google login successful.");
      setTimeout(()=>{ location.href="dashboard.html"; },600);
      return true;
    }catch(e){
      console.error(e);
      const box=document.getElementById("loginMessage");
      if(box) box.textContent="❌ "+e.message;
      return false;
    }
  }

  function init(){
    injectOnlineUI();
    translateTextNodes();
    document.addEventListener("ejc-language-changed",()=>setTimeout(translateTextNodes,20));
    document.addEventListener("languageChanged",()=>setTimeout(translateTextNodes,20));
    const selector=document.getElementById("languageSelect");
    selector?.addEventListener("change",()=>setTimeout(translateTextNodes,30));
    addGoogleButton();
    finishGoogleLogin();
    startPresence();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();

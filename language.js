const translations = {

ht: {

"nav-home": "Akèy",
"nav-jobs": "Travay",
"nav-business": "Biznis",
"nav-contact": "Kontak",
"nav-register": "Enskri",

"hero-title": "Konekte Opòtinite ant Ayiti ak Bahamas",
"hero-text": "Jwenn travay, devlope biznis ou, pataje sèvis ou epi konekte ak kominote a.",

"create-account": "Kreye Kont",
"find-job": "Chèche Travay",

"stat-jobs": "Travay",
"stat-business": "Biznis",
"stat-users": "Itilizatè",
"stat-ads": "Anons",

"services-title": "Sèvis Eagle-J Connect",

"service-job-title": "💼 Travay",
"service-job-text": "Jwenn travay oswa pibliye opòtinite travay.",
"job-button": "Gade Travay",

"service-business-title": "🏢 Biznis",
"service-business-text": "Dekouvri biznis oswa fè pwomosyon pa w la.",
"business-button": "Vizite",

"service-ads-title": "📢 Anons",
"service-ads-text": "Pibliye sèvis ou oswa pwodwi ou pou kominote a.",
"ads-button": "Kreye Anons",

"about-title": "Poukisa Eagle-J Connect?",
"about-text": "Nou kreye Eagle-J Connect pou ede kominote Ayiti ak Bahamas jwenn travay, devlope biznis, pataje sèvis epi kreye nouvo opòtinite.",

"community-title": "🌍 Kominote",
"community-text": "Konekte moun ant Ayiti ak Bahamas.",

"fast-title": "⚡ Rapid",
"fast-text": "Rechèch travay ak biznis fasil.",

"security-title": "🔒 Sekirite",
"security-text": "Platfòm ki fèt pou grandi ak konfyans.",

"footer-text": "Konekte Opòtinite ant Ayiti ak Bahamas."

},



en: {

"nav-home": "Home",
"nav-jobs": "Jobs",
"nav-business": "Business",
"nav-contact": "Contact",
"nav-register": "Register",

"hero-title": "Connecting Opportunities between Haiti and Bahamas",
"hero-text": "Find jobs, grow your business, share services and connect with the community.",

"create-account": "Create Account",
"find-job": "Find Jobs",

"stat-jobs": "Jobs",
"stat-business": "Businesses",
"stat-users": "Users",
"stat-ads": "Ads",

"services-title": "Eagle-J Connect Services",

"service-job-title": "💼 Jobs",
"service-job-text": "Find jobs or publish job opportunities.",
"job-button": "View Jobs",

"service-business-title": "🏢 Business",
"service-business-text": "Discover businesses or promote yours.",
"business-button": "Visit",

"service-ads-title": "📢 Ads",
"service-ads-text": "Publish your services or products for the community.",
"ads-button": "Create Ad",

"about-title": "Why Eagle-J Connect?",
"about-text": "We created Eagle-J Connect to help the Haiti and Bahamas communities find jobs, grow businesses and create opportunities.",

"community-title": "🌍 Community",
"community-text": "Connect people between Haiti and Bahamas.",

"fast-title": "⚡ Fast",
"fast-text": "Easy job and business search.",

"security-title": "🔒 Security",
"security-text": "A platform built to grow with trust.",

"footer-text": "Connecting Opportunities between Haiti and Bahamas."

},



fr: {

"nav-home": "Accueil",
"nav-jobs": "Emplois",
"nav-business": "Entreprise",
"nav-contact": "Contact",
"nav-register": "S'inscrire",

"hero-title": "Connecter les opportunités entre Haïti et les Bahamas",
"hero-text": "Trouvez un emploi, développez votre entreprise, partagez vos services et connectez-vous à la communauté.",

"create-account": "Créer un compte",
"find-job": "Chercher un emploi",

"stat-jobs": "Emplois",
"stat-business": "Entreprises",
"stat-users": "Utilisateurs",
"stat-ads": "Annonces",

"services-title": "Services Eagle-J Connect",

"service-job-title": "💼 Emploi",
"service-job-text": "Trouvez un emploi ou publiez une opportunité.",
"job-button": "Voir les emplois",

"service-business-title": "🏢 Entreprise",
"service-business-text": "Découvrez des entreprises ou présentez la vôtre.",
"business-button": "Visiter",

"service-ads-title": "📢 Annonces",
"service-ads-text": "Publiez vos services ou produits.",
"ads-button": "Créer une annonce",

"about-title": "Pourquoi Eagle-J Connect ?",
"about-text": "Nous avons créé Eagle-J Connect pour aider les communautés d'Haïti et des Bahamas à trouver des emplois et créer des opportunités.",

"community-title": "🌍 Communauté",
"community-text": "Connecter les personnes entre Haïti et les Bahamas.",

"fast-title": "⚡ Rapide",
"fast-text": "Recherche facile d'emploi et d'affaires.",

"security-title": "🔒 Sécurité",
"security-text": "Une plateforme construite avec confiance.",

"footer-text": "Connecter les opportunités entre Haïti et les Bahamas."

}

};



function changeLanguage(){

let lang = document.getElementById("languageSelect").value;


for(let id in translations[lang]){

let element = document.getElementById(id);

if(element){

element.textContent = translations[lang][id];

}

}


localStorage.setItem("language", lang);

}



// Kenbe lang itilizatè a chwazi a

window.onload = function(){

let savedLanguage = localStorage.getItem("language");

if(savedLanguage){

document.getElementById("languageSelect").value = savedLanguage;

changeLanguage();

}

};

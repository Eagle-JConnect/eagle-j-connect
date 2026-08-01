const translations = {

en: {
"nav-home":"Home",
"nav-jobs":"Jobs",
"nav-business":"Business",
"nav-contact":"Contact",
"nav-register":"Register",

"hero-title":"Connecting Opportunities between Haiti and Bahamas",
"hero-text":"Find jobs, grow your business, share services and connect with the community.",

"create-account":"Create Account",
"find-job":"Find Jobs",

"services-title":"Eagle-J Connect Services",

"about-title":"Why Eagle-J Connect?",

"footer-text":"Connecting Opportunities between Haiti and Bahamas.",


"jobs-title":"Job Opportunities",
"jobs-description":"Find available jobs in Bahamas and Haiti.",
"category-title":"Job Categories"

},



fr: {
"nav-home":"Accueil",
"nav-jobs":"Emplois",
"nav-business":"Entreprise",
"nav-contact":"Contact",
"nav-register":"S'inscrire",

"hero-title":"Connecter les opportunités entre Haïti et les Bahamas",
"hero-text":"Trouvez un emploi, développez votre entreprise et connectez-vous à la communauté.",

"create-account":"Créer un compte",
"find-job":"Chercher un emploi",

"services-title":"Services Eagle-J Connect",

"about-title":"Pourquoi Eagle-J Connect ?",

"footer-text":"Connecter les opportunités entre Haïti et les Bahamas.",


"jobs-title":"Opportunités d'emploi",
"jobs-description":"Trouvez les emplois disponibles aux Bahamas et en Haïti.",
"category-title":"Catégories d'emploi"

},



ht: {
"nav-home":"Akèy",
"nav-jobs":"Travay",
"nav-business":"Biznis",
"nav-contact":"Kontak",
"nav-register":"Enskri",

"hero-title":"Konekte Opòtinite ant Ayiti ak Bahamas",
"hero-text":"Jwenn travay, devlope biznis ou, pataje sèvis ou epi konekte ak kominote a.",

"create-account":"Kreye Kont",
"find-job":"Chèche Travay",

"services-title":"Sèvis Eagle-J Connect",

"about-title":"Poukisa Eagle-J Connect?",

"footer-text":"Konekte Opòtinite ant Ayiti ak Bahamas.",


"jobs-title":"Opòtinite Travay",
"jobs-description":"Jwenn travay ki disponib nan Bahamas ak Ayiti.",
"category-title":"Kategori Travay"

}

};



function changeLanguage(){

let lang = document.getElementById("languageSelect").value;


let elements = translations[lang];


for(let id in elements){

let item = document.getElementById(id);

if(item){

item.innerHTML = elements[id];

}

}

}

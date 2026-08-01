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
"category-title":"Job Categories",

"search-job":"Search jobs...",

"apply-button":"Apply",

"how-title":"How does it work?",

"step-one":"1️⃣ Create Account",
"step-two":"2️⃣ Search Jobs",
"step-three":"3️⃣ Apply"

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
"category-title":"Catégories d'emploi",

"search-job":"Rechercher un emploi...",

"apply-button":"Postuler",

"how-title":"Comment ça marche ?",

"step-one":"1️⃣ Créer un compte",
"step-two":"2️⃣ Chercher un emploi",
"step-three":"3️⃣ Postuler"

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
"category-title":"Kategori Travay",

"search-job":"Chèche travay...",

"apply-button":"Aplike",

"how-title":"Kijan sa mache?",

"step-one":"1️⃣ Kreye Kont",
"step-two":"2️⃣ Chèche Travay",
"step-three":"3️⃣ Aplike"

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


// Sove lang ou chwazi a
localStorage.setItem("selectedLanguage", lang);

}




// Chaje dènye lang lan lè nenpòt paj ouvri

document.addEventListener("DOMContentLoaded", function(){

let savedLanguage = localStorage.getItem("selectedLanguage");

let selector = document.getElementById("languageSelect");


if(savedLanguage && selector){

selector.value = savedLanguage;

applyLanguage(savedLanguage);

}

});



function changeLanguage(){

let lang = document.getElementById("languageSelect").value;

localStorage.setItem("selectedLanguage", lang);

applyLanguage(lang);

}



function applyLanguage(lang){

let elements = translations[lang];


for(let id in elements){

let item = document.getElementById(id);

if(item){

item.innerHTML = elements[id];

}

}

}

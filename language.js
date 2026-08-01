const translations = {

ht: {
    home: "Akèy",
    jobs: "Travay",
    about: "Konsènan nou",
    contact: "Kontak",
    welcome: "Byenveni sou Eagle-J Connect"
},

en: {
    home: "Home",
    jobs: "Jobs",
    about: "About Us",
    contact: "Contact",
    welcome: "Welcome to Eagle-J Connect"
},

fr: {
    home: "Accueil",
    jobs: "Emplois",
    about: "À propos",
    contact: "Contact",
    welcome: "Bienvenue sur Eagle-J Connect"
}

};


function changeLanguage(){

let lang = document.getElementById("languageSelect").value;

document.querySelector("#home").textContent = translations[lang].home;
document.querySelector("#jobs").textContent = translations[lang].jobs;
document.querySelector("#about").textContent = translations[lang].about;
document.querySelector("#contact").textContent = translations[lang].contact;
document.querySelector("#welcome").textContent = translations[lang].welcome;

}

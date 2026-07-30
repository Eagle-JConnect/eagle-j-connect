const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

menuBtn.onclick = function() {
    navMenu.classList.toggle("show");
};

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

menuBtn.addEventListener("click", () => {
    if (navMenu.style.display === "flex") {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "flex";
    }
});

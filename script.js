document.addEventListener("DOMContentLoaded", function () {
    console.log("Eagle-J Connect ap mache!");

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Fonksyon sa a ap disponib byento. Mèsi paske w ap teste Eagle-J Connect!");
        });
    });
});
function toggleMenu() {

    const menu = document.getElementById("menu");

    menu.classList.toggle("show");

}

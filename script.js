/* ======================================
   EAGLE-J CONNECT
   SCRIPT.JS
====================================== */


document.addEventListener("DOMContentLoaded", function () {

    console.log("Eagle-J Connect ap mache!");


    /* ======================================
       MOBILE MENU
    ====================================== */

    const menu = document.getElementById("menu");

    window.toggleMenu = function () {

        if (menu) {
            menu.classList.toggle("show");
        }

    };


    /* ======================================
       BUSINESS FORM
    ====================================== */

    const businessForm =
        document.getElementById("businessForm");


    if (businessForm) {

        businessForm.addEventListener("submit", function (e) {

            e.preventDefault();


            /* =========================
               GET FORM INFORMATION
            ========================= */

            const businessName =
                document.getElementById("businessName").value.trim();

            const category =
                document.getElementById("category").value;

            const location =
                document.getElementById("location").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const whatsapp =
                document.getElementById("whatsapp").value.trim();

            const price =
                document.getElementById("price").value.trim();

            const description =
                document.getElementById("description").value.trim();

            const imageInput =
                document.getElementById("businessImage");


            /* =========================
               CHECK REQUIRED FIELDS
            ========================= */

            if (
                !businessName ||
                !category ||
                !location ||
                !description
            ) {

                showMessage(
                    "⚠️ Tanpri ranpli tout chan ki obligatwa yo.",
                    "error"
                );

                return;
            }


            /* =========================
               CREATE BUSINESS
            ========================= */

            const business = {

                id: Date.now(),

                businessName: businessName,

                category: category,

                location: location,

                phone: phone,

                whatsapp: whatsapp,

                price: price,

                description: description,

                image: "",

                date: new Date().toLocaleDateString()

            };


            /* =========================
               IMAGE
            ========================= */

            if (
                imageInput &&
                imageInput.files &&
                imageInput.files.length > 0
            ) {

                const file =
                    imageInput.files[0];

                const reader =
                    new FileReader();


                reader.onload = function () {

                    business.image =
                        reader.result;

                    saveBusiness(business);

                };


                reader.readAsDataURL(file);

            } else {

                saveBusiness(business);

            }

        });

    }


    /* ======================================
       DISPLAY BUSINESS ADS
    ====================================== */

    const businessListings =
        document.getElementById("businessListings");


    if (businessListings) {

        displayBusinesses();

    }


});


/* ======================================
   SAVE BUSINESS
====================================== */

function saveBusiness(business) {

    let businesses =
        JSON.parse(
            localStorage.getItem("eagleJBusinesses")
        ) || [];


    businesses.push(business);


    localStorage.setItem(
        "eagleJBusinesses",
        JSON.stringify(businesses)
    );


    showMessage(
        "✅ Anons ou a pibliye avèk siksè!",
        "success"
    );


    const form =
        document.getElementById("businessForm");


    if (form) {

        form.reset();

    }

}


/* ======================================
   SHOW MESSAGE
====================================== */

function showMessage(message, type) {

    const messageBox =
        document.getElementById("formMessage");


    if (!messageBox) {

        alert(message);

        return;

    }


    messageBox.textContent =
        message;


    if (type === "success") {

        messageBox.style.color =
            "green";

    } else {

        messageBox.style.color =
            "red";

    }

}


/* ======================================
   DISPLAY BUSINESSES
====================================== */

function displayBusinesses() {

    const businessListings =
        document.getElementById("businessListings");


    if (!businessListings) return;


    const businesses =
        JSON.parse(
            localStorage.getItem("eagleJBusinesses")
        ) || [];


    if (businesses.length === 0) {

        businessListings.innerHTML = `

            <p style="
                text-align:center;
                width:100%;
                color:#666;
            ">

                Pa gen nouvo anons pou kounye a.

            </p>

        `;

        return;

    }


    businessListings.innerHTML = "";


    /* Nouvo anons yo parèt an premye */

    businesses
        .slice()
        .reverse()
        .forEach(function (business) {


            let imageHTML = "";


            if (business.image) {

                imageHTML = `

                    <img
                        src="${business.image}"
                        alt="${business.businessName}"
                        style="
                            width:100%;
                            height:180px;
                            object-fit:cover;
                            border-radius:10px;
                            margin-bottom:15px;
                        "
                    >

                `;

            }


            let whatsappButton = "";


            if (business.whatsapp) {

                const whatsappNumber =
                    business.whatsapp.replace(/\D/g, "");


                whatsappButton = `

                    <a
                        href="https://wa.me/${whatsappNumber}"
                        target="_blank"
                        rel="noopener"
                        style="text-decoration:none;"
                    >

                        <button type="button">
                            💬 WhatsApp
                        </button>

                    </a>

                `;

            }


            let phoneButton = "";


            if (business.phone) {

                phoneButton = `

                    <a
                        href="tel:${business.phone}"
                        style="text-decoration:none;"
                    >

                        <button type="button">
                            📞 Rele Biznis
                        </button>

                    </a>

                `;

            }


            businessListings.innerHTML += `

                <div class="card">

                    ${imageHTML}


                    <h3>
                        ${business.businessName}
                    </h3>


                    <p>
                        📂 ${business.category}
                    </p>


                    <p>
                        📍 ${business.location}
                    </p>


                    ${
                        business.price
                        ? `
                            <p>
                                💰 ${business.price}
                            </p>
                        `
                        : ""
                    }


                    <p>
                        ${business.description}
                    </p>


                    <div style="
                        display:flex;
                        gap:10px;
                        justify-content:center;
                        flex-wrap:wrap;
                        margin-top:15px;
                    ">

                        ${whatsappButton}

                        ${phoneButton}

                    </div>


                    <small style="
                        display:block;
                        margin-top:15px;
                        color:#888;
                    ">

                        📅 ${business.date}

                    </small>

                </div>

            `;

        });

}

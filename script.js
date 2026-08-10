/* ======================================
   EAGLE-J CONNECT
   SUPABASE BUSINESS SYSTEM
====================================== */


/* ======================================
   SUPABASE CONNECTION
====================================== */

const SUPABASE_URL =
    "https://glwyqrvufmjscjbbszzz.supabase.co";

const SUPABASE_KEY =
    "YOUR_PUBLISHABLE_KEY";


/* ======================================
   MOBILE MENU
====================================== */

window.toggleMenu = function () {

    const menu =
        document.getElementById("menu");

    if (menu) {
        menu.classList.toggle("show");
    }

};


/* ======================================
   BUSINESS FORM
====================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Eagle-J Connect ap mache!");

    const businessForm =
        document.getElementById("businessForm");


    if (businessForm) {

        businessForm.addEventListener(
            "submit",
            submitBusiness
        );

    }


    /* Load businesses */

    const businessListings =
        document.getElementById(
            "businessListings"
        );

    if (businessListings) {

        loadBusinesses();

    }

});


/* ======================================
   SUBMIT BUSINESS
====================================== */

async function submitBusiness(event) {

    event.preventDefault();


    const businessName =
        document
            .getElementById("businessName")
            .value
            .trim();


    const category =
        document
            .getElementById("category")
            .value;


    const location =
        document
            .getElementById("location")
            .value
            .trim();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const whatsapp =
        document
            .getElementById("whatsapp")
            .value
            .trim();


    const price =
        document
            .getElementById("price")
            .value
            .trim();


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    const imageInput =
        document.getElementById(
            "businessImage"
        );


    /* Required fields */

    if (
        !businessName ||
        !category ||
        !location ||
        !description
    ) {

        showMessage(
            "⚠️ Tanpri ranpli tout chan obligatwa yo.",
            "error"
        );

        return;

    }


    /* ======================================
       INSERT INTO SUPABASE
    ====================================== */

    try {

        showMessage(
            "⏳ Anons lan ap pibliye...",
            "success"
        );


        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/businesses`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Prefer":
                            "return=representation"

                    },

                    body: JSON.stringify({

                        business_name:
                            businessName,

                        category:
                            category,

                        location:
                            location,

                        phone:
                            phone || null,

                        whatsapp:
                            whatsapp || null,

                        price:
                            price || null,

                        description:
                            description,

                        image_url:
                            null

                    })

                }
            );


        /* Check response */

        if (!response.ok) {

            const error =
                await response.text();

            console.error(
                "Supabase error:",
                error
            );

            showMessage(
                "❌ Anons lan pa t kapab pibliye. Verifye koneksyon Supabase la.",
                "error"
            );

            return;

        }


        /* Success */

        const data =
            await response.json();

        console.log(
            "Business saved:",
            data
        );


        showMessage(
            "✅ Anons ou a pibliye avèk siksè!",
            "success"
        );


        document
            .getElementById("businessForm")
            .reset();


    } catch (error) {

        console.error(error);

        showMessage(
            "❌ Gen yon pwoblèm koneksyon.",
            "error"
        );

    }

}


/* ======================================
   LOAD BUSINESSES
====================================== */

async function loadBusinesses() {

    const container =
        document.getElementById(
            "businessListings"
        );


    if (!container) return;


    try {

        container.innerHTML = `
            <p style="
                width:100%;
                text-align:center;
            ">
                ⏳ Anons yo ap chaje...
            </p>
        `;


        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/businesses?select=*&order=created_at.desc`,
                {

                    method: "GET",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`

                    }

                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            console.error(
                "Supabase error:",
                error
            );

            container.innerHTML = `
                <p style="
                    width:100%;
                    text-align:center;
                    color:red;
                ">
                    ❌ Nou pa kapab chaje anons yo.
                </p>
            `;

            return;

        }


        const businesses =
            await response.json();


        if (!businesses.length) {

            container.innerHTML = `
                <p style="
                    width:100%;
                    text-align:center;
                    color:#666;
                ">
                    Pa gen anons biznis pou kounye a.
                </p>
            `;

            return;

        }


        container.innerHTML = "";


        businesses.forEach(
            function (business) {


                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "card";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            business.business_name
                        )}
                    </h3>

                    <p>
                        📂 ${escapeHTML(
                            business.category
                        )}
                    </p>

                    <p>
                        📍 ${escapeHTML(
                            business.location
                        )}
                    </p>

                    ${
                        business.price
                        ? `
                            <p>
                                💰 ${escapeHTML(
                                    business.price
                                )}
                            </p>
                        `
                        : ""
                    }

                    <p>
                        ${escapeHTML(
                            business.description
                        )}
                    </p>

                    ${
                        business.phone
                        ? `
                            <p>
                                📞 ${escapeHTML(
                                    business.phone
                                )}
                            </p>
                        `
                        : ""
                    }

                    ${
                        business.whatsapp
                        ? `
                            <a
                                href="https://wa.me/${business.whatsapp.replace(/\D/g, "")}"
                                target="_blank"
                                rel="noopener"
                                style="
                                    text-decoration:none;
                                "
                            >
                                <button
                                    type="button"
                                >
                                    💬 WhatsApp
                                </button>
                            </a>
                        `
                        : ""
                    }

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p style="
                width:100%;
                text-align:center;
                color:red;
            ">
                ❌ Erè koneksyon.
            </p>
        `;

    }

}


/* ======================================
   MESSAGE
====================================== */

function showMessage(
    message,
    type
) {

    const messageBox =
        document.getElementById(
            "formMessage"
        );


    if (!messageBox) {

        alert(message);

        return;

    }


    messageBox.textContent =
        message;


    messageBox.style.color =
        type === "success"
        ? "green"
        : "red";

}


/* ======================================
   SECURITY
====================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;

}

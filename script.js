/* ======================================
   EAGLE-J CONNECT
   BUSINESS SYSTEM + SUPABASE
====================================== */


/* ======================================
   SUPABASE CONNECTION
====================================== */

const SUPABASE_URL =
    "https://glwyqrvufmjscjbbszzz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";


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
   PAGE READY
====================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Eagle-J Connect ap mache!"
        );


        /* =========================
           BUSINESS FORM
        ========================= */

        const businessForm =
            document.getElementById(
                "businessForm"
            );


        if (businessForm) {

            businessForm.addEventListener(
                "submit",
                submitBusiness
            );

        }


        /* =========================
           BUSINESS LIST
        ========================= */

        const businessListings =
            document.getElementById(
                "businessListings"
            );


        if (businessListings) {

            loadBusinesses();

        }

    }
);


/* ======================================
   CREATE BUSINESS
====================================== */

async function submitBusiness(event) {

    event.preventDefault();


    /* =========================
       GET FORM VALUES
    ========================= */

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
            "⚠️ Tanpri ranpli tout chan obligatwa yo.",
            "error"
        );

        return;

    }


    /* =========================
       SHOW LOADING
    ========================= */

    showMessage(
        "⏳ Anons lan ap pibliye...",
        "success"
    );


    try {

        /* =========================
           SEND TO SUPABASE
        ========================= */

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


        /* =========================
           GET RESPONSE
        ========================= */

        const responseText =
            await response.text();


        console.log(
            "Supabase status:",
            response.status
        );


        console.log(
            "Supabase response:",
            responseText
        );


        /* =========================
           CHECK ERROR
        ========================= */

        if (!response.ok) {

            console.error(
                "SUPABASE ERROR:",
                responseText
            );


            showMessage(
                "❌ Anons lan pa t kapab pibliye.",
                "error"
            );


            return;

        }


        /* =========================
           SUCCESS
        ========================= */

        showMessage(
            "✅ Anons ou a pibliye avèk siksè!",
            "success"
        );


        /* =========================
           RESET FORM
        ========================= */

        const form =
            document.getElementById(
                "businessForm"
            );


        if (form) {

            form.reset();

        }

    }


    catch (error) {

        console.error(
            "CONNECTION ERROR:",
            error
        );


        showMessage(
            "❌ Gen yon pwoblèm koneksyon.",
            "error"
        );

    }

}


/* ======================================
   LOAD BUSINESS ADS
====================================== */

async function loadBusinesses() {

    const container =
        document.getElementById(
            "businessListings"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <p style="
            width:100%;
            text-align:center;
            color:#666;
        ">

            ⏳ Anons yo ap chaje...

        </p>

    `;


    try {

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


        const responseText =
            await response.text();


        console.log(
            "Business response:",
            responseText
        );


        if (!response.ok) {

            console.error(
                "LOAD ERROR:",
                responseText
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
            JSON.parse(
                responseText
            );


        /* =========================
           NO BUSINESSES
        ========================= */

        if (
            !Array.isArray(businesses) ||
            businesses.length === 0
        ) {

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


        /* =========================
           CLEAR CONTAINER
        ========================= */

        container.innerHTML = "";


        /* =========================
           CREATE CARDS
        ========================= */

        businesses.forEach(
            function (business) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                let contactButtons = "";


                /* PHONE */

                if (business.phone) {

                    contactButtons += `

                        <a
                            href="tel:${escapeAttribute(
                                business.phone
                            )}"
                            style="
                                text-decoration:none;
                            "
                        >

                            <button
                                type="button"
                            >
                                📞 Rele
                            </button>

                        </a>

                    `;

                }


                /* WHATSAPP */

                if (business.whatsapp) {

                    const whatsappNumber =
                        business.whatsapp
                            .replace(
                                /\D/g,
                                ""
                            );


                    if (whatsappNumber) {

                        contactButtons += `

                            <a
                                href="https://wa.me/${whatsappNumber}"
                                target="_blank"
                                rel="noopener noreferrer"
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

                        `;

                    }

                }


                /* CARD */

                card.innerHTML = `

                    ${
                        business.image_url
                        ? `
                            <img
                                src="${escapeAttribute(
                                    business.image_url
                                )}"
                                alt="${escapeAttribute(
                                    business.business_name
                                )}"
                                style="
                                    width:100%;
                                    height:180px;
                                    object-fit:cover;
                                    border-radius:10px;
                                    margin-bottom:15px;
                                "
                            >
                        `
                        : ""
                    }


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


                    <div style="
                        display:flex;
                        gap:10px;
                        justify-content:center;
                        flex-wrap:wrap;
                        margin-top:15px;
                    ">

                        ${contactButtons}

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }


    catch (error) {

        console.error(
            "LOAD BUSINESSES ERROR:",
            error
        );


        container.innerHTML = `

            <p style="
                width:100%;
                text-align:center;
                color:red;
            ">

                ❌ Erè koneksyon ak baz done a.

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


    if (type === "success") {

        messageBox.style.color =
            "green";

    } else {

        messageBox.style.color =
            "red";

    }

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


function escapeAttribute(value) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    );

}

/* ======================================
   EAGLE-J CONNECT
   SUPABASE BUSINESS
   1 FOTO POU CHAK ANONS
====================================== */

const SUPABASE_URL =
    "https://glwyqrvufmjscjbbszzz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";

const IMAGE_BUCKET =
    "business-images";


/* ======================================
   MOBILE MENU
====================================== */

window.toggleMenu = function () {

    const menu = document.getElementById("menu");

    if (!menu) {
        console.error("Menu #menu pa jwenn.");
        return;
    }

    menu.classList.toggle("show");

};


/* Fèmen menu a lè yon lyen klike */

document.addEventListener("click", function (event) {

    const menu =
        document.getElementById("menu");

    if (!menu) return;

    const link =
        event.target.closest("#menu a");

    if (link) {
        menu.classList.remove("show");
    }

});


/* ======================================
   PAGE READY
====================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Eagle-J Connect ap mache!"
        );


        /* BUSINESS FORM */

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


        /* BUSINESS LISTINGS */

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


    /* IMPORTANT:
       HTML la dwe itilize:
       id="businessImage"
    */

    const imageInput =
        document.getElementById(
            "businessImage"
        );


    /* ======================================
       CHECK REQUIRED FIELDS
    ====================================== */

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
       GET ONE IMAGE
    ====================================== */

    const file =
        imageInput &&
        imageInput.files &&
        imageInput.files.length > 0
            ? imageInput.files[0]
            : null;


    if (file) {

        if (
            !file.type.startsWith("image/")
        ) {

            showMessage(
                "❌ Fichye a dwe yon imaj.",
                "error"
            );

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                "❌ Foto a dwe pi piti pase 5MB.",
                "error"
            );

            return;

        }

    }


    try {

        showMessage(
            "⏳ Anons lan ap pibliye...",
            "success"
        );


        /* ======================================
           STEP 1
           CREATE BUSINESS
        ====================================== */

        const businessResponse =
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


        const businessText =
            await businessResponse.text();


        if (!businessResponse.ok) {

            console.error(
                "BUSINESS ERROR:",
                businessText
            );

            showMessage(
                "❌ Anons lan pa t kapab pibliye.",
                "error"
            );

            return;

        }


        const businessData =
            JSON.parse(
                businessText
            );


        const business =
            Array.isArray(businessData)
                ? businessData[0]
                : businessData;


        const businessId =
            business.id;


        if (!businessId) {

            showMessage(
                "❌ Nou pa jwenn ID biznis la.",
                "error"
            );

            return;

        }


        /* ======================================
           STEP 2
           UPLOAD ONE IMAGE
        ====================================== */

        let imageURL = null;


        if (file) {

            showMessage(
                "⏳ Foto a ap monte...",
                "success"
            );


            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `${businessId}-${Date.now()}.${extension}`;


            const uploadResponse =
                await fetch(
                    `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${fileName}`,
                    {

                        method: "POST",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Content-Type":
                                file.type

                        },

                        body: file

                    }
                );


            const uploadText =
                await uploadResponse.text();


            if (!uploadResponse.ok) {

                console.error(
                    "IMAGE UPLOAD ERROR:",
                    uploadText
                );

                showMessage(
                    "❌ Foto a pa t kapab monte.",
                    "error"
                );

                return;

            }


            /* PUBLIC IMAGE URL */

            imageURL =
                `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`;


            console.log(
                "IMAGE URL:",
                imageURL
            );

        }


        /* ======================================
           STEP 3
           SAVE IMAGE URL
        ====================================== */

        const updateResponse =
            await fetch(
                `${SUPABASE_URL}/rest/v1/businesses?id=eq.${businessId}`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Prefer":
                            "return=minimal"

                    },

                    body: JSON.stringify({

                        image_url:
                            imageURL

                    })

                }
            );


        const updateText =
            await updateResponse.text();


        if (!updateResponse.ok) {

            console.error(
                "IMAGE URL ERROR:",
                updateText
            );

            showMessage(
                "⚠️ Anons lan kreye men foto a pa t konekte.",
                "error"
            );

            return;

        }


        /* ======================================
           SUCCESS
        ====================================== */

        showMessage(
            "✅ Anons ou a pibliye avèk siksè!",
            "success"
        );


        const form =
            document.getElementById(
                "businessForm"
            );


        if (form) {

            form.reset();

        }


        /* Reload listings */

        const businessListings =
            document.getElementById(
                "businessListings"
            );

        if (businessListings) {

            loadBusinesses();

        }

    }


    catch (error) {

        console.error(
            "SUBMIT ERROR:",
            error
        );

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


        if (!response.ok) {

            console.error(
                "LOAD ERROR:",
                responseText
            );

            showLoadError(
                container
            );

            return;

        }


        const businesses =
            JSON.parse(
                responseText
            );


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


        /* ======================================
           DISPLAY BUSINESSES
        ====================================== */

        container.innerHTML = "";


        businesses.forEach(
            function (business) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                /* ======================================
                   IMAGE
                ====================================== */

                let imageHTML = "";


                if (
                    business.image_url
                ) {

                    imageHTML = `

                        <div style="
                            width:100%;
                            margin-bottom:18px;
                        ">

                            <div style="
                                width:100%;
                                height:230px;
                                background:#f5f5f5;
                                border-radius:12px;
                                overflow:hidden;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                            ">

                                <img
                                    src="${escapeAttribute(
                                        business.image_url
                                    )}"
                                    alt="${escapeAttribute(
                                        business.business_name
                                    )}"
                                    style="
                                        width:100%;
                                        height:100%;
                                        object-fit:contain;
                                        display:block;
                                    "
                                    onerror="
                                        console.error(
                                            'Imaj pa ka afiche:',
                                            this.src
                                        );
                                        this.style.display='none';
                                    "
                                >

                            </div>

                        </div>

                    `;

                }


                /* ======================================
                   CONTACT BUTTONS
                ====================================== */

                let buttons = "";


                if (
                    business.phone
                ) {

                    buttons += `

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


                if (
                    business.whatsapp
                ) {

                    const number =
                        business.whatsapp
                            .replace(
                                /\D/g,
                                ""
                            );


                    if (number) {

                        buttons += `

                            <a
                                href="https://wa.me/${number}"
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


                /* ======================================
                   BUSINESS CARD
                ====================================== */

                card.innerHTML = `

                    ${imageHTML}


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

                        ${buttons}

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

        showLoadError(
            container
        );

    }

}


/* ======================================
   LOAD ERROR
====================================== */

function showLoadError(
    container
) {

    container.innerHTML = `

        <p style="
            width:100%;
            text-align:center;
            color:red;
        ">

            ❌ Nou pa kapab chaje anons yo.

        </p>

    `;

}


/* ======================================
   MESSAGE
====================================== */

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "formMessage"
        );


    if (!box) {

        alert(message);

        return;

    }


    box.textContent =
        message;


    box.style.color =
        type === "success"
            ? "green"
            : "red";

}


/* ======================================
   SECURITY
====================================== */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


function escapeAttribute(
    value
) {

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

/* ======================================
   EAGLE-J CONNECT
   SUPABASE + BUSINESS + IMAGE UPLOAD
====================================== */


/* ======================================
   SUPABASE CONNECTION
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


    try {

        showMessage(
            "⏳ Anons lan ap prepare...",
            "success"
        );


        /* ======================================
           IMAGE UPLOAD
        ====================================== */

        let imageURL = null;


        if (
            imageInput &&
            imageInput.files &&
            imageInput.files.length > 0
        ) {

            const file =
                imageInput.files[0];


            /* Check image type */

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "❌ Tanpri chwazi yon imaj.",
                    "error"
                );

                return;

            }


            /* Check image size */

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showMessage(
                    "❌ Foto a twò gwo. Maksimòm 5MB.",
                    "error"
                );

                return;

            }


            showMessage(
                "⏳ Foto a ap monte...",
                "success"
            );


            /* Create unique file name */

            const fileExtension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${fileExtension}`;


            const filePath =
                fileName;


            /* Upload image */

            const uploadResponse =
                await fetch(
                    `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET}/${filePath}`,
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


            console.log(
                "Image upload:",
                uploadResponse.status,
                uploadText
            );


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


            /* ======================================
               CREATE PUBLIC IMAGE URL
            ====================================== */

            imageURL =
                `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${filePath}`;


            console.log(
                "Image URL:",
                imageURL
            );

        }


        /* ======================================
           SAVE BUSINESS
        ====================================== */

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
                            imageURL

                    })

                }
            );


        const responseText =
            await response.text();


        console.log(
            "Business response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            console.error(
                "BUSINESS ERROR:",
                responseText
            );


            showMessage(
                "❌ Anons lan pa t kapab pibliye.",
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

    }


    catch (error) {

        console.error(
            "ERROR:",
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


        container.innerHTML = "";


        businesses.forEach(
            function (business) {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                let buttons = "";


                /* PHONE */

                if (business.phone) {

                    buttons += `

                        <a
                            href="tel:${escapeAttribute(
                                business.phone
                            )}"
                            style="
                                text-decoration:none;
                            "
                        >

                            <button type="button">
                                📞 Rele
                            </button>

                        </a>

                    `;

                }


                /* WHATSAPP */

                if (business.whatsapp) {

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

                                <button type="button">
                                    💬 WhatsApp
                                </button>

                            </a>

                        `;

                    }

                }


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
                                    height:200px;
                                    object-fit:cover;
                                    border-radius:12px;
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
            "LOAD ERROR:",
            error
        );


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

/* ======================================
   EAGLE-J CONNECT
   SUPABASE BUSINESS + 5 IMAGES
====================================== */

const SUPABASE_URL =
    "https://glwyqrvufmjscjbbszzz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BW1Y0QkG-tCV0TiQnto4IA_H32L2esr";

const IMAGE_BUCKET = "business-images";


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
   LIMIT 5 IMAGES
====================================== */

window.limitBusinessImages = function (input) {

    const message =
        document.getElementById("imageMessage");

    if (input.files.length > 5) {

        if (message) {
            message.textContent =
                "❌ Ou ka chwazi sèlman 5 foto.";
        }

        input.value = "";

        return;
    }

    if (message) {

        if (input.files.length === 0) {

            message.textContent = "";

        } else {

            message.textContent =
                "✅ " +
                input.files.length +
                " foto chwazi.";

            message.style.color = "green";
        }
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
            "businessImages"
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
       CHECK IMAGE COUNT
    ====================================== */

    const files =
        imageInput &&
        imageInput.files
            ? Array.from(imageInput.files)
            : [];


    if (files.length > 5) {

        showMessage(
            "❌ Ou ka chwazi sèlman 5 foto.",
            "error"
        );

        return;

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

            console.error(
                "Business ID missing:",
                businessData
            );

            showMessage(
                "❌ Nou pa jwenn ID biznis la.",
                "error"
            );

            return;

        }


        console.log(
            "Business created:",
            businessId
        );


        /* ======================================
           STEP 2
           UPLOAD IMAGES
        ====================================== */

        let uploadedImages = [];


        for (
            let i = 0;
            i < files.length;
            i++
        ) {

            const file =
                files[i];


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "❌ Tout fichye yo dwe imaj.",
                    "error"
                );

                return;

            }


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showMessage(
                    "❌ Chak foto dwe pi piti pase 5MB.",
                    "error"
                );

                return;

            }


            showMessage(
                `⏳ Foto ${i + 1} sou ${files.length} ap monte...`,
                "success"
            );


            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `${businessId}-${Date.now()}-${i}-${Math.random()
                    .toString(36)
                    .substring(2)}.${extension}`;


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
                    `❌ Foto ${i + 1} pa t kapab monte.`,
                    "error"
                );

                return;

            }


            const imageURL =
                `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`;


            uploadedImages.push(
                imageURL
            );


            /* ======================================
               SAVE IMAGE URL
               IN BUSINESS_IMAGES
            ====================================== */

            const imageResponse =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/business_images`,
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
                                "return=minimal"

                        },

                        body: JSON.stringify({

                            business_id:
                                businessId,

                            image_url:
                                imageURL

                        })

                    }
                );


            const imageResponseText =
                await imageResponse.text();


            if (!imageResponse.ok) {

                console.error(
                    "BUSINESS IMAGE ERROR:",
                    imageResponseText
                );

                showMessage(
                    "❌ Foto a monte men li pa t kapab konekte ak anons lan.",
                    "error"
                );

                return;

            }

        }


        /* ======================================
           SAVE FIRST IMAGE
           IN businesses.image_url
        ====================================== */

        if (
            uploadedImages.length > 0
        ) {

            const firstImage =
                uploadedImages[0];


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
                                `Bearer ${SUPABASE_KEY`

                        },

                        body: JSON.stringify({

                            image_url:
                                firstImage

                        })

                    }
                );


            if (!updateResponse.ok) {

                console.warn(
                    "First image URL update failed."
                );

            }

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


        const imageMessage =
            document.getElementById(
                "imageMessage"
            );


        if (imageMessage) {

            imageMessage.textContent = "";

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

        /* ======================================
           GET BUSINESSES
        ====================================== */

        const businessResponse =
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


        const businessText =
            await businessResponse.text();


        if (!businessResponse.ok) {

            console.error(
                "BUSINESS LOAD ERROR:",
                businessText
            );

            showLoadError(container);

            return;

        }


        const businesses =
            JSON.parse(
                businessText
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
           GET ALL BUSINESS IMAGES
        ====================================== */

        const imageResponse =
            await fetch(
                `${SUPABASE_URL}/rest/v1/business_images?select=*&order=created_at.asc`,
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


        let images = [];


        if (imageResponse.ok) {

            images =
                await imageResponse.json();

        }


        /* ======================================
           GROUP IMAGES BY BUSINESS
        ====================================== */

        const imagesByBusiness = {};


        images.forEach(
            function (image) {

                if (
                    !imagesByBusiness[
                        image.business_id
                    ]
                ) {

                    imagesByBusiness[
                        image.business_id
                    ] = [];

                }


                imagesByBusiness[
                    image.business_id
                ].push(
                    image.image_url
                );

            }
        );


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


                let businessImages =
                    imagesByBusiness[
                        business.id
                    ] || [];


                /* Old businesses */

                if (
                    businessImages.length === 0 &&
                    business.image_url
                ) {

                    businessImages = [
                        business.image_url
                    ];

                }


                /* ======================================
                   IMAGE GALLERY
                ====================================== */

                let galleryHTML = "";


                if (
                    businessImages.length > 0
                ) {

                    galleryHTML = `

                        <div
                            style="
                                width:100%;
                                margin-bottom:18px;
                            "
                        >

                            <div
                                style="
                                    width:100%;
                                    height:220px;
                                    background:#f5f5f5;
                                    border-radius:12px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    overflow:hidden;
                                "
                            >

                                <img
                                    id="main-image-${business.id}"
                                    src="${escapeAttribute(
                                        businessImages[0]
                                    )}"
                                    alt="${escapeAttribute(
                                        business.business_name
                                    )}"
                                    style="
                                        width:100%;
                                        height:100%;
                                        object-fit:contain;
                                    "
                                >

                            </div>


                            ${
                                businessImages.length > 1
                                ? `

                                    <div
                                        style="
                                            display:flex;
                                            gap:8px;
                                            overflow-x:auto;
                                            margin-top:10px;
                                            padding-bottom:5px;
                                        "
                                    >

                                        ${businessImages.map(
                                            function (
                                                image,
                                                index
                                            ) {

                                                return `

                                                    <img
                                                        src="${escapeAttribute(
                                                            image
                                                        )}"
                                                        alt="Foto ${index + 1}"
                                                        onclick="changeBusinessImage(
                                                            ${business.id},
                                                            '${escapeAttribute(
                                                                image
                                                            )}'
                                                        )"
                                                        style="
                                                            width:65px;
                                                            height:65px;
                                                            object-fit:cover;
                                                            border-radius:8px;
                                                            cursor:pointer;
                                                            border:2px solid #F4B400;
                                                            flex-shrink:0;
                                                        "
                                                    >

                                                `;

                                            }
                                        ).join("")}

                                    </div>

                                `
                                : ""
                            }

                        </div>

                    `;

                }


                /* ======================================
                   CONTACT BUTTONS
                ====================================== */

                let buttons = "";


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

                            <button
                                type="button"
                            >
                                📞 Rele
                            </button>

                        </a>

                    `;

                }


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
                   CARD
                ====================================== */

                card.innerHTML = `

                    ${galleryHTML}


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


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            justify-content:center;
                            flex-wrap:wrap;
                            margin-top:15px;
                        "
                    >

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
   CHANGE GALLERY IMAGE
====================================== */

window.changeBusinessImage =
    function (
        businessId,
        imageURL
    ) {

        const mainImage =
            document.getElementById(
                `main-image-${businessId}`
            );


        if (mainImage) {

            mainImage.src =
                imageURL;

        }

    };


/* ======================================
   SHOW LOAD ERROR
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

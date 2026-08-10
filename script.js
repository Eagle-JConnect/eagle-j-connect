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

    const menu = document.getElementById("menu");

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
            message.style.color = "red";
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

        console.log("Eagle-J Connect ap mache!");

        const businessForm =
            document.getElementById("businessForm");

        if (businessForm) {

            businessForm.addEventListener(
                "submit",
                submitBusiness
            );

        }


        const businessListings =
            document.getElementById("businessListings");

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
        document.getElementById("businessName")
            .value.trim();

    const category =
        document.getElementById("category")
            .value;

    const location =
        document.getElementById("location")
            .value.trim();

    const phone =
        document.getElementById("phone")
            .value.trim();

    const whatsapp =
        document.getElementById("whatsapp")
            .value.trim();

    const price =
        document.getElementById("price")
            .value.trim();

    const description =
        document.getElementById("description")
            .value.trim();

    const imageInput =
        document.getElementById("businessImages");


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
       GET IMAGES
    ====================================== */

    const files =
        imageInput && imageInput.files
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
           CREATE BUSINESS FIRST
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
                            null,

                        image_urls:
                            JSON.stringify([])

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
            JSON.parse(businessText);


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
           UPLOAD ALL IMAGES
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
                !file.type.startsWith("image/")
            ) {

                showMessage(
                    `❌ Foto ${i + 1} pa yon imaj.`,
                    "error"
                );

                return;

            }


            if (
                file.size > 5 * 1024 * 1024
            ) {

                showMessage(
                    `❌ Foto ${i + 1} depase 5MB.`,
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
                    "UPLOAD ERROR:",
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

        }


        /* ======================================
           STEP 3
           SAVE IMAGE URLS
        ====================================== */

        const firstImage =
            uploadedImages.length > 0
                ? uploadedImages[0]
                : null;


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
                            firstImage,

                        image_urls:
                            JSON.stringify(
                                uploadedImages
                            )

                    })

                }
            );


        const updateText =
            await updateResponse.text();


        if (!updateResponse.ok) {

            console.error(
                "IMAGE URL UPDATE ERROR:",
                updateText
            );

            showMessage(
                "⚠️ Anons lan kreye, men foto yo pa t kapab konekte.",
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


        const imageMessage =
            document.getElementById(
                "imageMessage"
            );


        if (imageMessage) {
            imageMessage.textContent = "";
        }


        console.log(
            "Uploaded images:",
            uploadedImages
        );

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

            showLoadError(container);

            return;

        }


        const businesses =
            JSON.parse(responseText);


        if (
                                                                  style="
                                                            width:70px;
                                                            height:70px;
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

                            <button type="button">
                                📞 Rele
                            </button>

                        </a>

                    `;

                }


                if (business.whatsapp) {

                    const number =
                        business.whatsapp.replace(
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


                /* ======================================
                   CARD CONTENT
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


                container.appendChild(card);

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
   CHANGE MAIN IMAGE
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

            mainImage.style.display =
                "block";

        }

    };


/* ======================================
   LOAD ERROR
====================================== */

function showLoadError(container) {

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
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
} 

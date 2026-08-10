/* ======================================
   EAGLE-J CONNECT
   SUPABASE
   BUSINESS + REGISTRATION + LOGIN
   EMPLOYER DASHBOARD + JOBS
====================================== */


/* ======================================
   SUPABASE CONFIG
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

    if (!menu) return;

    menu.classList.toggle("show");

};


document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.getElementById("menu");

        if (!menu) return;

        const link =
            event.target.closest("#menu a");

        if (link) {

            menu.classList.remove("show");

        }

    }
);


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


        /* REGISTER */

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }


        /* LOGIN */

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }


        /* EMPLOYER PAGE */

        const employerName =
            document.getElementById(
                "employerName"
            );

        if (employerName) {

            loadEmployerDashboard();

        }


        /* JOB FORM */

        const jobForm =
            document.getElementById(
                "jobForm"
            );

        if (jobForm) {

            jobForm.addEventListener(
                "submit",
                postJob
            );

        }

    }
);


/* ======================================
   REGISTER USER
====================================== */

async function registerUser(event) {

    event.preventDefault();


    const fullName =
        document
            .getElementById("fullName")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const phone =
        document
            .getElementById("phone")
            .value
            .trim();


    const accountType =
        document
            .getElementById("accountType")
            .value;


    const password =
        document
            .getElementById("password")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    if (
        !fullName ||
        !email ||
        !phone ||
        !accountType ||
        !password ||
        !confirmPassword
    ) {

        message.textContent =
            "⚠️ Tanpri ranpli tout chan yo.";

        message.style.color =
            "red";

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        message.textContent =
            "❌ Modpas yo pa menm.";

        message.style.color =
            "red";

        return;

    }


    if (
        password.length < 6
    ) {

        message.textContent =
            "❌ Modpas la dwe gen omwen 6 karaktè.";

        message.style.color =
            "red";

        return;

    }


    if (
        accountType !== "job_seeker" &&
        accountType !== "employer"
    ) {

        message.textContent =
            "❌ Chwazi yon kalite kont.";

        message.style.color =
            "red";

        return;

    }


    message.textContent =
        "⏳ Nap kreye kont ou...";

    message.style.color =
        "#003366";


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/signup`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY

                    },

                    body:
                        JSON.stringify({

                            email:
                                email,

                            password:
                                password,

                            data: {

                                full_name:
                                    fullName,

                                phone:
                                    phone,

                                account_type:
                                    accountType

                            }

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "REGISTER ERROR:",
                data
            );


            message.textContent =
                "❌ " +
                (
                    data.msg ||
                    data.message ||
                    data.error_description ||
                    "Nou pa kapab kreye kont lan."
                );

            message.style.color =
                "red";

            return;

        }


        /* ======================================
           SAVE PROFILE
        ====================================== */

        if (data.user) {

            const profileResponse =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/profiles`,
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

                        body:
                            JSON.stringify({

                                id:
                                    data.user.id,

                                full_name:
                                    fullName,

                                phone:
                                    phone,

                                account_type:
                                    accountType

                            })

                    }
                );


            if (!profileResponse.ok) {

                console.error(
                    "PROFILE ERROR:",
                    await profileResponse.text()
                );

            }

        }


        message.textContent =
            "✅ Kont ou kreye avèk siksè!";

        message.style.color =
            "green";


        document
            .getElementById("registerForm")
            .reset();


        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1500
        );

    }


    catch (error) {

        console.error(
            "REGISTER SYSTEM ERROR:",
            error
        );


        message.textContent =
            "❌ Gen yon pwoblèm koneksyon.";

        message.style.color =
            "red";

    }

}


/* ======================================
   LOGIN
====================================== */

async function loginUser(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    message.textContent =
        "⏳ Nap konekte...";

    message.style.color =
        "#003366";


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY

                    },

                    body:
                        JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "LOGIN ERROR:",
                data
            );


            message.textContent =
                "❌ " +
                (
                    data.error_description ||
                    data.msg ||
                    data.message ||
                    "Email oswa modpas la pa bon."
                );

            message.style.color =
                "red";

            return;

        }


        /* ======================================
           SAVE SESSION
        ====================================== */

        localStorage.setItem(
            "supabase_access_token",
            data.access_token
        );


        localStorage.setItem(
            "supabase_refresh_token",
            data.refresh_token
        );


        localStorage.setItem(
            "supabase_user",
            JSON.stringify(data.user)
        );


        message.textContent =
            "✅ Ou konekte avèk siksè!";

        message.style.color =
            "green";


        /* ======================================
           GET PROFILE
        ====================================== */

        const profileResponse =
            await fetch(
                `${SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}&select=*`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${data.access_token}`

                    }

                }
            );


        const profiles =
            await profileResponse.json();


        const profile =
            Array.isArray(profiles)
                ? profiles[0]
                : null;


        if (
            profile &&
            profile.account_type ===
                "employer"
        ) {

            setTimeout(
                function () {

                    window.location.href =
                        "employer.html";

                },
                800
            );

            return;

        }


        /* JOB SEEKER */

        setTimeout(
            function () {

                window.location.href =
                    "travay.html";

            },
            800
        );

    }


    catch (error) {

        console.error(
            "LOGIN SYSTEM ERROR:",
            error
        );


        message.textContent =
            "❌ Gen yon pwoblèm koneksyon.";

        message.style.color =
            "red";

    }

}


/* ======================================
   EMPLOYER DASHBOARD
====================================== */

async function loadEmployerDashboard() {

    const token =
        localStorage.getItem(
            "supabase_access_token"
        );


    const userText =
        localStorage.getItem(
            "supabase_user"
        );


    if (
        !token ||
        !userText
    ) {

        window.location.href =
            "login.html";

        return;

    }


    const user =
        JSON.parse(
            userText
        );


    try {

        /* ======================================
           LOAD PROFILE
        ====================================== */

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=*`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const profiles =
            await response.json();


        if (
            !Array.isArray(profiles) ||
            profiles.length === 0
        ) {

            alert(
                "Nou pa jwenn pwofil ou."
            );

            return;

        }


        const profile =
            profiles[0];


        /* ======================================
           SECURITY
        ====================================== */

        if (
            profile.account_type !==
            "employer"
        ) {

            alert(
                "⛔ Paj sa a se pou anplwayè sèlman."
            );

            window.location.href =
                "travay.html";

            return;

        }


        /* ======================================
           DISPLAY PROFILE
        ====================================== */

        const name =
            document.getElementById(
                "employerName"
            );

        const profileName =
            document.getElementById(
                "profileName"
            );

        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        const profilePhone =
            document.getElementById(
                "profilePhone"
            );

        const profileType =
            document.getElementById(
                "profileType"
            );


        if (name) {

            name.textContent =
                profile.full_name;

        }


        if (profileName) {

            profileName.textContent =
                profile.full_name;

        }


        if (profileEmail) {

            profileEmail.textContent =
                user.email || "—";

        }


        if (profilePhone) {

            profilePhone.textContent =
                profile.phone || "—";

        }


        if (profileType) {

            profileType.textContent =
                "🏢 Anplwayè";

        }


        /* ======================================
           LOAD MY JOBS
        ====================================== */

        loadMyJobs(
            user.id,
            token
        );

    }


    catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

    }

}


/* ======================================
   POST JOB
====================================== */

async function postJob(event) {

    event.preventDefault();


    const token =
        localStorage.getItem(
            "supabase_access_token"
        );


    const userText =
        localStorage.getItem(
            "supabase_user"
        );


    const message =
        document.getElementById(
            "jobMessage"
        );


    if (
        !token ||
        !userText
    ) {

        message.textContent =
            "❌ Ou dwe konekte anvan ou poste yon travay.";

        message.style.color =
            "red";

        return;

    }


    const user =
        JSON.parse(
            userText
        );


    const title =
        document
            .getElementById("jobTitle")
            .value
            .trim();


    const companyName =
        document
            .getElementById("jobCompany")
            .value
            .trim();


    const location =
        document
            .getElementById("jobLocation")
            .value
            .trim();


    const jobType =
        document
            .getElementById("jobType")
            .value;


    const salary =
        document
            .getElementById("jobSalary")
            .value
            .trim();


    const description =
        document
            .getElementById("jobDescription")
            .value
            .trim();


    const contactPhone =
        document
            .getElementById("jobContact")
            .value
            .trim();


    if (
        !title ||
        !companyName ||
        !location ||
        !jobType ||
        !description ||
        !contactPhone
    ) {

        message.textContent =
            "⚠️ Tanpri ranpli tout chan obligatwa yo.";

        message.style.color =
            "red";

        return;

    }


    message.textContent =
        "⏳ Travay la ap pibliye...";

    message.style.color =
        "#003366";


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/jobs`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${token}`,

                        "Prefer":
                            "return=representation"

                    },

                    body:
                        JSON.stringify({

                            employer_id:
                                user.id,

                            title:
                                title,

                            company_name:
                                companyName,

                            location:
                                location,

                            job_type:
                                jobType,

                            salary:
                                salary ||
                                null,

                            description:
                                description,

                            contact_phone:
                                contactPhone

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "POST JOB ERROR:",
                data
            );


            message.textContent =
                "❌ Travay la pa t kapab pibliye.";

            message.style.color =
                "red";

            return;

        }


        message.textContent =
            "✅ Travay la pibliye avèk siksè!";

        message.style.color =
            "green";


        document
            .getElementById("jobForm")
            .reset();


        loadMyJobs(
            user.id,
            token
        );

    }


    catch (error) {

        console.error(
            "POST JOB SYSTEM ERROR:",
            error
        );


        message.textContent =
            "❌ Gen yon pwoblèm koneksyon.";

        message.style.color =
            "red";

    }

}


/* ======================================
   LOAD MY JOBS
====================================== */

async function loadMyJobs(
    userId,
    token
) {

    const container =
        document.getElementById(
            "myJobs"
        );


    if (!container) return;


    container.innerHTML =
        "<p>⏳ Travay yo ap chaje...</p>";


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/jobs?employer_id=eq.${userId}&select=*&order=created_at.desc`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const jobs =
            await response.json();


        if (
            !Array.isArray(jobs) ||
            jobs.length === 0
        ) {

            container.innerHTML = `
                <p>
                    Ou poko poste okenn travay.
                </p>
            `;

            return;

        }


        container.innerHTML =
            "";


        jobs.forEach(
            function (job) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                card.style.margin =
                    "15px 0";


                card.style.textAlign =
                    "left";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(job.title)}
                    </h3>

                    <p>
                        🏢 ${escapeHTML(job.company_name)}
                    </p>

                    <p>
                        📍 ${escapeHTML(job.location)}
                    </p>

                    <p>
                        💼 ${escapeHTML(job.job_type)}
                    </p>

                    ${
                        job.salary
                        ? `
                            <p>
                                💰 ${escapeHTML(job.salary)}
                            </p>
                          `
                        : ""
                    }

                    <p>
                        ${escapeHTML(job.description)}
                    </p>

                    <p>
                        📞 ${escapeHTML(job.contact_phone)}
                    </p>

                    <small>
                        📅 ${new Date(
                            job.created_at
                        ).toLocaleDateString()}
                    </small>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }


    catch (error) {

        console.error(
            "LOAD JOBS ERROR:",
            error
        );


        container.innerHTML =
            "<p>❌ Nou pa kapab chaje travay yo.</p>";

    }

}


/* ======================================
   LOGOUT
====================================== */

window.logoutUser = function () {

    localStorage.removeItem(
        "supabase_access_token"
    );

    localStorage.removeItem(
        "supabase_refresh_token"
    );

    localStorage.removeItem(
        "supabase_user"
    );


    window.location.href =
        "login.html";

};


/* ======================================
   BUSINESS
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


    const file =
        imageInput &&
        imageInput.files &&
        imageInput.files.length
            ? imageInput.files[0]
            : null;


    if (file) {

        if (
            !file.type.startsWith(
                "image/"
            )
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

                    body:
                        JSON.stringify({

                            business_name:
                                businessName,

                            category:
                                category,

                            location:
                                location,

                            phone:
                                phone ||
                                null,

                            whatsapp:
                                whatsapp ||
                                null,

                            price:
                                price ||
                                null,

                            description:
                                description,

                            image_url:
                                null

                        })

                }
            );


        const text =
            await response.text();


        if (!response.ok) {

            console.error(
                "BUSINESS ERROR:",
                text
            );

            showMessage(
                "❌ Anons lan pa t kapab pibliye.",
                "error"
            );

            return;

        }


        const data =
            JSON.parse(text);


        const business =
            Array.isArray(data)
                ? data[0]
                : data;


        const businessId =
            business.id;


        let imageURL =
            null;


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

                        body:
                            file

                    }
                );


            if (!uploadResponse.ok) {

                console.error(
                    await uploadResponse.text()
                );

                showMessage(
                    "❌ Foto a pa t kapab monte.",
                    "error"
                );

                return;

            }


            imageURL =
                `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${fileName}`;

        }


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
                            `Bearer ${SUPABASE_KEY}`

                    },

                    body:
                        JSON.stringify({

                            image_url:
                                imageURL

                        })

                }
            );


        if (!updateResponse.ok) {

            console.error(
                await updateResponse.text()
            );

            showMessage(
                "⚠️ Anons lan kreye men foto a pa t konekte.",
                "error"
            );

            return;

        }


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


        loadBusinesses();

    }


    catch (error) {

        console.error(
            "BUSINESS ERROR:",
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


    if (!container) return;


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/businesses?select=*&order=created_at.desc`,
                {

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`

                    }

                }
            );


        const businesses =
            await response.json();


        if (
            !Array.isArray(businesses) ||
            businesses.length === 0
        ) {

            container.innerHTML =
                "<p>Pa gen anons biznis pou kounye a.</p>";

            return;

        }


        container.innerHTML =
            "";


        businesses.forEach(
            function (business) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                let imageHTML =
                    "";


                if (
                    business.image_url
                ) {

                    imageHTML = `

                        <img
                            src="${escapeAttribute(
                                business.image_url
                            )}"
                            alt="${escapeAttribute(
                                business.business_name
                            )}"
                            style="
                                width:100%;
                                height:230px;
                                object-fit:contain;
                                border-radius:12px;
                                background:#f5f5f5;
                            "
                        >

                    `;

                }


                let buttons =
                    "";


                if (
                    business.phone
                ) {

                    buttons += `

                        <a
                            href="tel:${escapeAttribute(
                                business.phone
                            )}"
                        >
                            <button type="button">
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
                            >
                                <button type="button">
                                    💬 WhatsApp
                                </button>
                            </a>

                        `;

                    }

                }


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

                    <div>
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
            "LOAD BUSINESS ERROR:",
            error
        );

        container.innerHTML =
            "<p>❌ Nou pa kapab chaje anons yo.</p>";

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

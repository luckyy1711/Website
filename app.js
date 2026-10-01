/* =========================================================
   PROJECT RENDERER
   ========================================================= */

const projectGrid =
    document.getElementById("projectsGrid");

const projectCount =
    document.getElementById("projectCount");


function renderProjects() {

    if (!projectGrid) return;

    projectGrid.innerHTML = "";


    projects.forEach((project, index) => {

        const projectCard =
            document.createElement("a");


        projectCard.className =
            "project-card reveal";


        projectCard.href =
            project.link;


        /*
        External links open in another tab.
        Internal portfolio projects remain
        in the same tab.
        */

        if (
            project.link.startsWith("http://") ||
            project.link.startsWith("https://")
        ) {
            projectCard.target = "_blank";

            projectCard.rel =
                "noopener noreferrer";
        }


        const formattedIndex =
            String(index + 1).padStart(2, "0");


        const tags =
            project.tags
                .map(
                    tag =>
                        `<span class="tag">${escapeHTML(tag)}</span>`
                )
                .join("");


        projectCard.innerHTML = `

            <div class="project-image">

                <span class="project-index">
                    ${formattedIndex}
                </span>

                <img
                    src="${escapeAttribute(project.image)}"
                    alt="${escapeAttribute(project.title)} preview"
                    loading="lazy"
                >

            </div>


            <div class="project-content">

                <div class="project-topline">

                    <h3>
                        ${escapeHTML(project.title)}
                    </h3>

                    <span class="project-arrow">
                        ↗
                    </span>

                </div>


                <p class="project-description">
                    ${escapeHTML(project.description)}
                </p>


                <div class="tags">
                    ${tags}
                </div>

            </div>

        `;


        projectGrid.appendChild(projectCard);

    });


    if (projectCount) {

        projectCount.textContent =
            String(projects.length)
                .padStart(2, "0");

    }

}


function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;

}


function escapeAttribute(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll('"', "&quot;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;");

}


renderProjects();



/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.1
        }

    );


revealElements.forEach(element => {

    observer.observe(element);

});



/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

const header =
    document.querySelector(".site-header");


window.addEventListener(
    "scroll",

    () => {

        if (window.scrollY > 30) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    },

    {
        passive: true
    }
);



/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");


menuButton.addEventListener(
    "click",

    () => {

        const open =
            navigation.classList.toggle(
                "open"
            );

        document.body.classList.toggle(
            "menu-open",
            open
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

    }
);


navigation
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",

            () => {

                navigation.classList.remove(
                    "open"
                );

                document.body.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        );

    });



/* =========================================================
   COPY EMAIL
   ========================================================= */

const copyButton =
    document.getElementById("copyEmail");

const copyMessage =
    document.getElementById("copyMessage");


copyButton.addEventListener(
    "click",

    async () => {

        const email =
            copyButton.dataset.email;

        try {

            await navigator.clipboard.writeText(
                email
            );

            copyMessage.textContent =
                "Email copied to clipboard.";

        } catch {

            copyMessage.textContent =
                `Email: ${email}`;

        }


        setTimeout(
            () => {

                copyMessage.textContent = "";

            },

            2500
        );

    }
);



/* =========================================================
   CURRENT YEAR
   ========================================================= */

document.getElementById(
    "currentYear"
).textContent =
    new Date().getFullYear();

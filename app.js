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


    projects.forEach((project) => {
    const card = document.createElement("a");

    card.className = "project-card reveal";
    card.href = project.link;

    card.innerHTML = `
        <div class="project-visual project-${project.type}">
            ${
                project.type === "demo"
                    ? `
                        <div class="visual-window">
                            <div class="window-top">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div class="visual-lines">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="visual-button">RUN</div>
                        </div>
                    `
                    : project.type === "music"
                    ? `
                        <div class="music-ui">
                            <div class="album"></div>
                            <div class="music-info">
                                <strong>NOW PLAYING</strong>
                                <span>Music Utility</span>
                            </div>
                            <div class="wave">
                                <i></i><i></i><i></i><i></i><i></i>
                                <i></i><i></i><i></i><i></i><i></i>
                                <i></i><i></i><i></i>
                            </div>
                            <div class="music-controls">
                                <span>◀</span>
                                <span class="play">▶</span>
                                <span>▶</span>
                            </div>
                        </div>
                    `
                    : `
                        <div class="game-ui">
                            <div class="game-score">SCORE: 0420</div>
                            <div class="game-player"></div>
                            <div class="game-enemy enemy-one"></div>
                            <div class="game-enemy enemy-two"></div>
                            <div class="game-ground"></div>
                        </div>
                    `
            }
        </div>

        <div class="project-content">
            <div class="project-top">
                <h3>${project.title}</h3>
                <span class="project-arrow">↗</span>
            </div>

            <p>${project.description}</p>

            <div class="project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
            </div>
        </div>
    `;

    projectsGrid.appendChild(card);
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

/* =================================
   SCROLL DEPTH EFFECT
================================= */

(() => {
    const stripes = document.createElement("div");

    stripes.className = "scroll-stripes";
    document.body.appendChild(stripes);

    let lastScroll = window.scrollY;
    let velocity = 0;
    let targetPush = 0;
    let currentPush = 0;
    let currentGlow = 0;

    function updateScroll() {
        const currentScroll = window.scrollY;
        const movement = Math.abs(currentScroll - lastScroll);

        velocity += (movement - velocity) * 0.18;

        targetPush = Math.min(1, velocity / 28);

        currentPush += (targetPush - currentPush) * 0.16;
        currentGlow += (targetPush - currentGlow) * 0.16;

        document.body.style.setProperty(
            "--scroll-push",
            currentPush.toFixed(3)
        );

        document.body.style.setProperty(
            "--scroll-glow",
            currentGlow.toFixed(3)
        );

        lastScroll = currentScroll;

        requestAnimationFrame(updateScroll);
    }

    updateScroll();
})();

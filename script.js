// Jemné zvýraznění kapitoly po příchodu z časové osy.
document.querySelectorAll(".timeline-item").forEach(link => {
    link.addEventListener("click", () => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            setTimeout(() => {
                target.classList.add("chapter-highlight");

                setTimeout(() => {
                    target.classList.remove("chapter-highlight");
                }, 1200);
            }, 500);
        }
    });
});

/* =========================================================
   LIGHTBOX – ZVĚTŠOVÁNÍ FOTOGRAFIÍ A ZOOM
   ========================================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");

const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let currentGallery = [];
let currentIndex = 0;

// Proměnné pro zoom a posun (panování)
let isZoomed = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;
let isDragging = false;

function resetZoom() {
    isZoomed = false;
    isDragging = false;
    translateX = 0;
    translateY = 0;
    lightboxImage.style.transform = "scale(1)";
    lightboxImage.style.cursor = "zoom-in";
    lightboxImage.style.transition = "transform 0.25s ease";
}


/* ---------------------------------------------------------
   Kliknutí na fotografii v galerii (otevření lightboxu)
   --------------------------------------------------------- */

document.querySelectorAll(".gallery").forEach(gallery => {

    const images = gallery.querySelectorAll("figure img");

    images.forEach((image, index) => {

        image.style.cursor = "pointer";

        image.addEventListener("click", () => {

            currentGallery = Array.from(images);
            currentIndex = index;

            showLightboxImage();

            lightbox.classList.add("active");

            // zabrání posouvání stránky pod lightboxem
            document.body.style.overflow = "hidden";
        });

    });

});


/* ---------------------------------------------------------
   Zobrazení aktuální fotografie
   --------------------------------------------------------- */

function showLightboxImage() {
    resetZoom(); // Při změně fotky vždy resetujeme zoom

    const image = currentGallery[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    // vezme popisek z <figcaption>
    const figure = image.closest("figure");
    const caption = figure.querySelector("figcaption");

    if (caption) {
        lightboxCaption.textContent = caption.textContent;
    } else {
        lightboxCaption.textContent = "";
    }
}


/* ---------------------------------------------------------
   Interakce se zoomem uvnitř lightboxu
   --------------------------------------------------------- */

lightboxImage.style.cursor = "zoom-in";

// Kliknutí na obrázek v lightboxu (přiblížení / oddálení)
lightboxImage.addEventListener("click", (event) => {
    event.stopPropagation(); // Zabrání zavření lightboxu při kliknutí na obrázek

    if (!isZoomed) {
        isZoomed = true;
        // Přiblížíme 2.5x a zrušíme plynulý přechod, aby pohyb myší byl okamžitý
        lightboxImage.style.transition = "transform 0.1s ease-out";
        lightboxImage.style.transform = "scale(2.5)";
        lightboxImage.style.cursor = "grab";
    } else {
        resetZoom();
    }
});

// Tažení myší (pohyb po přiblíženém obrázku)
lightboxImage.addEventListener("mousedown", (e) => {
    if (!isZoomed) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lightboxImage.style.transition = "none"; // Vypnutí animace při tahu
    lightboxImage.style.cursor = "grabbing";
    e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
    if (!isDragging || !isZoomed) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    lightboxImage.style.transform = `scale(2.5) translate(${translateX}px, ${translateY}px)`;
});

window.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        if (isZoomed) {
            lightboxImage.style.cursor = "grab";
        }
    }
});


/* ---------------------------------------------------------
   Zavření
   --------------------------------------------------------- */

function closeLightbox() {
    resetZoom();
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

closeButton.addEventListener("click", closeLightbox);


/* ---------------------------------------------------------
   Předchozí fotografie
   --------------------------------------------------------- */

prevButton.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = currentGallery.length - 1;
    }

    showLightboxImage();
});


/* ---------------------------------------------------------
   Následující fotografie
   --------------------------------------------------------- */

nextButton.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= currentGallery.length) {
        currentIndex = 0;
    }

    showLightboxImage();
});


/* ---------------------------------------------------------
   Kliknutí mimo fotografii = zavření
   --------------------------------------------------------- */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


/* ---------------------------------------------------------
   Klávesnice
   --------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = currentGallery.length - 1;
        }

        showLightboxImage();
    }

    if (event.key === "ArrowRight") {
        currentIndex++;

        if (currentIndex >= currentGallery.length) {
            currentIndex = 0;
        }

        showLightboxImage();
    }

});


// =========================================================
// AKTIVNÍ KAPITOLA V LEVÉM MENU
// =========================================================

const chapters = document.querySelectorAll(".chapter");
const menuLinks = document.querySelectorAll(".chapter-menu a");

let isAtTop = window.scrollY < 100;

function clearActive() {
    menuLinks.forEach(link => {
        link.classList.remove("active");
    });
}

// Sledujeme, jestli jsme úplně nahoře
window.addEventListener("scroll", () => {

    isAtTop = window.scrollY < 100;

    if (isAtTop) {
        clearActive();
    }

}, { passive: true });


// Sledujeme kapitoly
const observer = new IntersectionObserver(
    entries => {

        // Pokud jsme nahoře, žádná kapitola není aktivní
        if (isAtTop) {
            return;
        }

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                clearActive();

                const activeLink = document.querySelector(
                    `.chapter-menu a[href="#${entry.target.id}"]`
                );

                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }

        });

    },
    {
        root: null,
        threshold: 0.25
    }
);

chapters.forEach(chapter => {
    observer.observe(chapter);
});


// =========================================================
// NÁVRAT NA ZAČÁTEK STRÁNKY
// =========================================================

const homeLink = document.querySelector(".side-menu-title");

homeLink.addEventListener("click", () => {

    isAtTop = true;
    clearActive();

});


// =========================================================
// AUDIO U KAPITOL
// =========================================================

document.querySelectorAll(".chapter-with-audio").forEach(block => {

    const button = block.querySelector(".audio-button");
    const audio = block.querySelector(".chapter-audio");

    button.addEventListener("click", () => {

        // Pokud právě hraje
        if (!audio.paused) {

            audio.pause();
            button.classList.remove("playing");
            button.textContent = "🔊";

        } else {

            // Zastaví případné jiné audio na stránce
            document.querySelectorAll(".chapter-audio").forEach(otherAudio => {
                otherAudio.pause();
            });

            document.querySelectorAll(".audio-button").forEach(otherButton => {
                otherButton.classList.remove("playing");
                otherButton.textContent = "🔊";
            });

            audio.play();

            button.classList.add("playing");
            button.textContent = "⏸";
        }
    });

    // Po dohrání vrátíme ikonku reproduktoru
    audio.addEventListener("ended", () => {

        button.classList.remove("playing");
        button.textContent = "🔊";

    });

});
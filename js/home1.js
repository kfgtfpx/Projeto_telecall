/* =====================================================================
                              
    Autor original: Pamela
    JS corrigido para evitar erros e fazer botões funcionarem
    
===================================================================== */


/* =====================================================================
   VERIFICAÇÃO DE ScrollReveal — evita erros que travam o JS
===================================================================== */

function safeReveal(selector, config) {
  if (window.ScrollReveal) {
    ScrollReveal().reveal(selector, config);
  }
}

// HERO
safeReveal(".hero-left", {
  origin: "bottom",
  duration: 900,
  distance: "50px",
  delay: 500,
  interval: 100,
});

safeReveal(".hero-right", {
  origin: "bottom",
  duration: 900,
  distance: "80px",
  easing: "ease-in-out",
  delay: 400,
});

// CARROUSEL
safeReveal("#carrousel", {
  origin: "bottom",
  duration: 1000,
  scale: 0.9,
  distance: "100px",
  delay: 900,
});

// CPAAS
safeReveal(".cpaas-img", {
  origin: "left",
  duration: 900,
  distance: "100px",
  delay: 800,
});

safeReveal(".cpaas-right", {
  origin: "right",
  duration: 900,
  distance: "100px",
  delay: 800,
});

// SOLUÇÕES
safeReveal("#solucoes .title", {
  origin: "bottom",
  duration: 900,
  distance: "100px",
  delay: 500,
});

safeReveal("#solucoes .text", {
  origin: "bottom",
  duration: 900,
  distance: "100px",
  delay: 700,
});

safeReveal("#solucoes .card", {
  origin: "bottom",
  duration: 900,
  distance: "100px",
  delay: 1200,
  interval: 300,
  scale: 0.9,
});

// PLANOS
safeReveal("#planos", {
  origin: "bottom",
  duration: 900,
  distance: "100px",
  scale: 1.5,
  delay: 700,
});

// SUPORTE
safeReveal("#suporte .title", {
  origin: "bottom",
  duration: 900,
  distance: "100px",
  delay: 500,
  interval: 300,
});

safeReveal(".left-suporte", {
  origin: "left",
  duration: 900,
  distance: "100px",
  delay: 900,
  interval: 300,
});

safeReveal(".right-suporte", {
  origin: "right",
  duration: 900,
  distance: "100px",
  delay: 900,
  interval: 300,
});



/* =====================================================================
    ScrollSpy
===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function activateNavLinkOnScroll() {
    let currentSection = "";

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activateNavLinkOnScroll);
  activateNavLinkOnScroll();
});



/* =====================================================================
    DARK MODE + FONT SIZE
===================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
        DARK MODE
  ============================== */

  const darkModeToggle = document.getElementById("darkmode-toggle");
  const darkModeIcon = document.getElementById("darkmode-icon");
  let darkmode = localStorage.getItem("darkmode");

  const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "enabled");
    darkModeIcon.src = "assets/icons/icon-claro.svg";
  };

  const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
    darkModeIcon.src = "assets/icons/icon-escuro.svg";
  };

  if (darkmode === "enabled") enableDarkMode();

  darkModeToggle.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode");
    if (darkmode !== "enabled") enableDarkMode();
    else disableDarkMode();
  });



  /* ==============================
       FONTE + / -
  ============================== */

  let fontSizeLevel = 0;
  const increaseBtn = document.getElementById("increase-font");
  const decreaseBtn = document.getElementById("decrease-font");

  function applyFontSize() {
    document.body.classList.remove("font-small", "font-normal", "font-large");

    if (fontSizeLevel < 0) {
      document.body.classList.add("font-small");
    } else if (fontSizeLevel === 0) {
      document.body.classList.add("font-normal");
    } else {
      document.body.classList.add("font-large");
    }
  }

  increaseBtn.addEventListener("click", () => {
    if (fontSizeLevel < 1) {
      fontSizeLevel++;
      applyFontSize();
    }
  });

  decreaseBtn.addEventListener("click", () => {
    if (fontSizeLevel > -1) {
      fontSizeLevel--;
      applyFontSize();
    }
  });

  applyFontSize();
});

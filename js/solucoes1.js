/* =====================================================================
                              
                            Autor original: Pamela
    
   =====================================================================  */



/* ========================================
   Scroll Animation
   ======================================== */

//  FUNDO AZUL 
ScrollReveal().reveal(".h1-fundoAzul", {
  origin: "bottom",
  duration: 900,
  distance: "50px",
  delay: 500,
  scale: 1,
  interval: 100,
});

ScrollReveal().reveal(".p-fundoAzul", {
  origin: "bottom",
  duration: 900,
  distance: "50px",
  delay: 1200,
  scale: 0.9,
  interval: 100,
});

//  TODAS AS SEÇOES

ScrollReveal().reveal(".tittle-solucoes", {
  origin: "bottom",
  duration: 600,
  distance: "50px",
  delay: 500,
  scale: 1,
  interval: 100,
});

ScrollReveal().reveal(".texto p", {
  origin: "bottom",
  duration: 900,
  distance: "50px",
  delay: 800,
  scale: 0.9,
  interval: 100,
});

ScrollReveal().reveal(".subtitulo-vermelho", {
  origin: "bottom",
  duration: 600,
  distance: "50px",
  delay: 1500,
  interval: 100,
});

ScrollReveal().reveal(".beneficios li", {
  origin: "bottom",
  duration: 500,
  distance: "50px",
  delay: 1500,
  interval: 200,
});

ScrollReveal().reveal(".imagem", {
  origin: "bottom",
  duration: 700,
  distance: "50px",
  delay: 900,
  scale: 1.5,
  interval: 200,
});

ScrollReveal().reveal(".passo", {
  origin: "bottom",
  duration: 700,
  distance: "50px",
  delay: 1700,
  scale: 1.5,
  interval: 200,
});

ScrollReveal().reveal(".cta-container", {
  origin: "bottom",
  duration: 700,
  distance: "50px",
  delay: 1700,
  scale: 2,
  interval: 200,
});

/* ========================================
   Dark Mode
   ======================================== */

   let darkmode = localStorage.getItem("darkmode");
   const darkModeToggle = document.getElementById("darkmode-toggle");
   const darkModeIcon = document.getElementById("darkmode-icon");
   
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
   
   if (darkmode === "enabled") {
     enableDarkMode();
   } else {
     disableDarkMode();
   }
   
   darkModeToggle.addEventListener("click", () => {
     darkmode = localStorage.getItem("darkmode");
   
     if (darkmode !== "enabled") {
       enableDarkMode();
     } else {
       disableDarkMode();
     }
   });
   
   

/* ========================================
   Botões de Aumentar/Diminuir Fonte
   ======================================== */

   let fontSizeLevel = 0;

   const body = document.body;
   const increaseBtn = document.getElementById("increase-font");
   const decreaseBtn = document.getElementById("decrease-font");
   
   function applyFontSize() {
     body.classList.remove("font-small", "font-normal", "font-large");
     if (fontSizeLevel < 0) {
       body.classList.add("font-small");
     } else if (fontSizeLevel === 0) {
       body.classList.add("font-normal");
     } else {
       body.classList.add("font-large");
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

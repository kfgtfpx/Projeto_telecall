/* =====================================================================
                        Autor original: Renan
                        Modificações por: Pamela

  ! Modificações:
    - Adição de animações na página
    - Script do darkmode
    - Script dos botões de acessibilidade
    - Correção de alguns bugs na validação

===================================================================== */

/* ========================================
   Scroll Animation
   ======================================== */

   ScrollReveal().reveal("#login-title", {
    origin: "bottom",
    duration: 500,
    distance: "50px",
    easing: "ease",
    delay: 400,
    reset: true,
   });

   ScrollReveal().reveal("#login-description", {
     origin: "bottom",
     duration: 900,
     distance: "50px",
     delay: 900,
     reset: true,
   });
   
   ScrollReveal().reveal("#form",{ 
    origin: "bottom",
    duration: 800,
    distance: "50px",
    easing: "ease",
    delay: 1300,
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
   
   
   /* ========================================
   Validação de login
   ======================================== */
   document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    const login = document.getElementById("login");
    const form = document.getElementById("form");
  
    if (!form || !login || !password) return; // Proteção extra
  
    // Alternar visibilidade da senha
    togglePassword?.addEventListener("click", function () {
      const isPassword = password.type === "password";
      password.type = isPassword ? "text" : "password";
      togglePassword.src = isPassword
        ? "../assets/icons/Olho fechado.svg"
        : "../assets/icons/Olho aberto.svg";
    });
  
    // Exibir mensagem de erro
    function showError(msg) {
      let errorDiv = document.getElementById("login-error");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "login-error";
        errorDiv.className = "alert alert-danger mt-2";
        form.prepend(errorDiv);
      }
      errorDiv.textContent = msg;
    }
  
    // Validação de login
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const oldError = document.getElementById("login-error");
      if (oldError) oldError.remove();
  
      const loginValue = login.value.trim();
      const loginPassword = password.value.trim();
  
      if (!loginValue || !loginPassword) {
        showError("Preencha todos os campos.");
        return;
      }
  
      const userData = localStorage.getItem(loginValue);
      if (!userData) {
        showError("Login não cadastrado.");
        return;
      }
  
      const user = JSON.parse(userData);
  
      if (user.password !== loginPassword) {
        showError("Senha incorreta.");
        return;
      }
  
      localStorage.setItem("usuarioLogado", user.nome);
      window.location.href = "../home-logado.html";
    });
  
    // Botão voltar
    document.getElementById("btn-voltar")?.addEventListener("click", function () {
      window.location.href = "../home.html";
    });
  });
  
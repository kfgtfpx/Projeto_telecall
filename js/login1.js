/* =====================================================================
                        Autor original: Renan
                        Modificações por: Pamela e ajustes finais GPT
===================================================================== */

/* ========================================
   Scroll Animation
   ======================================== */
 console.log("LOGIN.JS CARREGOU!");


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

ScrollReveal().reveal("#form", { 
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
   Validação de login + redirecionamento 2FA
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
      ? "../assets/icons/Olho aberto.svg"
      : "../assets/icons/Olho fechado.svg";
  });

  // 🔥🔴 **AQUI VOCÊ ADICIONA A FUNÇÃO DO TOAST** 🔴🔥
  function showToast(message, type = 'error') {
    const config = {
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
    };
    
    if (type === 'error') {
        config.style = {
            background: "linear-gradient(to right, #dc3545, #c82333)",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontSize: "14px",
            fontWeight: "500"
        };
    } else if (type === 'success') {
        config.style = {
            background: "linear-gradient(to right, #28a745, #218838)",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontSize: "14px",
            fontWeight: "500"
        };
    }
    
    Toastify(config).showToast();
  }

  // 🔥🔴 **AQUI VOCÊ SUBSTITUI A VALIDAÇÃO ANTIGA** 🔴🔥
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const loginValue = login.value.trim();
    const loginPassword = password.value.trim();

    // Validação básica de campos vazios
    if (!loginValue || !loginPassword) {
      showToast("Preencha login e senha.", "error");
      return;
    }

    // Enviar dados para PHP
    const formData = new FormData();
    formData.append("login", loginValue);
    formData.append("senha", loginPassword);

    // Feedback visual de carregamento
    const btnEntrar = form.querySelector("button[type='submit']");
    const originalText = btnEntrar.textContent;
    btnEntrar.disabled = true;
    btnEntrar.textContent = "Entrando...";

    fetch("backend/Login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Login bem-sucedido
          showToast(data.message, "success");
           localStorage.setItem("usuarioLogado", loginValue);
           localStorage.setItem("user_id", data.user_id);
           localStorage.setItem("perfil_id", data.perfil_id);
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1500);
        } else if (data.status === "error") {
          // Erro no login
          showToast(data.message, "error");
          btnEntrar.disabled = false;
          btnEntrar.textContent = originalText;
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        showToast("Erro de conexão. Tente novamente.", "error");
        btnEntrar.disabled = false;
        btnEntrar.textContent = originalText;
      });
  });

  // Botão voltar
  document.getElementById("btn-voltar")?.addEventListener("click", function () {
    window.location.href = "../home.html";
  });
});
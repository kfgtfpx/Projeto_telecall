// =====================================================================
// Autor original: Renan
// Modificações por: Pamela e ajustes finais GPT
// =====================================================================

console.log("LOGIN.JS CARREGOU!");

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

function initializeDarkMode() {
    let darkmode = localStorage.getItem("darkmode");
    const darkModeToggle = document.getElementById("darkmode-toggle");
    
    const enableDarkMode = () => {
        document.body.classList.add("darkmode");
        localStorage.setItem("darkmode", "enabled");
        console.log("Dark Mode Ativado");
    };
    
    const disableDarkMode = () => {
        document.body.classList.remove("darkmode");
        localStorage.setItem("darkmode", null);
        console.log("Dark Mode Desativado");
    };

    // Estado inicial
    if (darkmode === "enabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            darkmode = localStorage.getItem("darkmode");
            if (darkmode !== "enabled") {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
}

/* ========================================
   Font Size
   ======================================== */

function initializeFontSize() {
    let fontSizeLevel = parseInt(localStorage.getItem("fontSizeLevel")) || 0;
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
        
        localStorage.setItem("fontSizeLevel", fontSizeLevel);
    }

    if (increaseBtn) {
        increaseBtn.addEventListener("click", () => {
            if (fontSizeLevel < 1) {
                fontSizeLevel++;
                applyFontSize();
            }
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener("click", () => {
            if (fontSizeLevel > -1) {
                fontSizeLevel--;
                applyFontSize();
            }
        });
    }

    applyFontSize();
}

/* ========================================
   Função de Toast
   ======================================== */

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

/* ========================================
   Função para Limpar Formulário
   ======================================== */

function initializeClearForm() {
    const clearButton = document.getElementById('clearForm');
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            const form = document.getElementById('form');
            if (form) {
                form.reset();
                showToast('Formulário limpo com sucesso!', 'success');
            }
        });
    }
}

/* ========================================
   Validação de Login
   ======================================== */

function initializeLoginForm() {
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    const login = document.getElementById("login");
    const form = document.getElementById("form");

    if (!form || !login || !password) return;

    // Alternar visibilidade da senha
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const isPassword = password.type === "password";
            password.type = isPassword ? "text" : "password";
            togglePassword.src = isPassword
                ? "assets/icons/Olho aberto.svg"
                : "assets/icons/Olho fechado.svg";
        });
    }

    // Validação do formulário
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const loginValue = login.value.trim();
        const loginPassword = password.value.trim();

        // 1. Validação de campos obrigatórios
        if (!loginValue || !loginPassword) {
            showToast("Preencha login e senha.", "error");
            return;
        }

        // Validação do login (6 caracteres alfabéticos)
        if (loginValue.length !== 6 || !/^[A-Za-z]+$/.test(loginValue)) {
            showToast("Login deve ter exatamente 6 caracteres alfabéticos.", "error");
            return;
        }

        // Validação da senha (8 caracteres alfabéticos)
        if (loginPassword.length !== 8 || !/^[A-Za-z]+$/.test(loginPassword)) {
            showToast("Senha deve ter exatamente 8 caracteres alfabéticos.", "error");
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
}

/* ========================================
   Inicialização Geral
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Carregado - Inicializando funcionalidades...");
    
    initializeDarkMode();
    initializeFontSize();
    initializeLoginForm();
    initializeClearForm();
    
    console.log("Todas as funcionalidades inicializadas!");
});
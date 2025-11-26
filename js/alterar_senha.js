/* =====================================================================
                        Autor original: Renan
                        Modificações por: Pamela e ajustes finais GPT
===================================================================== */

console.log("ALTERAR_SENHA.JS CARREGOU!");

/* ========================================
   Scroll Animation
   ======================================== */

ScrollReveal().reveal("h2", {
  origin: "bottom",
  duration: 500,
  distance: "50px",
  easing: "ease",
  delay: 400,
  reset: true,
});

ScrollReveal().reveal("#form-alterar-senha", { 
  origin: "bottom",
  duration: 800,
  distance: "50px",
  easing: "ease",
  delay: 800,
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
  if (darkModeIcon) {
    darkModeIcon.style.color = "#fafafa";
  }
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
  if (darkModeIcon) {
    darkModeIcon.style.color = "#111111";
  }
};

if (darkmode === "enabled") {
  enableDarkMode();
} else {
  disableDarkMode();
}

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
  
  // Salva no localStorage
  localStorage.setItem("fontSizeLevel", fontSizeLevel);
}

// Carrega configuração salva
const savedFontSize = localStorage.getItem("fontSizeLevel");
if (savedFontSize !== null) {
  fontSizeLevel = parseInt(savedFontSize);
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

// Aplica o tamanho de fonte salvo ao carregar a página
applyFontSize();

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
   Alteração de Senha
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado");

    // FORMULARIO DE ALTERAR SENHA
    const form = document.getElementById("form-alterar-senha");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            console.log("Formulário submetido");

            const login = document.getElementById("login").value;
            const senha_atual = document.getElementById("senha_atual").value;
            const nova_senha = document.getElementById("nova_senha").value;
            const confirmar_senha = document.getElementById("confirmar_senha").value;
            const msg = document.getElementById("msg");

            // Validações básicas
            if (!login) {
                showToast("Por favor, digite seu login!", "error");
                return;
            }

            // Valida tamanho do login (máximo 6 caracteres)
            if (login.length > 6) {
                showToast("O login deve ter no máximo 6 caracteres!", "error");
                return;
            }

            if (!senha_atual || !nova_senha || !confirmar_senha) {
                showToast("Todos os campos de senha são obrigatórios!", "error");
                return;
            }

            // Verifica se as senhas coincidem
            if (nova_senha !== confirmar_senha) {
                showToast("As novas senhas não coincidem!", "error");
                return;
            }

            // Verifica se a nova senha é diferente da atual
            if (senha_atual === nova_senha) {
                showToast("A nova senha deve ser diferente da senha atual!", "error");
                return;
            }

            // Mostra loading
            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = "Alterando...";
            btnSubmit.disabled = true;

            try {
                console.log("Enviando dados para PHP...", {
                    login: login,
                    senha_atual: senha_atual,
                    nova_senha: nova_senha
                });
                
                const response = await fetch("backend/alterar_senha.php", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        login: login,
                        senha_atual: senha_atual,
                        nova_senha: nova_senha
                    })
                });

                console.log("Status da resposta:", response.status);
                const data = await response.json();
                console.log("Resposta PHP:", data);

                if (data.status === "success") {
                    showToast("Senha alterada com sucesso! Redirecionando para login...", "success");
                    
                    // Limpa o formulário
                    form.reset();
                    
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                } else {
                    showToast("Erro: " + data.message, "error");
                }
            } catch (error) {
                console.error("Erro completo:", error);
                showToast("Erro de conexão com o servidor. Tente novamente.", "error");
            } finally {
                // Restaura o botão
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
            }
        });
    }

    // BOTÃO VOLTAR
    const voltarBtn = document.getElementById("voltar-home");
    if (voltarBtn) {
        voltarBtn.addEventListener("click", function() {
            window.location.href = "home-logado.html";
        });
    }
});
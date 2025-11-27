/* =====================================================================
                              
                      HOME LOGADO JS (CORRIGIDO)

===================================================================== */


/* ==========================================================
   FUNÇÃO SEGURA PARA ScrollReveal
   ========================================================== */
function safeReveal(selector, config) {
    if (window.ScrollReveal) {
        ScrollReveal().reveal(selector, config);
    }
}



/* ==========================================================
   EXIBIR NOME DO USUÁRIO
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = localStorage.getItem("usuarioLogado");
    const spansUsername = document.querySelectorAll(".username");

    if (nomeUsuario) {
        spansUsername.forEach(span => span.textContent = nomeUsuario);
    }
});



/* ==========================================================
   ADICIONAR BOTÕES DE ADMIN
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const perfil = localStorage.getItem("perfil_id");
    const dropdownMenus = document.querySelectorAll(".dropdown-menu");

    if (perfil === "1") {
        dropdownMenus.forEach(menu => {

            const btnConsulta = document.createElement("li");
            btnConsulta.innerHTML = `
                <a class="dropdown-item" href="consulta_usuarios.html">
                    Consultar Usuários
                </a>
            `;

            const btnLogs = document.createElement("li");
            btnLogs.innerHTML = `
                <a class="dropdown-item" href="log.html">
                    Logs do Sistema
                </a>
            `;

            menu.prepend(btnLogs);
            menu.prepend(btnConsulta);
        });
    }
});

/* ============================
   BOTÃO EXCLUSIVO DE USUÁRIO COMUM
============================ */
document.addEventListener("DOMContentLoaded", () => {
    const perfil = localStorage.getItem("perfil_id");

    if (perfil === "2") {  // perfil comum
        const dropdownMenus = document.querySelectorAll(".dropdown-menu");

        dropdownMenus.forEach(menu => {
            const btnAlterarSenha = document.createElement("li");
            btnAlterarSenha.innerHTML = `
                <a class="dropdown-item" href="alterar_senha.html">
                    Alterar Senha
                </a>
            `;
            menu.appendChild(btnAlterarSenha);
        });
    }
});

/* ==========================================================
   POPUP DE LOGOUT
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll(".logout-button");
    const popup = document.getElementById("logout-popup");
    const confirmLogout = document.getElementById("confirm-logout");
    const cancelLogout = document.getElementById("cancel-logout");

    logoutButtons.forEach(btn => {
        btn.addEventListener("click", () => popup.classList.remove("hidden"));
    });

    cancelLogout?.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    confirmLogout?.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("perfil_id");
        window.location.href = "login.html";
    });
});



/* ==========================================================
   SCROLL REVEAL — agora seguro
   ========================================================== */

safeReveal(".hero-left", {
    origin: "bottom",
    duration: 900,
    distance: "50px",
    delay: 500
});

safeReveal(".hero-right", {
    origin: "bottom",
    duration: 900,
    distance: "80px",
    delay: 400
});

safeReveal("#carrousel", {
    origin: "bottom",
    duration: 1000,
    distance: "100px",
    delay: 900
});

safeReveal(".cpaas-img", {
    origin: "left",
    duration: 900,
    distance: "100px",
    delay: 800
});

safeReveal(".cpaas-right", {
    origin: "right",
    duration: 900,
    distance: "100px",
    delay: 800
});

safeReveal("#solucoes .card", {
    origin: "bottom",
    duration: 900,
    distance: "100px",
    delay: 1200,
    interval: 300,
    scale: 0.9
});



/* ==========================================================
   DARK MODE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

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
        localStorage.setItem("darkmode", "disabled");
        darkModeIcon.src = "assets/icons/icon-escuro.svg";
    };

    if (darkmode === "enabled") enableDarkMode();
    else disableDarkMode();

    darkModeToggle?.addEventListener("click", () => {
        darkmode = localStorage.getItem("darkmode");
        if (darkmode !== "enabled") enableDarkMode();
        else disableDarkMode();
    });
});



/* ==========================================================
   AUMENTAR / DIMINUIR TAMANHO DA FONTE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

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

    increaseBtn?.addEventListener("click", () => {
        if (fontSizeLevel < 1) {
            fontSizeLevel++;
            applyFontSize();
        }
    });

    decreaseBtn?.addEventListener("click", () => {
        if (fontSizeLevel > -1) {
            fontSizeLevel--;
            applyFontSize();
        }
    });

    applyFontSize();
});

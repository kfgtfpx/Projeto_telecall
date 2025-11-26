// scripts/cadastro.js
// JS completo: Dark Mode, Font Tools, Home button, Masks, ViaCEP e Validações.
// Recomendação: colocar <script src="scripts/cadastro.js"></script> antes do </body>.

/* ============================
   Helper - DOMContentLoaded
============================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ============================
     ELEMENT REFERENCES
  ============================ */
  const form = document.getElementById("form");
  const homeBtn = document.getElementById("home-btn");
  const darkModeToggle = document.getElementById("darkmode-toggle");
  const darkModeIcon = document.getElementById("darkmode-icon");
  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");

  const inputName = document.getElementById("name");
  const inputMother = document.getElementById("mothername");
  const inputLogin = document.getElementById("login");
  const inputDate = document.getElementById("data");
  const inputGender = document.getElementById("gender");
  const inputCPF = document.getElementById("cpf");
  const inputCEP = document.getElementById("cep");
  const inputEndereco = document.getElementById("endereco");
  const inputNumber = document.getElementById("number");
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");
  const inputConfirm = document.getElementById("confirmpassword");

  /* ============================
     DARK MODE
  ============================ */
  // Safe-guard - only run if elements exist
  if (darkModeToggle && darkModeIcon) {
    const DARK_KEY = "darkmode";
    function enableDarkMode() {
      document.body.classList.add("darkmode");
      localStorage.setItem(DARK_KEY, "enabled");
      darkModeIcon.src = "assets/icons/icon-claro.svg";
    }
    function disableDarkMode() {
      document.body.classList.remove("darkmode");
      localStorage.setItem(DARK_KEY, "disabled");
      darkModeIcon.src = "assets/icons/icon-escuro.svg";
    }
    // init
    const savedDark = localStorage.getItem(DARK_KEY);
    if (savedDark === "enabled") enableDarkMode();
    else disableDarkMode();

    // toggle
    darkModeToggle.addEventListener("click", function () {
      const now = localStorage.getItem(DARK_KEY);
      if (now !== "enabled") enableDarkMode();
      else disableDarkMode();
    });
  }

  /* ============================
     FONT SIZE (A+ / A-)
  ============================ */
  if (increaseFontBtn && decreaseFontBtn) {
    // We'll store levels: -1, 0, 1 where 0 is default
    const FONT_KEY = "fontSizeLevel";
    let fontLevel = Number(localStorage.getItem(FONT_KEY)) || 0;

    function applyFontLevel() {
      document.body.classList.remove("font-small", "font-normal", "font-large");
      if (fontLevel < 0) document.body.classList.add("font-small");
      else if (fontLevel > 0) document.body.classList.add("font-large");
      else document.body.classList.add("font-normal");
      localStorage.setItem(FONT_KEY, String(fontLevel));
    }

    increaseFontBtn.addEventListener("click", () => {
      if (fontLevel < 1) {
        fontLevel++;
        applyFontLevel();
      }
    });

    decreaseFontBtn.addEventListener("click", () => {
      if (fontLevel > -1) {
        fontLevel--;
        applyFontLevel();
      }
    });

    applyFontLevel();
  }

  /* ============================
     HOME BUTTON
  ============================ */
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      // Navigate to home; adjust path if needed
      window.location.href = "home-logado.html";
    });
  }

  /* ============================
     MÁSCARAS: CPF, CEP, TELEFONE
  ============================ */
  function maskCPF(value) {
    let v = value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  }

  function maskCEP(value) {
    let v = value.replace(/\D/g, "").slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
  }

  function maskPhone(value) {
    let v = value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
  }

  if (inputCPF) {
    inputCPF.addEventListener("input", e => {
      const pos = e.target.selectionStart;
      e.target.value = maskCPF(e.target.value);
      // attempt to keep caret at end (simple)
      e.target.selectionStart = e.target.selectionEnd = pos;
    });
  }

  if (inputCEP) {
    inputCEP.addEventListener("input", e => {
      const pos = e.target.selectionStart;
      e.target.value = maskCEP(e.target.value);
      e.target.selectionStart = e.target.selectionEnd = pos;
    });
  }

  if (inputNumber) {
    inputNumber.addEventListener("input", e => {
      const pos = e.target.selectionStart;
      e.target.value = maskPhone(e.target.value);
      e.target.selectionStart = e.target.selectionEnd = pos;
    });
  }

  /* ============================
     VIA CEP - Preenche Endereço
  ============================ */
  if (inputCEP) {
    inputCEP.addEventListener("blur", async function () {
      // remove non-digit
      const cepRaw = (this.value || "").replace(/\D/g, "");
      if (!cepRaw) return;
      if (cepRaw.length !== 8) {
        // cep inválido (apenas notifica, não impede envio)
        // console.warn("CEP inválido");
        return;
      }

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`);
        const data = await res.json();
        if (!data || data.erro) {
          // cep não encontrado
          // console.warn("CEP não encontrado");
          return;
        }
        // Preenche endereço (ajuste o formato conforme preferir)
        if (inputEndereco) {
          const parts = [
            data.logradouro || "",
            data.bairro || "",
            data.localidade || "",
            data.uf || ""
          ].filter(Boolean);
          inputEndereco.value = parts.join(", ");
        }
      } catch (err) {
        // console.error("Erro ao buscar CEP", err);
      }
    });
  }

  /* ============================
     VALIDAÇÕES DO FORMULÁRIO
     - Se retornar false, evita submit
     - Se true, permite envio (PHP tratará e redirecionará)
  ============================ */
  function validateForm() {
    // Trim values
    const name = inputName ? inputName.value.trim() : "";
    const mother = inputMother ? inputMother.value.trim() : "";
    const login = inputLogin ? inputLogin.value.trim() : "";
    const date = inputDate ? inputDate.value.trim() : "";
    const gender = inputGender ? inputGender.value : "";
    const cpf = inputCPF ? inputCPF.value.replace(/\D/g, "") : "";
    const cep = inputCEP ? inputCEP.value.replace(/\D/g, "") : "";
    const endereco = inputEndereco ? inputEndereco.value.trim() : "";
    const number = inputNumber ? inputNumber.value.replace(/\D/g, "") : "";
    const email = inputEmail ? inputEmail.value.trim() : "";
    const password = inputPassword ? inputPassword.value : "";
    const confirm = inputConfirm ? inputConfirm.value : "";

    // Required
    if (!name || !mother || !login || !date || !gender || !cpf || !number || !password || !confirm) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    // login exactly 6 chars (letters or whatever logic)
    if (login.length !== 6) {
      alert("O login deve conter exatamente 6 caracteres.");
      return false;
    }

    // password length (8)
    if (password.length !== 8) {
      alert("A senha deve conter exatamente 8 caracteres.");
      return false;
    }

    if (password !== confirm) {
      alert("As senhas não coincidem.");
      return false;
    }

    // CPF length check (11 digits)
    if (cpf.length !== 11) {
      alert("CPF inválido. Certifique-se de inserir 11 dígitos.");
      return false;
    }

    // CEP optional: if filled, must be 8 digits
    if (cep && cep.length !== 8) {
      alert("CEP inválido. Digite 8 dígitos.");
      return false;
    }

    // Telephone basic check: 10-11 digits
    if (number.length < 10 || number.length > 11) {
      alert("Telefone inválido. Digite o DDD e o número (10 ou 11 dígitos).");
      return false;
    }

    // email simple check
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      alert("E-mail inválido.");
      return false;
    }

    // All good
    return true;
  }

  /* ============================
     FORM SUBMIT HANDLER
  ============================ */
  if (form) {
    form.addEventListener("submit", function (e) {
      // run validations. if invalid, prevent submit
      const ok = validateForm();
      if (!ok) {
        e.preventDefault();
        return false;
      }
      // else: do not preventDefault -> allow normal POST to backend/Cadastro.php
      // PHP will execute and redirect to home-logado.html if success
      return true;
    });
  }

  /* ============================
     Optional: small UX helpers
     - Toggle simple show/hide password icons if present (#icon1/#icon2)
  ============================ */
  const icon1 = document.getElementById("icon1");
  const icon2 = document.getElementById("icon2");
  if (icon1 && inputPassword) {
    icon1.addEventListener("click", () => {
      if (inputPassword.type === "password") {
        inputPassword.type = "text";
        icon1.src = "assets/icons/hide.png";
      } else {
        inputPassword.type = "password";
        icon1.src = "assets/icons/show.png";
      }
    });
  }
  if (icon2 && inputConfirm) {
    icon2.addEventListener("click", () => {
      if (inputConfirm.type === "password") {
        inputConfirm.type = "text";
        icon2.src = "assets/icons/hide.png";
      } else {
        inputConfirm.type = "password";
        icon2.src = "assets/icons/show.png";
      }
    });
  }

}); // end DOMContentLoaded

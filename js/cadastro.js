/* =====================================================================
                        Autor original: Juan e Carolina
                        Modificações por: Pamela

  ! Modificações:
    - Adição de animações na página
    - Script do darkmode
    - Script dos botões de acessibilidade
    - Ao acabar o cadastro, te enviar para a página de login
    - Colocar as informações dentro de um array no LocalStorage

===================================================================== */

/* ========================================
   Scroll Animation
   ======================================== */

   ScrollReveal().reveal("h1", {
    origin: "bottom",
    duration: 500,
    distance: "50px",
    easing: "ease",
    delay: 400,
    
  });

   ScrollReveal().reveal("span", {
    origin: "bottom",
    duration: 500,
    distance: "50px",
    easing: "ease",
    delay: 900,
  });

   ScrollReveal().reveal(".input-group", {
    origin: "bottom",
    duration: 800,
    distance: "50px",
    easing: "ease",
    delay: 1300,
  });
   


/* ========================================
   Validação de campos do formulário
   ======================================== */

let name = document.getElementById("name").value;
let mothername = document.getElementById("mothername").value;
let login = document.getElementById("login").value;
let data = document.getElementById("data").value;
let gender = document.getElementById("select").value;
let cpf = document.getElementById("cpf").value;
let address = document.getElementById("address").value;
let cel = document.getElementById("cel").value;
let tel = document.getElementById("tel").value;
let password = document.getElementById("password").value;
let confirmpassword = document.getElementById("confirmpassword").value;
let icon1 = document.getElementById("icon1");
let icon2 = document.getElementById("icon2");
let erroLogin = document.getElementById("erroLogin");

function formatarTelefone(input) {
  var telefone = input.value.replace(/\D/g, "");

  telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");

  input.value = telefone;
}

function mascara_cpf(input) {
  var cpf = input.value.replace(/\D/g, "");

  cpf = cpf.replace(/(^\d{3})(\d{3})(\d{3})(\d{2}$)/, "$1.$2.$3-$4");

  input.value = cpf;
}

function verOcultarSenha1() {
  let password = document.getElementById("password");
  let icon1 = document.getElementById("icon1");
  if (password.type === "password") {
    password.type = "text";
    icon1.src = "../assets/icons/hide.png";
  } else {
    password.type = "password";
    icon1.src = "../assets/icons/show.png";
  }
}

function verOcultarSenha2() {
  let confirmpassword = document.getElementById("confirmpassword");
  let icon2 = document.getElementById("icon2");
  if (confirmpassword.type === "password") {
    confirmpassword.type = "text";
    icon2.src = "../assets/icons/show.png";
  } else {
    confirmpassword.type = "password";
    icon2.src = "../assets/icons/hide.png";
  }
}

function validarLogin() {
  const loginInput = document.getElementById("login"); 
  const erroLogin = document.getElementById("erro-login");
  const valor = loginInput.value; 

  const regex = /^[A-Za-z]{6}$/;

  if (valor.length === 0) {
    erroLogin.textContent = ""; // limpa a mensagem, não mostra erro se estiver vazio
  } else if (!regex.test(valor)) {
    erroLogin.textContent = "O login deve conter exatamente 6 letras (sem números ou símbolos)";
  } else {
    erroLogin.textContent = ""; // está tudo certo, limpa a mensagem
  }
}

function validarSenha() {
  const senhaInput = document.getElementById("password");
  const erroSenha = document.getElementById("erro-senha");
  const valor = senhaInput.value; 

  const regex = /^[A-Za-z]{8}$/;

  if (valor.length === 0) {
    erroSenha.textContent = "";
  } else if (!regex.test(valor)) {
    erroSenha.textContent = "A senha deve conter exatamente 8 letras";
   } else {
      erroSenha.textContent = "";
    }
 }

function validarConfirmSenha() {
  const confirmSenhaInput = document.getElementById("confirmpassword");
  const erroSenha = document.getElementById("erro-confirma");
  const valor = confirmSenhaInput.value; 

  const regex = /^[A-Za-z]{8}$/;

  if (valor.length === 0) {
    erroSenha.textContent = "";
  } else if (!regex.test(valor)) {
    erroSenha.textContent = "A senha deve conter exatamente 8 letras";
   } else {
      erroSenha.textContent = "";
    }
 }

 document.getElementById("login").addEventListener("input", validarLogin);
 document.getElementById("password").addEventListener("input", validarSenha);
 document.getElementById("confirmpassword").addEventListener("input", validarConfirmSenha);
 


function senha(validar) {
  const errorspan1 = inputbox4.queryselector(".error");
  const errorspan2 = inputbox5.queryselector(".error");
  if (password != confirmpassword) {
    validar.preventdefault;
    errorspan1.innerHTML = "As senhas não condizem!";
    errorspan2.innerHTML = "As senhas não condizem!";
  }
}

function salvar_tudo() {
  const usuario = {
    nome: document.getElementById("name").value,
    mothername: document.getElementById("mothername").value,
    data: document.getElementById("data").value,
    gender: document.getElementById("select").value,
    cpf: document.getElementById("cpf").value,
    address: document.getElementById("address").value,
    cel: document.getElementById("cel").value,
    tel: document.getElementById("tel").value,
    password: document.getElementById("password").value
  };

  const login = document.getElementById("login").value;
  localStorage.setItem(login, JSON.stringify(usuario));
}


document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  // Pega os valores dos campos
  const name = document.getElementById("name").value.trim();
  const mothername = document.getElementById("mothername").value.trim();
  const login = document.getElementById("login").value.trim();
  const data = document.getElementById("data").value.trim();
  const gender = document.getElementById("select").value;
  const cpf = document.getElementById("cpf").value.trim();
  const address = document.getElementById("address").value.trim();
  const cel = document.getElementById("cel").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  // Validação dos campos obrigatórios
  if (
    !name ||
    !mothername ||
    !login ||
    !data ||
    !gender ||
    !cpf ||
    !cel ||
    !password ||
    !confirmpassword
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    event.preventDefault();
    return;
  }

  // Validação de senha
  if (password !== confirmpassword) {
    alert("As senhas não coincidem.");
    event.preventDefault();
    return;
  }

  // Validação de login simples
  if (login.length < 6 || !/^[A-Za-z]+$/.test(login)) {
    alert("Digite um login válido.");
    event.preventDefault();
    return;
  }

  // Caso a senha e o login estejam errados, exibe mensagem de erro
  if (
    (login.length < 6 || !/^[A-Za-z]+$/.test(login)) && 
    (password.length < 8 || !/^[A-Za-z]+$/.test(password))
   ) {
    alert("Senha e Login inválidos.");
    event.preventDefault();
    return;
  }

  // Validação de CPF simples (apenas tamanho)
  if (cpf.length < 11) {
    alert("Digite um CPF válido.");
    event.preventDefault();
    return;
  }

  // Se tudo estiver ok, pode salvar normalmente
  salvar_tudo();

  window.location.href = "login.html"; // Redireciona para a página de login
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

/*
======================================
API ViaCEP para preencher endereço automaticamente
====================================== */
function buscarCep() {
    const cep = document.getElementById('address').value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('endereco').value =
                    `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`;
            } else {
                document.getElementById('endereco').value = '';
            }
        })
        .catch(() => {
            document.getElementById('endereco').value = '';
        });
}

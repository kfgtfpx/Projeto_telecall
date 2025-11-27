// cadastro1.js

/* =====================================================================
                        Autor original: Juan e Carolina
                        Modificações por: Pamela e Renan
                        Ajustes finais: GPT
=====================================================================*/

console.log("CADASTRO.JS CARREGOU!");

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
        console.log("Nível da fonte:", fontSizeLevel);
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

    // Aplicar tamanho salvo
    applyFontSize();
}

/* ========================================
   Scroll Animation
   ======================================== */

function initializeScrollReveal() {
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal("#h1", {
            origin: "bottom",
            duration: 500,
            distance: "50px",
            easing: "ease",
            delay: 400,
            reset: true,
        });

        ScrollReveal().reveal(".title span", {
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
    }
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
   VALIDAÇÕES ESPECÍFICAS
   ======================================== */

// 2. Validação do Nome (15-80 caracteres alfabéticos)
function validarNome(nome) {
    if (nome.length < 15 || nome.length > 80) {
        return "O nome deve ter entre 15 e 80 caracteres.";
    }
    
    // Verifica se contém apenas letras e espaços
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        return "O nome deve conter apenas caracteres alfabéticos.";
    }
    
    return null;
}

// 3. Validação do CPF com Dígito Verificador
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) {
        return "CPF deve conter 11 dígitos.";
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        return "CPF inválido.";
    }
    
    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (digito1 !== parseInt(cpf.charAt(9))) {
        return "CPF inválido.";
    }
    
    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    if (digito2 !== parseInt(cpf.charAt(10))) {
        return "CPF inválido.";
    }
    
    return null;
}

// 4. Validação e busca do CEP
async function buscarCEP(cep) {
    try {
        const cepRaw = cep.replace(/\D/g, "");
        if (cepRaw.length !== 8) return null;

        const res = await fetch(`https://viacep.com.br/ws/${cepRaw}/json/`);
        const data = await res.json();
        
        if (!data || data.erro) return null;
        
        return data;
    } catch (err) {
        console.error("Erro ao buscar CEP:", err);
        return null;
    }
}

// 5. Validação do Telefone Celular
function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    if (telefoneLimpo.length !== 11 && telefoneLimpo.length !== 10) {
        return "Telefone deve ter 10 ou 11 dígitos (com DDD).";
    }
    
    // Formata para (+55)XX-XXXXXXXX
    const ddd = telefoneLimpo.substring(0, 2);
    const numero = telefoneLimpo.substring(2);
    
    if (numero.length === 8) {
        return `(+55)${ddd}-${numero.substring(0,4)}-${numero.substring(4)}`;
    } else {
        return `(+55)${ddd}-${numero.substring(0,5)}-${numero.substring(5)}`;
    }
}

// 6. Validação do Login (6 caracteres alfabéticos)
function validarLogin(login) {
    if (login.length !== 6) {
        return "O login deve ter exatamente 6 caracteres.";
    }
    
    if (!/^[A-Za-z]+$/.test(login)) {
        return "O login deve conter apenas caracteres alfabéticos.";
    }
    
    return null;
}

// 7. Validação da Senha (8 caracteres alfabéticos)
function validarSenha(senha) {
    if (senha.length !== 8) {
        return "A senha deve ter exatamente 8 caracteres.";
    }
    
    if (!/^[A-Za-z]+$/.test(senha)) {
        return "A senha deve conter apenas caracteres alfabéticos.";
    }
    
    return null;
}

/* ========================================
   MÁSCARAS: CPF, CEP, TELEFONE
   ======================================== */

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
   VALIDAÇÕES E ENVIO DO FORMULÁRIO
   ======================================== */

function initializeForm() {
    const form = document.getElementById("form");
    const inputCPF = document.getElementById("cpf");
    const inputCEP = document.getElementById("cep");
    const inputNumber = document.getElementById("number");
    const inputEndereco = document.getElementById("endereco");
    const inputNome = document.getElementById("name");
    const inputLogin = document.getElementById("login");
    const inputSenha = document.getElementById("password");
    const inputConfirmSenha = document.getElementById("confirmpassword");

    // Aplicar máscaras
    if (inputCPF) {
        inputCPF.addEventListener("input", e => {
            e.target.value = maskCPF(e.target.value);
        });
    }

    if (inputCEP) {
        inputCEP.addEventListener("input", e => {
            e.target.value = maskCEP(e.target.value);
        });

        // Buscar CEP ao sair do campo
        inputCEP.addEventListener("blur", async function () {
            const cepValue = this.value;
            if (!cepValue) return;

            showToast("Buscando CEP...", "success");
            
            try {
                const data = await buscarCEP(cepValue);
                if (data && inputEndereco) {
                    const parts = [
                        data.logradouro || "",
                        data.bairro || "",
                        data.localidade || "",
                        data.uf || ""
                    ].filter(Boolean);
                    inputEndereco.value = parts.join(", ");
                    showToast("Endereço preenchido automaticamente!", "success");
                } else {
                    showToast("CEP não encontrado. Preencha o endereço manualmente.", "error");
                }
            } catch (error) {
                showToast("Erro ao buscar CEP. Preencha o endereço manualmente.", "error");
            }
        });
    }

    if (inputNumber) {
        inputNumber.addEventListener("input", e => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    // Validação em tempo real
    if (inputNome) {
        inputNome.addEventListener("blur", function() {
            const erro = validarNome(this.value.trim());
            if (erro) {
                showToast(erro, "error");
                this.focus();
            }
        });
    }

    if (inputCPF) {
        inputCPF.addEventListener("blur", function() {
            const erro = validarCPF(this.value);
            if (erro) {
                showToast(erro, "error");
                this.focus();
            }
        });
    }

    if (inputLogin) {
        inputLogin.addEventListener("blur", function() {
            const erro = validarLogin(this.value.trim());
            if (erro) {
                showToast(erro, "error");
                this.focus();
            }
        });
    }

    if (inputSenha) {
        inputSenha.addEventListener("blur", function() {
            const erro = validarSenha(this.value);
            if (erro) {
                showToast(erro, "error");
                this.focus();
            }
        });
    }

    // Validação completa do formulário
    function validateForm() {
        const name = document.getElementById("name")?.value.trim() || "";
        const mother = document.getElementById("mothername")?.value.trim() || "";
        const login = document.getElementById("login")?.value.trim() || "";
        const date = document.getElementById("data")?.value || "";
        const gender = document.getElementById("gender")?.value || "";
        const cpf = document.getElementById("cpf")?.value || "";
        const cep = document.getElementById("cep")?.value || "";
        const endereco = document.getElementById("endereco")?.value.trim() || "";
        const number = document.getElementById("number")?.value || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const password = document.getElementById("password")?.value || "";
        const confirm = document.getElementById("confirmpassword")?.value || "";

        // 1. Campos obrigatórios
        const camposObrigatorios = [
            { campo: name, nome: "Nome completo" },
            { campo: mother, nome: "Nome materno" },
            { campo: login, nome: "Login" },
            { campo: date, nome: "Data de Nascimento" },
            { campo: gender, nome: "Sexo" },
            { campo: cpf, nome: "CPF" },
            { campo: number, nome: "Telefone Celular" },
            { campo: endereco, nome: "Endereço Completo" },
            { campo: password, nome: "Senha" },
            { campo: confirm, nome: "Confirmação da Senha" }
        ];

        const campoVazio = camposObrigatorios.find(item => !item.campo);
        if (campoVazio) {
            showToast(`Por favor, preencha o campo: ${campoVazio.nome}`, "error");
            return false;
        }

        // 2. Validação do Nome
        const erroNome = validarNome(name);
        if (erroNome) {
            showToast(erroNome, "error");
            document.getElementById("name").focus();
            return false;
        }

        // 3. Validação do CPF
        const erroCPF = validarCPF(cpf);
        if (erroCPF) {
            showToast(erroCPF, "error");
            document.getElementById("cpf").focus();
            return false;
        }

        // 4. Validação do CEP
        if (cep && cep.replace(/\D/g, "").length !== 8) {
            showToast("CEP inválido. Digite 8 dígitos.", "error");
            document.getElementById("cep").focus();
            return false;
        }

        // 5. Validação do Telefone
        const telefoneFormatado = validarTelefone(number);
        if (typeof telefoneFormatado === 'string' && telefoneFormatado.includes("deve ter")) {
            showToast(telefoneFormatado, "error");
            document.getElementById("number").focus();
            return false;
        }

        // 6. Validação do Login
        const erroLogin = validarLogin(login);
        if (erroLogin) {
            showToast(erroLogin, "error");
            document.getElementById("login").focus();
            return false;
        }

        // 7. Validação da Senha
        const erroSenha = validarSenha(password);
        if (erroSenha) {
            showToast(erroSenha, "error");
            document.getElementById("password").focus();
            return false;
        }

        // 8. Confirmação de Senha
        if (password !== confirm) {
            showToast("As senhas não coincidem.", "error");
            document.getElementById("confirmpassword").focus();
            return false;
        }

        // Validação de email
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            showToast("E-mail inválido.", "error");
            document.getElementById("email").focus();
            return false;
        }

        return true;
    }

    // Envio do formulário
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (!validateForm()) return;

            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = "Cadastrando...";
            btnSubmit.disabled = true;

            try {
                const formData = new FormData(form);
                
                // Formata o telefone antes de enviar
                const telefoneFormatado = validarTelefone(document.getElementById("number").value);
                if (typeof telefoneFormatado === 'string' && !telefoneFormatado.includes("deve ter")) {
                    formData.set('number', telefoneFormatado);
                }
                
                const response = await fetch("backend/Cadastro.php", {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();
                
                if (result === "success") {
                    showToast("Cadastro realizado com sucesso! Redirecionando...", "success");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                } else {
                    showToast(result, "error");
                }
            } catch (error) {
                console.error("Erro:", error);
                showToast("Erro de conexão. Tente novamente.", "error");
            } finally {
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
            }
        });
    }

    // Botão voltar
    const botaoVoltar = document.querySelector('.login-button a');
    if (botaoVoltar) {
        botaoVoltar.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "home.html";
        });
    }
}

/* ========================================
   INICIALIZAÇÃO GERAL
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Carregado - Inicializando funcionalidades...");
    
    initializeDarkMode();
    initializeFontSize();
    initializeScrollReveal();
    initializeForm();
    initializeClearForm();
    
    console.log("Todas as funcionalidades inicializadas!");
});
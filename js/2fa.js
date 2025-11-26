document.addEventListener("DOMContentLoaded", () => {

    const perguntaEl = document.getElementById("pergunta-texto");
    const form = document.getElementById("form2fa");
    const respostaInput = document.getElementById("resposta");
    const mensagem = document.getElementById("mensagem");

    let tentativas = 0;

    const user_id = localStorage.getItem("user_id");
    const login = localStorage.getItem("usuarioLogado");

    if (!user_id || !login) {
        window.location.href = "login.html";
        return;
    }

    // Perguntas disponíveis
    const perguntas = [
        { texto: "Qual o nome da sua mãe?", chave: "mae" },
        { texto: "Qual a data do seu nascimento?", chave: "nascimento" },
        { texto: "Qual o CEP do seu endereço?", chave: "cep" }
    ];

    const perguntaEscolhida = perguntas[Math.floor(Math.random() * perguntas.length)];
    perguntaEl.textContent = perguntaEscolhida.texto;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const resposta = respostaInput.value.trim();
        if (!resposta) {
            mensagem.innerHTML = `<div class="alert alert-danger">Preencha a resposta.</div>`;
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("login", login);
        formData.append("resposta", resposta);
        formData.append("pergunta", perguntaEscolhida.chave);

        fetch("backend/2FA.php", {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(data => {

            if (data.status === "ok") {
                mensagem.innerHTML = `<div class="alert alert-success">${data.msg}</div>`;
                setTimeout(() => {
                    window.location.href = "home-logado.html";
                }, 1500);
            }

            else if (data.status === "erro") {
                tentativas++;

                if (tentativas >= 3) {
                    mensagem.innerHTML = `<div class="alert alert-danger">3 tentativas sem sucesso! Realize login novamente.</div>`;
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.href = "login.html";
                    }, 2500);
                } else {
                    mensagem.innerHTML = `<div class="alert alert-warning">${data.msg}</div>`;
                    respostaInput.value = "";
                    respostaInput.focus();
                }
            }
        })
        .catch(err => {
            mensagem.innerHTML = `<div class="alert alert-danger">Erro de conexão.</div>`;
            console.error(err);
        });
    });
});

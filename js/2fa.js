/* ============================================================
   Verificação de Duas Etapas (2FA)
   Autor: Renan + integração para pré-projeto
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const perguntaEl = document.querySelector(".pergunta-texto");
  const form = document.getElementById("form2fa");
  const respostaInput = document.getElementById("resposta");
  const mensagem = document.getElementById("mensagem");

  let tentativas = 0;

  // Simulação de dados cadastrados (substitui banco de dados)
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const dadosUsuario = JSON.parse(localStorage.getItem(usuarioLogado)) || {
    mae: "Maria da Silva",
    nascimento: "2000-05-15",
    cep: "12345-678"
  };

  // Gera pergunta aleatória
  const perguntas = [
    { texto: "Digite o nome de sua mãe", chave: "mae" },
    { texto: "Digite a data do seu nascimento", chave: "nascimento" },
    { texto: "Digite o CEP do seu endereço", chave: "cep" }
  ];
  const perguntaEscolhida = perguntas[Math.floor(Math.random() * perguntas.length)];
  perguntaEl.textContent = perguntaEscolhida.texto;

  // Submissão do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const resposta = respostaInput.value.trim();

    // Validação 1 – campo obrigatório
    if (!resposta) {
      mensagem.innerHTML = `<div class="alert alert-danger">Por favor, preencha a resposta.</div>`;
      return;
    }

    // Verificação de resposta
    const respostaCerta = String(dadosUsuario[perguntaEscolhida.chave]).trim().toLowerCase();
    const respostaUser = resposta.toLowerCase();

    if (respostaUser === respostaCerta) {
      mensagem.innerHTML = `<div class="alert alert-success">Verificação concluída com sucesso! Redirecionando...</div>`;
      setTimeout(() => {
        window.location.href = "../home-logado.html";
      }, 1500);
    } else {
      tentativas++;
      if (tentativas >= 3) {
        mensagem.innerHTML = `<div class="alert alert-danger">3 tentativas sem sucesso! Favor realizar login novamente.</div>`;
        setTimeout(() => {
          window.location.href = "../login.html";
        }, 2500);
      } else {
        mensagem.innerHTML = `<div class="alert alert-warning">Resposta incorreta. Tentativa ${tentativas} de 3.</div>`;
        respostaInput.value = "";
        respostaInput.focus();
      }
    }
  });
});
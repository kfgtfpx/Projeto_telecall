document.getElementById("form-alterar-senha").addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha_atual = document.getElementById("senha_atual").value;
    const nova_senha = document.getElementById("nova_senha").value;
    const confirmar_senha = document.getElementById("confirmar_senha").value;

    const msg = document.getElementById("msg");

    // Verifica se as senhas coincidem
    if (nova_senha !== confirmar_senha) {
        msg.textContent = "As senhas não coincidem!";
        return;
    }

    // Verifica se a nova senha é diferente da atual
    if (senha_atual === nova_senha) {
        msg.textContent = "A nova senha deve ser diferente da senha atual!";
        return;
    }

    // Obtém o ID do usuário armazenado no localStorage
    const user_id = localStorage.getItem("usuario_id");

    if (!user_id) {
        msg.textContent = "Usuário não identificado. Faça login novamente.";
        return;
    }

    try {
        // Envia os dados para o PHP
        const resposta = await fetch("../backend/alterar_senha.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id_usuario: user_id,
                senha_atual: senha_atual,
                nova_senha: nova_senha
            })
        });

        const data = await resposta.json();

        // Exibe mensagens de sucesso ou erro
        if (data.status === "success") {
            msg.style.color = "green";
            msg.textContent = "Senha alterada com sucesso! Redirecionando para login...";
            
            setTimeout(() => {
                // Limpa todos os dados de sessão do localStorage
                localStorage.removeItem("usuario_id");
                localStorage.removeItem("usuario_nome");
                // Redireciona para a tela de login
                window.location.href = "login.html";
            }, 2000);
        } else {
            msg.style.color = "red";
            msg.textContent = data.message;
        }
    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Erro de conexão. Tente novamente.";
        console.error("Erro:", error);
    }
});

// Função para o botão "Voltar para Home" - CORRIGIDA
document.getElementById("voltar-home").addEventListener("click", () => {
    // Verifica se o usuário ainda está logado
    const user_id = localStorage.getItem("usuario_id");
    if (user_id) {
        window.location.href = "home-logado.html";
    } else {
        window.location.href = "login.html";
    }
});
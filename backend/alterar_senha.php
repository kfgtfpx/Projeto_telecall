<?php
include("conexao.php");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Método inválido."]);
    exit();
}

// Recebe os dados do POST
$login = $_POST["login"] ?? "";
$senha_atual = $_POST["senha_atual"] ?? "";
$nova_senha = $_POST["nova_senha"] ?? "";

// Log para debug
error_log("ALTERAR_SENHA - Tentativa para login: " . $login);

// Validações
if (empty($login) || empty($senha_atual) || empty($nova_senha)) {
    echo json_encode(["status" => "error", "message" => "Todos os campos são obrigatórios."]);
    exit();
}

// Valida o login (máximo 6 caracteres conforme sua tabela)
if (strlen($login) > 6) {
    echo json_encode(["status" => "error", "message" => "Login deve ter no máximo 6 caracteres."]);
    exit();
}

if (strlen($nova_senha) < 4) {
    echo json_encode(["status" => "error", "message" => "A nova senha deve ter pelo menos 4 caracteres."]);
    exit();
}

try {
    // Buscar usuário no banco pelo login
    $sql = "SELECT id_usuario, senha FROM usuarios WHERE login = ?";
    $stmt = $conexao->prepare($sql);
    
    if (!$stmt->execute([$login])) {
        throw new Exception("Erro na consulta do usuário");
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        error_log("ALTERAR_SENHA - Login não encontrado: " . $login);
        echo json_encode(["status" => "error", "message" => "Login não encontrado."]);
        exit();
    }

    error_log("ALTERAR_SENHA - Usuário encontrado. ID: " . $user["id_usuario"]);

    // Verificar se a senha atual está correta
    if (!password_verify($senha_atual, $user["senha"])) {
        error_log("ALTERAR_SENHA - Senha atual incorreta para login: " . $login);
        echo json_encode(["status" => "error", "message" => "Senha atual incorreta."]);
        exit();
    }

    // Atualizar a senha
    $nova_senha_hash = password_hash($nova_senha, PASSWORD_DEFAULT);
    $sql_update = "UPDATE usuarios SET senha = ? WHERE id_usuario = ?";
    $stmt_update = $conexao->prepare($sql_update);
    
    if ($stmt_update->execute([$nova_senha_hash, $user["id_usuario"]])) {
        error_log("ALTERAR_SENHA - Senha alterada com sucesso para login: " . $login);
        echo json_encode(["status" => "success", "message" => "Senha alterada com sucesso!"]);
    } else {
        $errorInfo = $stmt_update->errorInfo();
        error_log("ALTERAR_SENHA - Erro ao atualizar: " . $errorInfo[2]);
        echo json_encode(["status" => "error", "message" => "Erro ao atualizar senha."]);
    }

} catch (PDOException $e) {
    error_log("ALTERAR_SENHA - Erro PDO: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Erro no banco de dados: " . $e->getMessage()]);
} catch (Exception $e) {
    error_log("ALTERAR_SENHA - Erro Geral: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Erro no servidor."]);
}
?>
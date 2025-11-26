<?php
include("conexao.php");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Método inválido."]);
    exit();
}

$id_usuario = $_POST["id_usuario"] ?? null;
$senha_atual = $_POST["senha_atual"] ?? "";
$nova_senha = $_POST["nova_senha"] ?? "";

// Validações
if (!$id_usuario) {
    echo json_encode(["status" => "error", "message" => "Usuário não identificado."]);
    exit();
}

if (empty($senha_atual) || empty($nova_senha)) {
    echo json_encode(["status" => "error", "message" => "Todos os campos são obrigatórios."]);
    exit();
}

if (strlen($nova_senha) < 4) {
    echo json_encode(["status" => "error", "message" => "A nova senha deve ter pelo menos 4 caracteres."]);
    exit();
}

try {
    // Buscar senha atual no banco de dados
    $sql = "SELECT senha FROM usuarios WHERE id_usuario = :id";
    $stmt = $conexao->prepare($sql);
    $stmt->bindParam(":id", $id_usuario, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "Usuário não encontrado."]);
        exit();
    }

    // Verificar se a senha atual está correta
    if (!password_verify($senha_atual, $user["senha"])) {
        echo json_encode(["status" => "error", "message" => "Senha atual incorreta."]);
        exit();
    }

    // Atualizar a senha no banco de dados
    $nova_hash = password_hash($nova_senha, PASSWORD_DEFAULT);

    $update = $conexao->prepare("
        UPDATE usuarios SET senha = :nova WHERE id_usuario = :id
    ");
    $update->bindParam(":nova", $nova_hash, PDO::PARAM_STR);
    $update->bindParam(":id", $id_usuario, PDO::PARAM_INT);

    if ($update->execute()) {
        echo json_encode(["status" => "success", "message" => "Senha alterada com sucesso!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erro ao atualizar senha."]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
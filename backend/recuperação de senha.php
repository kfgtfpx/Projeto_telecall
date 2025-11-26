<?php
session_start();
include 'conexao.php'; // provides PDO $conexao

// verifica se o usuário está logado
if (!isset($_SESSION['id_usuario'])) {
    header("Location: login.php");
    exit();
}

$id = (int) $_SESSION['id_usuario'];

$senha_atual = $_POST['senha_atual'] ?? '';
$nova_senha = $_POST['nova_senha'] ?? '';
$confirmar_senha = $_POST['confirmar_senha'] ?? '';

// 1. confirmar se nova senha = confirmar senha
if ($nova_senha !== $confirmar_senha) {
    echo "As senhas novas não coincidem!";
    exit();
}

if (strlen($nova_senha) < 8) {
    echo "A nova senha deve ter pelo menos 8 caracteres.";
    exit();
}

try {
    // 2. pegar senha atual do banco
    $sql = "SELECT senha FROM usuarios WHERE id_usuario = :id";
    $stmt = $conexao->prepare($sql);
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    if (!$row) {
        echo "Usuário não encontrado.";
        exit();
    }

    $senha_banco = $row['senha'];

    // 3. verificar se senha atual está correta
    if (!password_verify($senha_atual, $senha_banco)) {
        echo "Senha atual incorreta!";
        exit();
    }

    // 4. atualizar nova senha (hash)
    $nova_senha_hash = password_hash($nova_senha, PASSWORD_DEFAULT);
    $sql_update = "UPDATE usuarios SET senha = :senha WHERE id_usuario = :id";
    $stmt2 = $conexao->prepare($sql_update);

    if ($stmt2->execute(['senha' => $nova_senha_hash, 'id' => $id])) {
        echo "Senha alterada com sucesso!";
    } else {
        echo "Erro ao atualizar senha.";
    }
} catch (PDOException $e) {
    error_log('Recuperação de senha error: ' . $e->getMessage());
    echo "Erro no servidor. Tente novamente mais tarde.";
}
?>
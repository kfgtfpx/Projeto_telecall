<?php
include("conexao.php");
$login_digitado = $_POST["login"];
$senha_digitada = $_POST["password"];

$sql = "SELECT id, senha FROM usuarios WHERE login = :login";

$stmt = $conexao->prepare($sql);
    $stmt->execute(['login' -> $login_digitado]);
    $user_data = $stmt->fetch();
    if ($user_data) {
        $senha_hash_do_banco = $user_data['senha'];
        if (password_verify($senha_digitada, $senha_hash_do_banco)) {
            echo "Login bem-sucedido! ID do Usuário: " . $user_data['id'];
        } else {
            echo "Login ou senha incorretos.";
        }
    } else {
        echo "Login ou senha incorretos.";
    }
?>
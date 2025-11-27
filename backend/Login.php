<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
    exit();
}

// Recebe os dados
$login_digitado = $_POST['login'] ?? '';
$senha_digitada = $_POST['senha'] ?? '';

if (empty($login_digitado) || empty($senha_digitada)) {
    echo json_encode(['status' => 'error', 'message' => 'Preencha login e senha.']);
    exit();
}

include "conexao.php";

try {
    $sql = "SELECT id_usuario, senha, perfil_id, nome_completo FROM usuarios WHERE login = :login LIMIT 1";
    $stmt = $conexao->prepare($sql);
    $stmt->bindParam(':login', $login_digitado);
    $stmt->execute();
    $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user_data) {
        if (password_verify($senha_digitada, $user_data['senha'])) {
            // Login bem-sucedido
            include "registrar_log.php";
            registrarLog($user_data['id_usuario'], 'login_sucesso');
            
            $_SESSION['usuario_id'] = $user_data['id_usuario'];
            $_SESSION['usuario_login'] = $login_digitado;
            $_SESSION['perfil_id'] = $user_data['perfil_id'];

            echo json_encode([
                'status' => 'success',
                'message' => 'Login realizado com sucesso!',
                'redirect' => '2fa.html',
                'user_id' => $user_data['id_usuario'],
                'perfil_id' => $user_data['perfil_id']
            ]);
            
        } else {
            // Senha incorreta
            include "registrar_log.php";
            registrarLog($user_data['id_usuario'], 'login_erro');
            
            echo json_encode(['status' => 'error', 'message' => 'Login ou senha incorretos.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não cadastrado.']);
    }
    
} catch (PDOException $e) {
    error_log("Erro PDO Login: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor.']);
}
?>
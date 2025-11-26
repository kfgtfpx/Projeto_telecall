<?php
include("conexao.php");

// Adicionar header JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
    exit();
}

// Recebe os dados do formulário
$login_digitado = isset($_POST['login']) ? trim($_POST['login']) : '';
$senha_digitada = isset($_POST['senha']) ? $_POST['senha'] : '';

// Verifica se os campos foram preenchidos
if (empty($login_digitado) || empty($senha_digitada)) {
    echo json_encode(['status' => 'error', 'message' => 'Preencha login e senha.']);
    exit();
}

try {
    // Consulta o banco de dados
    $sql = "SELECT id_usuario, senha, perfil_id, nome_materno, data_nascimento, cep FROM usuarios WHERE login = :login LIMIT 1";
    $stmt = $conexao->prepare($sql);
    $stmt->bindParam(':login', $login_digitado, PDO::PARAM_STR);
    $stmt->execute();
    $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user_data && isset($user_data['senha'])) {
        if (password_verify($senha_digitada, $user_data['senha'])) {
            // Login bem-sucedido
            session_start();
            $_SESSION['usuario_id'] = $user_data['id_usuario'];
            $_SESSION['usuario_login'] = $login_digitado;

            echo json_encode([
                'status' => 'success',
                'message' => 'Login realizado com sucesso!',
                'redirect' => '2fa.html',
                'user_id' => $user_data['id_usuario'],
                'perfil_id' => $user_data['perfil_id']
            ]);
            exit();
        } else {
            // Senha incorreta
            echo json_encode(['status' => 'error', 'message' => 'Login ou senha incorretos.']);
            exit();
        }
    } else {
        // Usuário não encontrado
        echo json_encode(['status' => 'error', 'message' => 'Usuário não cadastrado.']);
        exit();
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro no servidor. Tente novamente mais tarde.']);
    exit();
}
?>

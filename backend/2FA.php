<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "erro", "msg" => "Método inválido"]);
    exit();
}

// Verificar sessão
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["status" => "erro", "msg" => "Sessão expirada"]);
    exit();
}

$user_id = $_SESSION['usuario_id'];
$resposta = trim($_POST["resposta"] ?? '');
$pergunta = $_POST["pergunta"] ?? '';

if (empty($resposta)) {
    echo json_encode(["status" => "erro", "msg" => "Digite a resposta"]);
    exit();
}

include "conexao.php";

try {
    $sql = "SELECT nome_materno, data_nascimento, cep FROM usuarios WHERE id_usuario = :id";
    $stmt = $conexao->prepare($sql);
    $stmt->bindParam(":id", $user_id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(["status" => "erro", "msg" => "Usuário não encontrado"]);
        exit();
    }

    $dados = $stmt->fetch(PDO::FETCH_ASSOC);
    $resposta_correta = "";
    $pergunta_texto = "";

    if ($pergunta === "mae") {
        $resposta_correta = $dados["nome_materno"];
        $pergunta_texto = "nome_materno";
    } elseif ($pergunta === "nascimento") {
        $resposta_correta = $dados["data_nascimento"];
        $pergunta_texto = "data_nascimento";
    } elseif ($pergunta === "cep") {
        $resposta_correta = $dados["cep"];
        $pergunta_texto = "cep";
    } else {
        echo json_encode(["status" => "erro", "msg" => "Pergunta inválida"]);
        exit();
    }

    // Incluir e usar a função de log
    include "registrar_log.php";

    if (strtolower(trim($resposta)) === strtolower(trim($resposta_correta))) {
        // Resposta correta
        registrarLog($user_id, '2fa_sucesso', $pergunta_texto);
        $_SESSION['2fa_verificado'] = true;
        
        echo json_encode(["status" => "ok", "msg" => "2FA aprovado!"]);
        
    } else {
        // Resposta incorreta
        registrarLog($user_id, '2fa_erro', $pergunta_texto);
        echo json_encode(["status" => "erro", "msg" => "Resposta incorreta"]);
    }

} catch (PDOException $e) {
    error_log("Erro PDO 2FA: " . $e->getMessage());
    echo json_encode(["status" => "erro", "msg" => "Erro no servidor"]);
}
?>
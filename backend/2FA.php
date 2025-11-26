<?php
header('Content-Type: application/json');

include "conexao.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "erro", "msg" => "Método inválido"]);
    exit();
}

$user_id  = $_POST["user_id"] ?? 0;
$login    = $_POST["login"] ?? '';
$resposta = trim($_POST["resposta"] ?? '');
$pergunta = $_POST["pergunta"] ?? '';

if ($user_id <= 0 || empty($login)) {
    echo json_encode(["status" => "erro", "msg" => "Usuário inválido"]);
    exit();
}

if (empty($resposta)) {
    echo json_encode(["status" => "erro", "msg" => "Digite a resposta"]);
    exit();
}

try {

    $sql = "SELECT nome_materno, data_nascimento, cep
            FROM usuarios
            WHERE id_usuario = :id AND login = :login
            LIMIT 1";

    $stmt = $conexao->prepare($sql);
    $stmt->bindParam(":id", $user_id, PDO::PARAM_INT);
    $stmt->bindParam(":login", $login, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(["status" => "erro", "msg" => "Usuário não encontrado"]);
        exit();
    }

    $dados = $stmt->fetch(PDO::FETCH_ASSOC);

    $resposta_correta = "";

    if ($pergunta === "mae") {
        $resposta_correta = $dados["nome_materno"];
    } elseif ($pergunta === "nascimento") {
        $resposta_correta = $dados["data_nascimento"];
    } elseif ($pergunta === "cep") {
        $resposta_correta = $dados["cep"];
    } else {
        echo json_encode(["status" => "erro", "msg" => "Pergunta inválida"]);
        exit();
    }

    if (strtolower(trim($resposta)) === strtolower(trim($resposta_correta))) {
        echo json_encode(["status" => "ok", "msg" => "2FA aprovado!"]);
        exit();
    } else {
        echo json_encode(["status" => "erro", "msg" => "Resposta incorreta"]);
        exit();
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "erro", "msg" => "Erro no servidor"]);
    exit();
}
?>

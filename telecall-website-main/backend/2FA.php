<?php
include("conexao.php");

// Mapeamento de perguntas para colunas no banco
$mapa_hash_db = [
    'mae' => 'nome_materno',
    'cep' => 'cep',
    'nascimento' => 'nascimento'
];

// Sanitize e valide entradas (assumindo que vêm de $_POST ou similar)
$pergunta_id = isset($_POST['pergunta_id']) ? trim($_POST['pergunta_id']) : '';
$resposta_digitada = isset($_POST['resposta_digitada']) ? trim($_POST['resposta_digitada']) : '';
$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;  // Exemplo: assumindo sessão; ajuste conforme necessário

// Verifica se os dados necessários foram recebidos e se o ID é válido
if (empty($pergunta_id) || empty($resposta_digitada) || $user_id <= 0 || !array_key_exists($pergunta_id, $mapa_hash_db)) {
    die("Erro: Dados de segurança incompletos ou ID de pergunta inválido.");
}

$coluna_hash = $mapa_hash_db[$pergunta_id];

try {
    // Use placeholders para tudo, incluindo a coluna (mais seguro)
    $sql = "SELECT :coluna AS hash FROM usuarios WHERE id = :id";
    
    $stmt = $conexao->prepare($sql);
    $stmt->execute(['coluna' => $coluna_hash, 'id' => $user_id]);
    $user_hashes = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_hashes) {
        die("Erro interno. Não foi possível carregar os dados de segurança do usuário.");
    }

    $hash_do_banco = $user_hashes['hash'];
    if (empty($hash_do_banco)) {
        die("Erro: Dados de segurança não configurados para esta pergunta.");
    }

    if (password_verify($resposta_digitada, $hash_do_banco)) {
        // Em produção, use redirecionamento em vez de echo
        header('Location: acesso_concedido.php');
        exit();
    } else {
        // Log tentativa falhada para auditoria
        error_log("Tentativa 2FA falhada para user_id: $user_id, pergunta: $pergunta_id");
        echo "Resposta de segurança incorreta. Tente novamente.";
    }
} catch (PDOException $e) {
    // Log erro sem expor detalhes
    error_log("Erro de banco em 2FA: " . $e->getMessage());
    die("Erro interno. Tente novamente mais tarde.");
}
?>

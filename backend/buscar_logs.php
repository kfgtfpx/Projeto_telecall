<?php
session_start();
header('Content-Type: application/json');

// Verificar se é usuário master
if (!isset($_SESSION['perfil_id']) || $_SESSION['perfil_id'] != 1) {
    echo json_encode(['status' => 'error', 'message' => 'Acesso não autorizado']);
    exit();
}

include "conexao.php";

try {
    $filtro_tipo = $_GET['filtro'] ?? 'all';
    $busca = $_GET['busca'] ?? '';
    
    $sql = "SELECT 
                l.id_log,
                l.data_hora,
                l.tipo,
                l.segundo_fator,
                l.ip,
                u.id_usuario,
                u.nome_completo,
                u.cpf,
                u.login,
                DATE_FORMAT(l.data_hora, '%d/%m/%Y %H:%i:%s') as data_formatada,
                CASE 
                    WHEN l.tipo = 'login_sucesso' THEN 'Login Bem-sucedido'
                    WHEN l.tipo = 'login_erro' THEN 'Login com Erro' 
                    WHEN l.tipo = '2fa_sucesso' THEN '2FA Aprovado'
                    WHEN l.tipo = '2fa_erro' THEN '2FA Reprovado'
                    WHEN l.tipo = 'logout' THEN 'Logout'
                    ELSE l.tipo
                END as tipo_formatado,
                CASE 
                    WHEN l.segundo_fator = 'nome_materno' THEN 'Nome da Mãe'
                    WHEN l.segundo_fator = 'data_nascimento' THEN 'Data de Nascimento'
                    WHEN l.segundo_fator = 'cep' THEN 'CEP'
                    ELSE l.segundo_fator
                END as fator_formatado
            FROM logs_autenticacao l
            INNER JOIN usuarios u ON l.usuario_id = u.id_usuario
            WHERE 1=1";
    
    $params = [];
    
    // Aplicar filtros
    if ($filtro_tipo === 'nome' && !empty($busca)) {
        $sql .= " AND u.nome_completo LIKE :busca";
        $params[':busca'] = "%$busca%";
    } elseif ($filtro_tipo === 'cpf' && !empty($busca)) {
        $sql .= " AND u.cpf LIKE :busca";
        $params[':busca'] = "%$busca%";
    } elseif ($filtro_tipo === 'login' && !empty($busca)) {
        $sql .= " AND u.login LIKE :busca";
        $params[':busca'] = "%$busca%";
    }
    
    $sql .= " ORDER BY l.data_hora DESC";
    
    $stmt = $conexao->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'logs' => $logs
    ]);
    
} catch (PDOException $e) {
    error_log("Erro ao buscar logs: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erro ao carregar logs']);
}
?>
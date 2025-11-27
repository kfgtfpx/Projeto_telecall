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
    $busca = $_GET['busca'] ?? '';
    
    $sql = "SELECT 
                u.id_usuario,
                u.nome_completo,
                u.login,
                u.email,
                u.cpf,
                u.data_nascimento,
                u.telefone,
                u.perfil_id,
                p.nome_perfil
            FROM usuarios u
            INNER JOIN perfis p ON u.perfil_id = p.id_perfil
            WHERE 1=1";
    
    $params = [];
    
    // Aplicar filtro de busca por nome
    if (!empty($busca)) {
        $sql .= " AND u.nome_completo LIKE :busca";
        $params[':busca'] = "%$busca%";
    }
    
    $sql .= " ORDER BY u.nome_completo ASC";
    
    $stmt = $conexao->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'usuarios' => $usuarios
    ]);
    
} catch (PDOException $e) {
    error_log("Erro ao buscar usuários: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erro ao carregar usuários']);
}
?>
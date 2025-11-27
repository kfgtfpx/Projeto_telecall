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
    // Ler dados do JSON
    $input = json_decode(file_get_contents('php://input'), true);
    $usuario_id = $input['usuario_id'] ?? null;
    
    if (!$usuario_id) {
        echo json_encode(['status' => 'error', 'message' => 'ID do usuário não informado']);
        exit();
    }
    
    // Verificar se o usuário existe
    $sql_check = "SELECT id_usuario, nome_completo, perfil_id FROM usuarios WHERE id_usuario = :id";
    $stmt_check = $conexao->prepare($sql_check);
    $stmt_check->bindParam(':id', $usuario_id, PDO::PARAM_INT);
    $stmt_check->execute();
    $usuario = $stmt_check->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario) {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado']);
        exit();
    }
    
    // Não permitir excluir usuários master
    if ($usuario['perfil_id'] == 1) {
        echo json_encode(['status' => 'error', 'message' => 'Não é permitido excluir usuários master']);
        exit();
    }
    
    // Iniciar transação
    $conexao->beginTransaction();
    
    try {
        // 1. Primeiro excluir da tabela logs_autenticacao
        $sql_delete_logs = "DELETE FROM logs_autenticacao WHERE usuario_id = :id";
        $stmt_logs = $conexao->prepare($sql_delete_logs);
        $stmt_logs->bindParam(':id', $usuario_id, PDO::PARAM_INT);
        $stmt_logs->execute();
        
        // 2. Excluir da tabela autenticacao_2fa
        $sql_delete_2fa = "DELETE FROM autenticacao_2fa WHERE usuario_id = :id";
        $stmt_2fa = $conexao->prepare($sql_delete_2fa);
        $stmt_2fa->bindParam(':id', $usuario_id, PDO::PARAM_INT);
        $stmt_2fa->execute();
        
        // 3. Excluir da tabela agenda (se existir)
        try {
            $sql_delete_agenda = "DELETE FROM agenda WHERE usuario_id = :id";
            $stmt_agenda = $conexao->prepare($sql_delete_agenda);
            $stmt_agenda->bindParam(':id', $usuario_id, PDO::PARAM_INT);
            $stmt_agenda->execute();
        } catch (Exception $e) {
            // Tabela agenda pode não existir, continuar
            error_log("Aviso: Tabela agenda não encontrada ou sem dados: " . $e->getMessage());
        }
        
        // 4. Finalmente excluir o usuário
        $sql_delete_user = "DELETE FROM usuarios WHERE id_usuario = :id";
        $stmt_user = $conexao->prepare($sql_delete_user);
        $stmt_user->bindParam(':id', $usuario_id, PDO::PARAM_INT);
        $stmt_user->execute();
        
        $conexao->commit();
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Usuário "' . $usuario['nome_completo'] . '" excluído com sucesso!'
        ]);
        
    } catch (Exception $e) {
        $conexao->rollBack();
        throw $e;
    }
    
} catch (PDOException $e) {
    error_log("Erro PDO ao excluir usuário ID $usuario_id: " . $e->getMessage());
    
    // Verificar se é erro de constraint
    if (strpos($e->getMessage(), 'foreign key constraint') !== false) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Não foi possível excluir o usuário. Existem registros vinculados a este usuário em outras tabelas.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Erro no banco de dados: ' . $e->getMessage()
        ]);
    }
} catch (Exception $e) {
    error_log("Erro geral ao excluir usuário: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erro interno do servidor']);
}
?>
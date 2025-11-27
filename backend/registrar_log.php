<?php
function registrarLog($usuario_id, $tipo, $segundo_fator = null) {
    // Incluir a conexão
    include "conexao.php";
    
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Desconhecido';
        $navegador = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconhecido';
        
        $sql = "INSERT INTO logs_autenticacao (usuario_id, tipo, segundo_fator, ip, navegador) 
                VALUES (:usuario_id, :tipo, :segundo_fator, :ip, :navegador)";
        
        $stmt = $conexao->prepare($sql);
        $stmt->bindParam(':usuario_id', $usuario_id, PDO::PARAM_INT);
        $stmt->bindParam(':tipo', $tipo, PDO::PARAM_STR);
        $stmt->bindParam(':segundo_fator', $segundo_fator);
        $stmt->bindParam(':ip', $ip, PDO::PARAM_STR);
        $stmt->bindParam(':navegador', $navegador, PDO::PARAM_STR);
        
        $result = $stmt->execute();
        
        if (!$result) {
            error_log("Falha ao executar INSERT no log");
            return false;
        }
        
        return true;
        
    } catch (PDOException $e) {
        error_log("Erro ao registrar log: " . $e->getMessage());
        return false;
    }
}
?>
<?php
// PDO connection shared by scripts
$host = 'localhost';
$db   = 'sistema_site';
$user = 'root';
$pass = '';
$dsn  = "mysql:host={$host};dbname={$db};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $conexao = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log('DB connection error: ' . $e->getMessage());
    // Stop execution with a generic message to avoid leaking details
    die('Erro na conexão com o banco de dados.');
}

?>

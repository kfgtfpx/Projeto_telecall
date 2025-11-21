php
<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "seu_banco";

try {
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Erro ao conectar: " . $conn->connect_error);
    }

    // Valida e sanitiza a pesquisa
    $pesquisa = isset($_GET['q']) ? trim($_GET['q']) : "";
    
    $sql = "SELECT id, nome, email FROM usuarios";
    $params = [];
    $types = "";

    if ($pesquisa !== "") {
        // Previne SQL Injection usando prepared statements
        $sql .= " WHERE nome LIKE ? OR email LIKE ?";
        $termo_pesquisa = "%" . $pesquisa . "%";
        $params = [$termo_pesquisa, $termo_pesquisa];
        $types = "ss";
    }

    $stmt = $conn->prepare($sql);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();

    $usuarios = [];
    if ($result && $result->num_rows > 0) {
        while ($linha = $result->fetch_assoc()) {
            $usuarios[] = $linha;
        }
    }

    echo json_encode($usuarios);
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro interno do servidor"]);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
<?php
include "conexao.php";

$busca = "";
$temBusca = false;

// verifica se o parâmetro existe e não está vazio
if (isset($_GET['busca']) && trim($_GET['busca']) !== "") {
    $busca = trim($_GET['busca']);
    $temBusca = true;
}

$sql = "SELECT 
            u.id_usuario AS id,
            u.nome_completo,
            u.email,
            p.nome_perfil
        FROM usuarios u
        INNER JOIN perfis p ON u.perfil_id = p.id_perfil";

if ($temBusca) {
    $sql .= " WHERE 
                u.nome_completo LIKE :b
                OR u.email LIKE :b
                OR u.login LIKE :b";
}

$stmt = $conexao->prepare($sql);

if ($temBusca) {
    $stmt->bindValue(":b", "%$busca%");
}

$stmt->execute();
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

// saída para o HTML
foreach ($usuarios as $u) {
    echo "<tr>";
    echo "<td>{$u['id']}</td>";
    echo "<td>{$u['nome_completo']}</td>";
    echo "<td>{$u['email']}</td>";
    echo "<td>{$u['nome_perfil']}</td>";
    echo "</tr>";
}
?>
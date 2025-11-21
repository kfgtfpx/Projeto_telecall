<?php
include("conexao.php");
$nome = $_POST["name"];
$login = $_POST["login"];
$nomemae = $_POST["mothername"];
$email = $_POST["email"];
$data = $_POST["data"];
$sexo = $_POST["select"];
$cpf = $_POST["cpf"];
$cep = $_POST["address"];
$endereco = $_POST["endereco"];
$cel = $_POST["cel"];
$senha = $_POST["password"];

$sql = "INSERT INTO usuarios (name, login, mothername, email, data, select, cpf, address, endereco, cel, password)
VALUES(?,?,?,?,?,?,?,?,?,?,?)";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("ssssisissis", $nome, $login, $nomemae, $email, $data, $sexo, $cpf, $cep, $endereco ,$cel ,$senha);
?>
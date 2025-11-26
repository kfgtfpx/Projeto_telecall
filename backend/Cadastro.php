<?php
// CONEXÃO
$host = "localhost";
$user = "root";
$pass = "";
$db = "sistema_site";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Erro ao conectar: " . $conn->connect_error);
}

// PEGANDO DADOS DO FORM
$nome          = $_POST['name'] ?? '';
$login         = $_POST['login'] ?? '';
$nome_materno  = $_POST['mothername'] ?? '';
$email         = $_POST['email'] ?? '';
$data_nasc     = $_POST['data'] ?? '';
$sexo_form     = $_POST['gender'] ?? '';
$cpf           = $_POST['cpf'] ?? '';
$cep           = $_POST['address'] ?? '';
$endereco      = $_POST['endereco'] ?? '';
$telefone      = $_POST['number'] ?? '';
$senha         = $_POST['password'] ?? '';
$senha2        = $_POST['confirmpassword'] ?? '';

// VALIDAÇÕES
if ($senha !== $senha2) {
    die("As senhas não coincidem.");
}

if (strlen($login) != 6) {
    die("O login deve ter 6 caracteres.");
}

// AJUSTANDO SEXO PARA O BANCO (seu select NÃO retorna M/F/Outro)
switch ($sexo_form) {
    case "1": $sexo = "F"; break;
    case "2": $sexo = "M"; break;
    case "3": $sexo = "Outro"; break;
    case "4": $sexo = "Outro"; break;
    default:  $sexo = "Outro"; break;
}

$cpf = preg_replace('/\D/', '', $cpf);
$cep = preg_replace('/\D/', '', $cep);
$telefone = preg_replace('/\D/', '', $telefone);

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// INSERÇÃO
$sql = "INSERT INTO usuarios 
(perfil_id, nome_completo, data_nascimento, sexo, nome_materno, cpf, email, telefone, cep, endereco, login, senha)
VALUES 
(2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssssssss",
    $nome,
    $data_nasc,
    $sexo,
    $nome_materno,
    $cpf,
    $email,
    $telefone,
    $cep,
    $endereco,
    $login,
    $senha_hash
);

if ($stmt->execute()) {
    header("Location: ../login.html");
    exit();
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
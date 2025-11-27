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
$cep           = $_POST['cep'] ?? '';
$endereco      = $_POST['endereco'] ?? '';
$telefone      = $_POST['number'] ?? '';
$senha         = $_POST['password'] ?? '';
$senha2        = $_POST['confirmpassword'] ?? '';

// VALIDAÇÕES BÁSICAS
if ($senha !== $senha2) {
    die("As senhas não coincidem.");
}

// LIMPAR DADOS
$cpf = preg_replace('/\D/', '', $cpf);
$cep = preg_replace('/\D/', '', $cep);

// VERIFICAR SE CPF JÁ EXISTE
$check_cpf_sql = "SELECT id_usuario FROM usuarios WHERE cpf = ?";
$stmt_check_cpf = $conn->prepare($check_cpf_sql);
$stmt_check_cpf->bind_param("s", $cpf);
$stmt_check_cpf->execute();
$stmt_check_cpf->store_result();

if ($stmt_check_cpf->num_rows > 0) {
    die("CPF já cadastrado no sistema.");
}
$stmt_check_cpf->close();

// VERIFICAR SE EMAIL JÁ EXISTE
$check_email_sql = "SELECT id_usuario FROM usuarios WHERE email = ?";
$stmt_check_email = $conn->prepare($check_email_sql);
$stmt_check_email->bind_param("s", $email);
$stmt_check_email->execute();
$stmt_check_email->store_result();

if ($stmt_check_email->num_rows > 0) {
    die("E-mail já cadastrado no sistema.");
}
$stmt_check_email->close();

// VERIFICAR SE LOGIN JÁ EXISTE
$check_login_sql = "SELECT id_usuario FROM usuarios WHERE login = ?";
$stmt_check_login = $conn->prepare($check_login_sql);
$stmt_check_login->bind_param("s", $login);
$stmt_check_login->execute();
$stmt_check_login->store_result();

if ($stmt_check_login->num_rows > 0) {
    die("Login já está em uso. Escolha outro login.");
}
$stmt_check_login->close();

// AJUSTANDO SEXO PARA O BANCO
switch ($sexo_form) {
    case "1": $sexo = "F"; break;
    case "2": $sexo = "M"; break;
    case "3": $sexo = "Outro"; break;
    default:  $sexo = "Outro"; break;
}

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
    echo "success";
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
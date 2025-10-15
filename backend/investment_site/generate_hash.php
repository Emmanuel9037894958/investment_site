<?php
// generate_hash.php
if (php_sapi_name() !== 'cli') header("Content-Type: text/plain");
$pass = $_GET['p'] ?? null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$pass) $pass = $_POST['password'] ?? null;
if (!$pass && php_sapi_name()==='cli') {
  echo "Enter password: ";
  $pass = trim(fgets(STDIN));
}
if (!$pass) {
  echo "Usage: call this page with ?p=yourPassword or POST password via form.\n";
  echo '<form method="post"><input name="password" type="password"><button>Hash</button></form>';
  exit;
}
echo password_hash($pass, PASSWORD_DEFAULT);

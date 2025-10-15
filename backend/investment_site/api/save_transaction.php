<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/db_config.php";

$input = json_decode(file_get_contents("php://input"), true);

$email = $input["email"] ?? '';
$amount = $input["amount"] ?? 0;
$ref = $input["ref"] ?? '';
$status = $input["status"] ?? 'pending';

if (empty($email) || empty($amount) || empty($ref)) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, status, created_at) VALUES ((SELECT id FROM users WHERE email=?), 'deposit', ?, ?, NOW())");
$stmt->bind_param("sis", $email, $amount, $status);
$success = $stmt->execute();

if ($success) {
    echo json_encode(["success" => true, "message" => "Transaction recorded successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Database insert failed."]);
}
?>

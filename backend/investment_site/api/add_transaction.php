<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once __DIR__ . '/db_config.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userId = intval($data["user_id"]);
$type   = $data["type"];
$amount = floatval($data["amount"]);

$stmt = $conn->prepare(
   "INSERT INTO transactions(user_id,type,amount) VALUES(?,?,?)"
);
$stmt->bind_param("isd", $userId,$type,$amount);
$stmt->execute();

if ($type === "DEPOSIT") {
    $conn->query("UPDATE users SET balance = balance + $amount WHERE id=$userId");
} elseif ($type === "WITHDRAW") {
    $conn->query("UPDATE users SET balance = balance - $amount WHERE id=$userId");
}
echo json_encode(["success"=>true]);

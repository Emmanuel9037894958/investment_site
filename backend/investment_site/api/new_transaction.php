<?php
include "db_config.php";
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userId = isset($data["user_id"]) ? intval($data["user_id"]) : 0;
$type   = strtoupper(trim($data["type"] ?? ''));
$amount = floatval($data["amount"] ?? 0);

if (!$userId || $amount <= 0 || !in_array($type, ["DEPOSIT", "WITHDRAW"])) {
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Invalid input"]);
    exit;
}

$conn->begin_transaction();

try {
    // Optional: check balance before withdrawal
    if ($type === "WITHDRAW") {
        $check = $conn->prepare("SELECT balance FROM users WHERE id=? FOR UPDATE");
        $check->bind_param("i", $userId);
        $check->execute();
        $res = $check->get_result()->fetch_assoc();
        if (!$res || $res['balance'] < $amount) {
            throw new Exception("Insufficient funds");
        }
    }

    // Insert transaction
    $stmt = $conn->prepare(
        "INSERT INTO transactions(user_id, type, amount) VALUES (?, ?, ?)"
    );
    $stmt->bind_param("isd", $userId, $type, $amount);
    $stmt->execute();

    // Update balance
    $update = ($type === "DEPOSIT")
        ? "UPDATE users SET balance = balance + ? WHERE id = ?"
        : "UPDATE users SET balance = balance - ? WHERE id = ?";
    $uStmt = $conn->prepare($update);
    $uStmt->bind_param("di", $amount, $userId);
    $uStmt->execute();

    $conn->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

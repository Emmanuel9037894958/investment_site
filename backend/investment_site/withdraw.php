<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$user = "root"; 
$pass = ""; 
$db   = "investment_db"; 

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Read input
$input = json_decode(file_get_contents("php://input"), true);
$userId = $input['userId'] ?? null;
$amount = $input['amount'] ?? null;

if (!$userId || !$amount) {
    echo json_encode(["success" => false, "message" => "Missing userId or amount"]);
    exit;
}

// Save withdrawal in DB
$stmt = $conn->prepare("INSERT INTO withdrawals (user_id, amount, created_at) VALUES (?, ?, NOW())");
$stmt->bind_param("id", $userId, $amount);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Withdrawal successful",
        "withdrawal" => [
            "userId" => $userId,
            "amount" => $amount,
            "createdAt" => date("Y-m-d H:i:s")
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$stmt->close();
$conn->close();
?>

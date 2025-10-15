<?php
// save_payment.php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Your React dev URL
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// --- Connect to database ---
include 'db.php'; // make sure this points to your DB connection file

// --- Get JSON data from frontend ---
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$user_id = $input["user_id"] ?? null;
$amount = $input["amount"] ?? null;
$currency = $input["currency"] ?? null;
$status = $input["status"] ?? "pending";
$reference = $input["reference"] ?? null;
$gateway = $input["gateway"] ?? "unknown"; // flutterwave or nowpayments

if (!$user_id || !$amount || !$currency || !$reference) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// --- Insert into database ---
$stmt = $conn->prepare("INSERT INTO payments (user_id, amount, currency, status, reference, gateway) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("idssss", $user_id, $amount, $currency, $status, $reference, $gateway);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "DB error"]);
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$input = json_decode(file_get_contents("php://input"), true);
$user_email = $input['user_email'];
$asset = $input['asset'];
$trade_type = $input['trade_type'];
$amount = $input['amount'];
$price = $input['price'];
$pay_ref = $input['pay_ref'];

$stmt = $pdo->prepare("INSERT INTO transactions (user_email, type, symbol, qty, price, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'success', NOW())");
$stmt->execute([$user_email, $trade_type, $asset, 1, $price, $amount]);

echo json_encode(["status" => "success", "message" => "Trade recorded"]);
?>

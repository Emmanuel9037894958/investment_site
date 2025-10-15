<?php
include('../../db_config.php');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$payment_id = $data['payment_id'] ?? null;

if (!$payment_id) {
    echo json_encode(["success" => false, "message" => "Payment ID required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE payments SET status = 'refunded' WHERE id = ?");
$stmt->bind_param("i", $payment_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Payment refunded"]);
} else {
    echo json_encode(["success" => false, "message" => "Refund failed"]);
}

$stmt->close();
$conn->close();
?>

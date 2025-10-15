<?php
include('../../db_config.php');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$message = $data['message'] ?? '';

if (empty($message)) {
    echo json_encode(["success" => false, "message" => "Message cannot be empty"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO notifications (message, created_at) VALUES (?, NOW())");
$stmt->bind_param("s", $message);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Message broadcasted"]);
} else {
    echo json_encode(["success" => false, "message" => "Broadcast failed"]);
}

$stmt->close();
$conn->close();
?>

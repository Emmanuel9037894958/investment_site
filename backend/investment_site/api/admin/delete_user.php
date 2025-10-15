<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
require_once("../db_config.php");
session_start();

// ✅ Optional: admin session check
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid user ID"]);
    exit;
}

// Delete user + linked records
$conn->query("DELETE FROM payments WHERE user_id = $id");
$conn->query("DELETE FROM investments WHERE user_id = $id");
$del = $conn->query("DELETE FROM users WHERE id = $id");

if ($del) {
    echo json_encode(["success" => true, "message" => "User deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete user"]);
}

<?php
// --- Headers for CORS & JSON ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// --- Preflight ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once("../db_config.php");

// ✅ 1. Ensure admin session is active
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// ✅ 2. Decode JSON input safely
$input = json_decode(file_get_contents("php://input"), true);
$message = trim($input['message'] ?? '');

if ($message === '') {
    echo json_encode(["success" => false, "message" => "Message cannot be empty"]);
    exit;
}

// ✅ 3. Ensure notifications table exists and has proper columns
// Expected columns: id (INT, AUTO_INCREMENT, PRIMARY KEY), message (TEXT or VARCHAR), created_at (DATETIME)
$stmt = $conn->prepare("INSERT INTO notifications (message, created_at) VALUES (?, NOW())");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("s", $message);

// ✅ 4. Execute and return proper JSON
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Notification sent successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();

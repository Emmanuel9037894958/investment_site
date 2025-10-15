<?php
// Start session with proper cookie params for cross-origin
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',  // Must match frontend origin
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'      // Allows cross-origin with credentials
]);
session_start();

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// JSON response
header("Content-Type: application/json");

// Database
require_once "../db_config.php";

// Get POSTed JSON
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit;
}

// Check admin
$stmt = $conn->prepare("SELECT * FROM admin WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        $_SESSION['admin_id'] = $row['id'];
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "admin" => [
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $row['email']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Admin not found"]);
}

$stmt->close();
$conn->close();

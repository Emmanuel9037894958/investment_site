<?php
// Always return JSON, even if there's an error
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Disable HTML-style PHP errors — capture them as text
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Custom error handler to send JSON instead of HTML
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "PHP_ERROR",
        "message" => "$errstr in $errfile on line $errline"
    ]);
    exit;
});

// Custom exception handler for fatal exceptions
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "UNCAUGHT_EXCEPTION",
        "message" => $e->getMessage()
    ]);
    exit;
});

// Include DB config (make sure path is correct)
require_once __DIR__ . "/api/db_config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $name     = trim($data['fullName'] ?? '');
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$name || !$email || !$password) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    // Check existing email
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$check) throw new Exception("Prepare failed: " . $conn->error);

    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already registered"]);
        $check->close();
        exit;
    }
    $check->close();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'client')");
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);

    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Registration successful",
            "user" => [
                "id" => $stmt->insert_id,
                "name" => $name,
                "email" => $email,
                "role" => "client"
            ]
        ]);
    } else {
        throw new Exception("Insert failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
}
?>

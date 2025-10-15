<?php
session_start();

// --- CORS CONFIG ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// --- CHECK IF LOGGED IN ---
if (isset($_SESSION['admin_id'])) {
    // Clear all session data
    $_SESSION = [];
    session_unset();
    session_destroy();

    echo json_encode([
        "success" => true,
        "message" => "Admin logged out successfully."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No admin session found."
    ]);
}
?>

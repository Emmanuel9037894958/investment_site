<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// --- CORS ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

// ✅ Ensure path to config is correct
require_once __DIR__ . '../db_config.php';

// ✅ Only allow logged-in admin
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// --- Fetch Stats ---
try {
    $stats = [
        "users" => $conn->query("SELECT COUNT(*) AS total FROM users")->fetch_assoc()["total"] ?? 0,
        "payments" => $conn->query("SELECT COUNT(*) AS total FROM payments")->fetch_assoc()["total"] ?? 0,
        "investments" => $conn->query("SELECT COUNT(*) AS total FROM investment_plans")->fetch_assoc()["total"] ?? 0,
        "pending" => $conn->query("SELECT COUNT(*) AS total FROM payments WHERE status='pending'")->fetch_assoc()["total"] ?? 0,
    ];

    // --- Fetch user and payment tables for the admin dashboard ---
    $users = [];
    $userResult = $conn->query("SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 50");
    while ($row = $userResult->fetch_assoc()) {
        $users[] = $row;
    }

    $payments = [];
    $paymentResult = $conn->query("SELECT id, user_id, amount, currency, status FROM payments ORDER BY id DESC LIMIT 50");
    while ($row = $paymentResult->fetch_assoc()) {
        $payments[] = $row;
    }

    echo json_encode([
        "success" => true,
        "stats" => $stats,
        "users" => $users,
        "payments" => $payments
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}

$conn->close();

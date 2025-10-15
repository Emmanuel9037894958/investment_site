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

// Get Stats
$stats = [
    "users" => 0,
    "payments" => 0,
    "investments" => 0,
    "pending" => 0
];

$statsQuery = [
    "users" => "SELECT COUNT(*) as total FROM users",
    "payments" => "SELECT COUNT(*) as total FROM payments",
    "investments" => "SELECT COUNT(*) as total FROM investments",
    "pending" => "SELECT COUNT(*) as total FROM payments WHERE status='pending'"
];

foreach ($statsQuery as $key => $sql) {
    $res = $conn->query($sql);
    if ($res && $row = $res->fetch_assoc()) {
        $stats[$key] = intval($row['total']);
    }
}

// Fetch users
$users = [];
$res = $conn->query("SELECT id, username, email, created_at FROM users ORDER BY id DESC");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $users[] = $row;
    }
}

// Fetch payments
$payments = [];
$res = $conn->query("SELECT id, user_id, amount, currency, status FROM payments ORDER BY id DESC");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $payments[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "stats" => $stats,
    "users" => $users,
    "payments" => $payments
]);

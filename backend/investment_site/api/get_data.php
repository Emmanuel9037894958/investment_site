<?php
/************************************************************
 *  get_data.php – Returns dashboard data for the logged-in user
 ************************************************************/

// ---------- Session & CORS ----------
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$allowedOrigin = "http://localhost:3000"; // Adjust if your frontend runs elsewhere
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight requests quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---------- Helpers ----------
function sendJson($payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

// ---------- Authentication ----------
if (empty($_SESSION['user_id'])) {
    sendJson(["success" => false, "error" => "Unauthorized access. Please log in."], 401);
}
$userId = (int)$_SESSION['user_id'];

// ---------- Database ----------
const DB_HOST = 'localhost';
const DB_NAME = 'investment_db';
const DB_USER = 'root';
const DB_PASS = '';

function connectDB(): PDO {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        sendJson(["success" => false, "error" => "Database connection error"], 500);
    }
}

$pdo = connectDB();

// ---------- Queries ----------
try {
    // A. Client Profile
    $stmt = $pdo->prepare("
        SELECT name, email, address, avatar_url, last_login,
               total_value, daily_change, buying_power, market_status
        FROM users
        WHERE id = ?
    ");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        sendJson(["success" => false, "error" => "User data not found."], 404);
    }

    // B. Recent Transactions
    $stmt = $pdo->prepare("
        SELECT id, type, asset, quantity AS qty, price,
               transaction_date AS date
        FROM transactions
        WHERE user_id = ?
        ORDER BY transaction_date DESC
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ---------- Build Response ----------
    $data = [
        "name"               => $profile['name'],
        "email"              => $profile['email'],
        "address"            => $profile['address'],
        "lastLogin"          => $profile['last_login'],
        "avatar"             => $profile['avatar_url'] ?? '',
        "totalValue"         => (float)$profile['total_value'],
        "dailyChange"        => (float)$profile['daily_change'],
        "buyingPower"        => (float)$profile['buying_power'],
        "marketStatus"       => $profile['market_status'],
        "recentTransactions" => $transactions
    ];

    sendJson(["success" => true, "data" => $data]);
} catch (PDOException $e) {
    error_log("Dashboard Fetch Error: " . $e->getMessage());
    sendJson(["success" => false, "error" => "An internal server error occurred."], 500);
}

<?php
// ---------- CORS HEADERS ----------
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json");

// ---------- DATABASE CONNECTION ----------
$host = "localhost";        // usually 'localhost'
$dbname = "investment_db";  // <-- replace with your database name
$username = "root";         // default XAMPP MySQL user
$password = "";             // default XAMPP MySQL password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "DB connection failed: " . $e->getMessage()  // 👈 show real reason
    ]);
    exit;
}


// ---------- READ REQUEST ----------
$data = json_decode(file_get_contents("php://input"), true);
$user   = $data["user"] ?? "";
$plan   = $data["plan"] ?? "";
$amount = $data["amount"] ?? "";

// ---------- INSERT INTO DB ----------
try {
    $stmt = $pdo->prepare("INSERT INTO investments (user, plan, amount) VALUES (?, ?, ?)");
    $stmt->execute([$user, $plan, $amount]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
};

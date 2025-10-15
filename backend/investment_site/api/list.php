<?php
// --- CORS headers ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

// --- Database credentials ---
$host     = "localhost";
$dbname   = "investment_db";
$username = "root";
$password = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // ✅ Query: join investments with users to get name + email
    $sql = "
        SELECT i.id,
               u.name  AS user_name,
               u.email AS user_email,
               i.plan,
               i.amount,
               i.status,
               i.created_at
        FROM investments i
        JOIN users u ON i.user_id = u.id      -- change if necessary
        ORDER BY i.created_at DESC
    ";

    $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $data]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

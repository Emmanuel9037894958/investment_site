<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Database credentials
$host = "localhost";
$dbname = "investment_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $user_id = $_SESSION["user_id"] ?? null;
    if (!$user_id) {
        echo json_encode(["success" => false, "error" => "Not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["success" => false, "error" => "No data received"]);
        exit;
    }

    // Only allow certain fields to be updated
    $fields = [];
    $values = [];

    if (isset($data['name'])) {
        $fields[] = "name = ?";
        $values[] = $data['name'];
    }
    if (isset($data['address'])) {
        $fields[] = "address = ?";
        $values[] = $data['address'];
    }
    if (isset($data['buyingPower'])) {
        $fields[] = "cash = ?";
        $values[] = $data['buyingPower'];
    }

    if (empty($fields)) {
        echo json_encode(["success" => false, "error" => "No valid fields to update"]);
        exit;
    }

    $values[] = $user_id;
    $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    // Return updated user info
    $stmt = $pdo->prepare("SELECT id, name, email, address, cash AS buyingPower FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "updatedUser" => $updatedUser]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

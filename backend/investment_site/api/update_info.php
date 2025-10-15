<?php
// --- CORS ---
header("Access-Control-Allow-Origin: http://localhost:3000"); // Change to your domain in production
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

// --- Session & Authentication ---
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id']; // Secure: logged-in user ID

// --- Database connection ---
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
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

// --- Read JSON input ---
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['name']) || !isset($input['address'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$name    = trim($input['name']);
$address = trim($input['address']);
$email   = isset($input['email']) ? trim($input['email']) : null;
$avatar  = isset($input['avatar']) ? trim($input['avatar']) : null;

// Validate basic inputs
if ($name === '' || $address === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit;
}

// --- Update user record ---
try {
    $stmt = $pdo->prepare("
        UPDATE users 
        SET 
            name = ?, 
            address = ?, 
            email = COALESCE(?, email), 
            avatar_url = COALESCE(?, avatar_url)
        WHERE id = ?
    ");
    $stmt->execute([$name, $address, $email, $avatar, $user_id]);

    // Optionally fetch the updated profile to return
    $stmtUser = $pdo->prepare("SELECT name, email, address, avatar_url FROM users WHERE id = ?");
    $stmtUser->execute([$user_id]);
    $updatedProfile = $stmtUser->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "message" => "Profile updated successfully",
        "profile" => $updatedProfile
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

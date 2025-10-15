<?php
try {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // ----------- HEADERS FOR CORS -----------
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Handle OPTIONS preflight request
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }

    // ----------- DB CONNECTION -----------
    $db_path = __DIR__ . "/db_config.php";
    if (!file_exists($db_path)) {
        throw new Exception("Database config file missing: $db_path");
    }

    require_once $db_path;
    if (!isset($conn)) {
        throw new Exception("Database connection (\$conn) not initialized in db_config.php");
    }

    // ----------- READ JSON INPUT -----------
    $raw = file_get_contents("php://input");
    $input = json_decode($raw, true);

    if (!$input || !isset($input["email"], $input["password"])) {
        echo json_encode(["success" => false, "message" => "Invalid input"]);
        exit;
    }

    $email = trim($input["email"]);
    $password = trim($input["password"]);

    // ----------- CHECK USER -----------
    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("MySQL prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "No account found with that email"]);
        exit;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user["password"])) {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
        exit;
    }

    // ----------- LOGIN SUCCESS -----------
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["email"] = $user["email"];
    $_SESSION["role"] = $user["role"];

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);
} catch (Throwable $e) {
    // Catch any fatal PHP or MySQL errors and return JSON
    echo json_encode([
        "success" => false,
        "error" => "SERVER_ERROR",
        "message" => $e->getMessage()
    ]);
    exit;
}
?>

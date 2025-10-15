<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db_config.php';

$action = $_GET['action'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'register':
        $name = $input['name'] ?? null;
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (!$name || !$email || !$password) {
            echo json_encode(['success' => false, 'error' => 'Missing name, email, or password.']);
            exit();
        }

        // Check if email already exists
        $stmt_check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
        $stmt_check->bind_param("s", $email);
        $stmt_check->execute();
        $stmt_check->store_result();
        if ($stmt_check->num_rows > 0) {
            echo json_encode(['success' => false, 'error' => 'Email already registered.']);
            exit();
        }
        $stmt_check->close();

        $user_id = uniqid('user_', true);
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $avatar = "https://placehold.co/100x100/A0AEC0/ffffff?text=".urlencode(strtoupper(substr($name, 0, 2)));

        $conn->begin_transaction();
        try {
            // Insert new user
            $stmt = $conn->prepare("INSERT INTO users (user_id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $user_id, $name, $email, $hashed_password, $avatar);
            $stmt->execute();
            $stmt->close();

            // Also create initial portfolio data for the new user
            $stmt_init = $conn->prepare("INSERT INTO portfolio_overview (user_id) VALUES (?)");
            $stmt_init->bind_param("s", $user_id);
            $stmt_init->execute();
            $stmt_init->close();

            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Registration successful!']);
        } catch (mysqli_sql_exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'error' => "Registration failed: " . $e->getMessage()]);
        }
        break;

    case 'login':
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (!$email || !$password) {
            echo json_encode(['success' => false, 'error' => 'Missing email or password.']);
            exit();
        }

        $stmt = $conn->prepare("SELECT user_id, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            echo json_encode(['success' => true, 'user_id' => $user['user_id']]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Incorrect email or password.']);
        }
        break;

    case 'logout':
        session_unset();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;
        
    case 'check_auth':
        if (isset($_SESSION['user_id'])) {
            echo json_encode(['success' => true, 'is_authenticated' => true, 'user_id' => $_SESSION['user_id']]);
        } else {
            echo json_encode(['success' => true, 'is_authenticated' => false]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Invalid action."]);
        break;
}

$conn->close();
?>

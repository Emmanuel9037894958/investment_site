<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "investment_db";
$user_id = 'demo_user_1'; // Hardcoded user ID for demonstration

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => "Connection failed: " . $conn->connect_error]);
    exit();
}

$action = $_GET['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'get_data':
        // Fetch all necessary dashboard data
        $data = [
            'user' => null,
            'overview' => null,
            'holdings' => [],
            'transactions' => [],
            'chartData' => [],
        ];

        // 1. Get User Profile
        if ($stmt = $conn->prepare("SELECT name, email, avatar FROM users WHERE user_id = ?")) {
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $data['user'] = $row;
            }
            $stmt->close();
        }

        // 2. Get Portfolio Overview
        if ($stmt = $conn->prepare("SELECT total_value, daily_change, invested_value, cash_value FROM portfolio_overview WHERE user_id = ?")) {
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $data['overview'] = $row;
            }
            $stmt->close();
        }

        // 3. Get Holdings
        if ($stmt = $conn->prepare("SELECT name, symbol, qty, price, change_pct FROM holdings WHERE user_id = ?")) {
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $data['holdings'][] = $row;
            }
            $stmt->close();
        }

        // 4. Get Transactions
        if ($stmt = $conn->prepare("SELECT type, symbol, amount, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC")) {
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $data['transactions'][] = $row;
            }
            $stmt->close();
        }

        // 5. Get Performance Chart Data
        if ($stmt = $conn->prepare("SELECT snapshot_value FROM performance_history WHERE user_id = ? ORDER BY snapshot_date ASC")) {
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $data['chartData'][] = floatval($row['snapshot_value']);
            }
            $stmt->close();
        }
        
        echo json_encode(['success' => true, 'data' => $data]);
        break;

    case 'update_profile':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $name = $input['name'] ?? null;
            $email = $input['email'] ?? null;
            
            if ($stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE user_id = ?")) {
                $stmt->bind_param("sss", $name, $email, $user_id);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => $stmt->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(['success' => false, 'error' => $conn->error]);
            }
        }
        break;

    case 'add_transaction':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $type = $input['type'] ?? null;
            $symbol = $input['symbol'] ?? null;
            $amount = $input['amount'] ?? 0;

            if ($stmt = $conn->prepare("INSERT INTO transactions (user_id, type, symbol, amount) VALUES (?, ?, ?, ?)")) {
                $stmt->bind_param("sssd", $user_id, $type, $symbol, $amount);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => $stmt->error]);
                }
                $stmt->close();
            } else {
                echo json_encode(['success' => false, 'error' => $conn->error]);
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => "Action not found."]);
        break;
}

$conn->close();
?>

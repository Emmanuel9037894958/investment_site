<?php
// header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "investment_db";

// Use PDO for database connection, as discussed
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Helper function using PDO
function fetchData($conn, $query, $params = []) {
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return ['error' => 'Prepare failed: ' . implode(", ", $conn->errorInfo())];
    }
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $data;
}

// Fallback user ID to match the one in tables.sql
$user_id = $_GET['user_id'] ?? 'user_A';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'user_profile':
        $sql = "SELECT userId, name, email, cash FROM users WHERE userId = ?";
        $data = fetchData($conn, $sql, [$user_id]);
        echo json_encode($data[0] ?? null);
        break;

    case 'overview':
        // Fetch total portfolio value, invested value, and cash from the database
        $sql = "SELECT SUM(qty * price) AS invested, (SELECT cash FROM users WHERE userId = ?) AS cash FROM holdings WHERE userId = ?";
        $data = fetchData($conn, $sql, [$user_id, $user_id]);

        $invested = $data[0]['invested'] ?? 0;
        $cash = $data[0]['cash'] ?? 0;
        $totalValue = $invested + $cash;

        // Placeholder for dailyChange - in a real app, you'd calculate this
        $dailyChange = 1.8;

        echo json_encode([
            'totalValue' => $totalValue,
            'dailyChange' => $dailyChange,
            'invested' => $invested,
            'cash' => $cash,
        ]);
        break;

    case 'performance':
        // Placeholder data
        $data = [
            'series' => [100000, 102000, 104500, 103000, 107000, 110000, 108000, 112000, 115000, 118000, 120000, 125000],
        ];
        echo json_encode($data);
        break;

    case 'holdings':
        // Fetch holdings from the database.
        $sql = "SELECT symbol, name, qty, price, 1.25 AS 'change' FROM holdings WHERE userId = ?";
        $data = fetchData($conn, $sql, [$user_id]);
        echo json_encode($data);
        break;

    case 'transactions':
        // Fetch recent transactions
        $sql = "SELECT id, created_at, type, symbol, qty, amount FROM transactions WHERE userId = ? ORDER BY created_at DESC LIMIT 10";
        $data = fetchData($conn, $sql, [$user_id]);
        echo json_encode($data);
        break;

    default:
        echo json_encode(['error' => 'Invalid action specified.']);
        break;
}
?>

<?php

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

require_once 'config.php';

$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($data['type'], $data['symbol'], $data['qty'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$user_id = $_SESSION["user_id"] ?? "user_A";

$type = $data['type'];
$symbol = strtoupper($data['symbol']);
$qty = floatval($data['qty']);
$current_price = 100.00;
$amount = $qty * $current_price;

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("SELECT cash FROM users WHERE userId = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        $conn->rollBack();
        exit();
    }
    
    $cash = floatval($user['cash']);

    if ($type === 'BUY') {
        if ($cash < $amount) {
            echo json_encode(['success' => false, 'message' => 'Insufficient funds.']);
            $conn->rollBack();
            exit();
        }

        $stmt = $conn->prepare("UPDATE users SET cash = cash - ? WHERE userId = ?");
        $stmt->execute([$amount, $user_id]);

        $stmt = $conn->prepare("SELECT * FROM holdings WHERE userId = ? AND symbol = ?");
        $stmt->execute([$user_id, $symbol]);
        $holding = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($holding) {
            $new_qty = $holding['qty'] + $qty;
            $stmt = $conn->prepare("UPDATE holdings SET qty = ?, price = ? WHERE userId = ? AND symbol = ?");
            $stmt->execute([$new_qty, $current_price, $user_id, $symbol]);
        } else {
            $stmt = $conn->prepare("INSERT INTO holdings (userId, symbol, name, qty, price) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $symbol, $symbol, $qty, $current_price]);
        }
        
    } elseif ($type === 'SELL') {
        $stmt = $conn->prepare("SELECT qty FROM holdings WHERE userId = ? AND symbol = ?");
        $stmt->execute([$user_id, $symbol]);
        $holding_qty = $stmt->fetchColumn();

        if ($holding_qty === false || $holding_qty < $qty) {
            echo json_encode(['success' => false, 'message' => 'Insufficient holdings to sell.']);
            $conn->rollBack();
            exit();
        }

        $stmt = $conn->prepare("UPDATE users SET cash = cash + ? WHERE userId = ?");
        $stmt->execute([$amount, $user_id]);

        $new_qty = $holding_qty - $qty;
        if ($new_qty > 0) {
            $stmt = $conn->prepare("UPDATE holdings SET qty = ? WHERE userId = ? AND symbol = ?");
            $stmt->execute([$new_qty, $user_id, $symbol]);
        } else {
            $stmt = $conn->prepare("DELETE FROM holdings WHERE userId = ? AND symbol = ?");
            $stmt->execute([$user_id, $symbol]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid transaction type.']);
        $conn->rollBack();
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO transactions (userId, type, symbol, amount, createdAt) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$user_id, $type, $symbol, $amount]);

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Transaction successfully processed.']);

} catch (PDOException $e) {
    $conn->rollBack();
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'A database error occurred.']);
}

?>

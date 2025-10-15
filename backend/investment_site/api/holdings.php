<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "investment_db");

$user_id = 1; // Hardcoded for demo
$res = $mysqli->query("SELECT symbol, name, qty, price, change_percent FROM holdings WHERE user_id=$user_id");

$holdings = [];
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $holdings[] = [
            "symbol" => $row['symbol'],
            "name" => $row['name'],
            "shares" => (int)$row['qty'],
            "value" => (float)$row['qty'] * (float)$row['price'],
            "price" => (float)$row['price'],
            "pl_daily" => (float)$row['change_percent'] / 100 * ((float)$row['qty'] * (float)$row['price'])
        ];
    }
}

echo json_encode(["success" => true, "data" => $holdings]);
?>

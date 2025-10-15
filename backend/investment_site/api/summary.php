<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "investment_db");

$user_id = 1; // Hardcoded for demo

$summary = [
    "totalAssets" => 0,
    "dailyChange" => 0,
    "totalGainLoss" => 0,
    "cashBalance" => 0
];

// Cash balance from clients table
$res = $mysqli->query("SELECT balance FROM clients WHERE id=$user_id");
if ($res && $row = $res->fetch_assoc()) {
    $summary['cashBalance'] = (float)$row['balance'];
    $summary['totalAssets'] = (float)$row['balance'];
}

// Sum of all holdings
$res2 = $mysqli->query("SELECT SUM(qty*price) as total FROM holdings WHERE user_id=$user_id");
if ($res2 && $row2 = $res2->fetch_assoc()) {
    $summary['totalAssets'] += (float)($row2['total'] ?? 0);
}

// Placeholder for dailyChange & totalGainLoss
$summary['dailyChange'] = rand(-200, 200);
$summary['totalGainLoss'] = rand(-500, 500);

echo json_encode(["success" => true, "data" => $summary]);
?>

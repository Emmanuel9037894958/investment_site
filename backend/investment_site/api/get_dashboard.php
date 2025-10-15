<?php
// api/get_dashboard.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once __DIR__ . '/db_config.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if (!$user_id) { echo json_encode(["success"=>false,"message"=>"Missing user_id"]); exit; }

// 1. user overview (cash)
$stmt = $conn->prepare("SELECT id, name, email, role, balance FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$userRes = $stmt->get_result();
if (!$user = $userRes->fetch_assoc()) {
    echo json_encode(["success"=>false,"message"=>"User not found"]);
    $stmt->close(); $conn->close(); exit;
}
$stmt->close();
$cash = floatval($user['balance']);

// 2. holdings
$holdings = [];
$hstmt = $conn->prepare("SELECT symbol, name, qty, price, `change` FROM holdings WHERE user_id = ?");
$hstmt->bind_param("i", $user_id);
$hstmt->execute();
$hres = $hstmt->get_result();
while ($row = $hres->fetch_assoc()) $holdings[] = $row;
$hstmt->close();

// calculate invested value from holdings (qty * price)
$invested = 0.0;
foreach ($holdings as $h) {
  $invested += floatval($h['qty']) * floatval($h['price']);
}
$totalValue = $cash + $invested;
$overview = ["cash"=>$cash, "invested"=>$invested, "totalValue"=>$totalValue, "dailyChange"=>0];

// 3. recent transactions (last 12)
$txs = [];
$tstmt = $conn->prepare("SELECT id, `type`, symbol, qty, price, amount, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 12");
$tstmt->bind_param("i", $user_id);
$tstmt->execute();
$tres = $tstmt->get_result();
while ($r = $tres->fetch_assoc()) $txs[] = $r;
$tstmt->close();

echo json_encode([
  "success" => true,
  "user" => $user,
  "overview" => $overview,
  "holdings" => $holdings,
  "transactions" => $txs
]);

$conn->close();

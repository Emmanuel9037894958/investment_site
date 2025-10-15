<?php
// api/get_transactions.php
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

$stmt = $conn->prepare("SELECT id, `type`, symbol, qty, price, amount, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
$txs = [];
while ($r = $res->fetch_assoc()) $txs[] = $r;

echo json_encode(["success"=>true, "transactions"=>$txs]);
$stmt->close();
$conn->close();

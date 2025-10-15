<?php
require_once __DIR__ . '/db_config.php';
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? 0;
$symbol = strtoupper($data['symbol'] ?? '');
$qty    = (float)($data['quantity'] ?? 0);
$type   = strtoupper($data['type'] ?? '');
if(!$userId || !$symbol || $qty<=0) { echo json_encode(["error"=>"Invalid data"]); exit; }

$price = 100; // fetch live price if you have it
$pdo->prepare("INSERT INTO transactions (user_id,type,asset,quantity,price)
               VALUES (?,?,?,?,?)")->execute([$userId,$type,$symbol,$qty,$price]);

// update buying power / total value logic here...
echo json_encode(["success"=>true]);

<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");

$coins = [
    ["symbol" => "BTC-USD", "price" => rand(20000, 40000)],
    ["symbol" => "ETH-USD", "price" => rand(1000, 3000)],
    ["symbol" => "SOL-USD", "price" => rand(20, 150)],
    ["symbol" => "ADA-USD", "price" => rand(0, 2)],
];

echo json_encode(["success" => true, "data" => $coins]);
?>

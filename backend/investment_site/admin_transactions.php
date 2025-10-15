<?php
include("config.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// get all transactions
$sql = "SELECT t.id, u.name, u.email, t.type, t.amount, t.created_at 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        ORDER BY t.created_at DESC";

$result = $conn->query($sql);

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode(["success" => true, "transactions" => $transactions]);
$conn->close();
?>

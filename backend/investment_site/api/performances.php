<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "investment_db");

$user_id = 1; // Hardcoded for demo
$performance = [];

// Get all holdings
$res = $mysqli->query("SELECT qty, price, change_percent FROM holdings WHERE user_id=$user_id");

if ($res) {
    $days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    foreach($days as $day) {
        $total = 0;
        $res->data_seek(0); // Reset pointer
        while($row = $res->fetch_assoc()){
            $dayChange = ((float)$row['qty'] * (float)$row['price']) * ((float)$row['change_percent']/100);
            $total += $dayChange;
        }
        $performance[] = ["name"=>$day,"value"=>round($total,2)];
    }
}

echo json_encode(["success" => true, "data" => $performance]);
?>

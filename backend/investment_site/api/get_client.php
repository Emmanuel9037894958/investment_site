<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "", "investment_db");
if ($mysqli->connect_errno) {
    echo json_encode(["success"=>false,"error"=>"DB connection failed"]);
    exit;
}

// For demo, returning the first client
$result = $mysqli->query("SELECT * FROM clients LIMIT 1");
$client = $result->fetch_assoc();

echo json_encode(["success"=>true,"client"=>$client]);
?>

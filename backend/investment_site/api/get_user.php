<?php
include "db_config.php";
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$id = intval($_GET['id'] ?? 0);
$stmt = $conn->prepare("SELECT id,name,email,balance FROM users WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
echo json_encode($stmt->get_result()->fetch_assoc());

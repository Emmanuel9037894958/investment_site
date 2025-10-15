<?php
include("config.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get all users
$sql = "SELECT id, name, email, role, balance, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(["success" => true, "users" => $users]);

$conn->close();
?>

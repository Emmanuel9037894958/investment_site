<?php
include('../../db_config.php');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$min = $data['min_amount'] ?? 0;
$max = $data['max_amount'] ?? 0;
$return_rate = $data['return_rate'] ?? 0;

if (empty($name) || !$min || !$max || !$return_rate) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO investment_plans (name, min_amount, max_amount, return_rate) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sddd", $name, $min, $max, $return_rate);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Investment plan added"]);
} else {
    echo json_encode(["success" => false, "message" => "Error adding plan"]);
}

$stmt->close();
$conn->close();
?>

<?php
include("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $amount = $_POST['amount'];

    $sql = "INSERT INTO payments (user_id, amount, status) VALUES (?, ?, 'pending')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("id", $user_id, $amount);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Payment recorded. Waiting for admin approval."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }
}
?>

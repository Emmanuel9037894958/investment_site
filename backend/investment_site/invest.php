<?php
include("config.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = intval($data['user_id'] ?? 0);
    $amount = floatval($data['amount'] ?? 0);

    if ($user_id <= 0 || $amount <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid input"]);
        exit;
    }

    $sql = "UPDATE users SET balance = balance + ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("di", $amount, $user_id);

    if ($stmt->execute()) {
        // log transaction
        $log = $conn->prepare("INSERT INTO transactions (user_id, type, amount) VALUES (?, 'investment', ?)");
        $log->bind_param("id", $user_id, $amount);
        $log->execute();
        $log->close();

        echo json_encode(["success" => true, "message" => "Investment successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>

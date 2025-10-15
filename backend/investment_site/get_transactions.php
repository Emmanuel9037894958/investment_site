<?php
include("config.php");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id > 0) {
        $sql = "SELECT id, type, amount, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }

        echo json_encode(["success" => true, "transactions" => $transactions]);
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid user ID"]);
    }
    $conn->close();
}
?>

<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "investment_db";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "error" => "DB_CONNECTION_FAILED",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}
?>

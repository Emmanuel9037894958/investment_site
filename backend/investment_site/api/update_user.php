<?php
include "db_config.php";
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$id    = intval($data["id"]);
$name  = $data["name"];
$email = $data["email"];

$stmt = $conn->prepare("UPDATE users SET name=?, email=? WHERE id=?");
$stmt->bind_param("ssi",$name,$email,$id);
$stmt->execute();
echo json_encode(["success"=>true]);

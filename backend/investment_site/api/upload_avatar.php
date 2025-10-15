<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

$id = $_POST['userId'];
if(!empty($_FILES['avatar']['tmp_name'])){
  $name = time().'_'.basename($_FILES['avatar']['name']);
  $path = 'uploads/'.$name;
  move_uploaded_file($_FILES['avatar']['tmp_name'], __DIR__.'/'.$path);
  $pdo->prepare("UPDATE users SET avatar=? WHERE id=?")->execute([$path,$id]);
  echo json_encode(["success"=>true,"avatar"=>"/investment_site/api/".$path]);
} else {
  echo json_encode(["error"=>"No file"]);
}

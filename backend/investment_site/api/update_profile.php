<?php
// ✅ Set headers for JSON and CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Connect to database
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "investment_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// ✅ Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST["userId"])) {
        echo json_encode(["status" => "error", "message" => "Missing userId"]);
        exit;
    }

    $userId = intval($_POST["userId"]);

    // ✅ Ensure file exists
    if (!isset($_FILES["avatar"])) {
        echo json_encode(["status" => "error", "message" => "No file uploaded"]);
        exit;
    }

    $targetDir = __DIR__ . "/uploads/";
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

    $fileName = time() . "_" . basename($_FILES["avatar"]["name"]);
    $targetFile = $targetDir . $fileName;
    $relativePath = "uploads/" . $fileName; // For database storage

    // ✅ Move file to uploads/
    if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $targetFile)) {
        // ✅ Update database
        $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->bind_param("si", $relativePath, $userId);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Profile picture updated successfully.",
                "avatarPath" => $relativePath
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update database"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to upload file"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();

<?php
// create_admin.php
require_once "../db_config.php";

// --- Admin credentials ---
$admins = [
    [
        "name" => "Leo",
        "email" => "castlekim78@gmail.com",
        "password" => "Leo@2025!"
    ],
    [
        "name" => "Developer",
        "email" => "voiceofhustle22@gmail.com",
        "password" => "Dev@2025!"
    ]
];

// --- Remove existing admins ---
$conn->query("DELETE FROM admin");

// --- Insert new admins ---
$stmt = $conn->prepare("INSERT INTO admin (name, email, password) VALUES (?, ?, ?)");

foreach ($admins as $admin) {
    $hashed = password_hash($admin["password"], PASSWORD_DEFAULT);
    $stmt->bind_param("sss", $admin["name"], $admin["email"], $hashed);
    $stmt->execute();
}

$stmt->close();
$conn->close();

echo "✅ Admin accounts have been created successfully!<br>";
echo "You can now log in with:<br><br>";

echo "<strong>Owner (Leo)</strong><br>Email: castlekim78@gmail.com<br>Password: Leo@2025!<br><br>";
echo "<strong>Developer (You)</strong><br>Email: voiceofhustle22@gmail.com<br>Password: Dev@2025!<br><br>";

echo "⚠️ For security: After confirming login works, delete this file (create_admin.php).";
?>

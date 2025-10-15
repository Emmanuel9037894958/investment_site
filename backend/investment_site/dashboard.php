<?php
session_start();
include("config.php");

// ✅ Check if user is logged in
if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit();
}

$user_id = $_SESSION["user_id"];

// ✅ Fetch user info
$sql = "SELECT * FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// ✅ Handle deposit form
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["deposit"])) {
    $amount = $_POST["amount"];
    $sql = "INSERT INTO payments (user_id, amount, status) VALUES (?, ?, 'pending')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("id", $user_id, $amount);
    if ($stmt->execute()) {
        $message = "✅ Deposit request submitted. Waiting for admin approval.";
    } else {
        $message = "❌ Error submitting deposit.";
    }
}

// ✅ Handle withdrawal form
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["withdraw"])) {
    $amount = $_POST["amount"];
    if ($amount > $user["balance"]) {
        $message = "❌ You don’t have enough balance to withdraw.";
    } else {
        // Just insert into payments table as negative amount (withdrawal request)
        $sql = "INSERT INTO payments (user_id, amount, status) VALUES (?, ?, 'pending')";
        $stmt = $conn->prepare($sql);
        $negAmount = -$amount; // withdrawal = negative
        $stmt->bind_param("id", $user_id, $negAmount);
        if ($stmt->execute()) {
            $message = "✅ Withdrawal request submitted. Waiting for admin approval.";
        } else {
            $message = "❌ Error submitting withdrawal.";
        }
    }
}

// ✅ Fetch recent transactions
$sql = "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 10";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$transactions = $stmt->get_result();

?>
<!DOCTYPE html>
<html>
<head>
    <title>User Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f4f4f9; }
        .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 10px; }
        h1 { color: #333; }
        .balance { font-size: 20px; font-weight: bold; color: green; }
        .form-box { margin: 20px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 10px; text-align: center; }
        .message { margin: 10px 0; padding: 10px; background: #e7f3fe; border: 1px solid #2196F3; color: #0b5ed7; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome, <?php echo $user["name"]; ?> 👋</h1>
        <p>Email: <?php echo $user["email"]; ?></p>
        <p class="balance">💰 Balance: $<?php echo number_format($user["balance"], 2); ?></p>

        <?php if (!empty($message)) echo "<div class='message'>$message</div>"; ?>

        <!-- Deposit Form -->
        <div class="form-box">
            <h3>Deposit Funds</h3>
            <form method="POST">
                <input type="number" name="amount" placeholder="Enter deposit amount" required>
                <button type="submit" name="deposit">Deposit</button>
            </form>
        </div>

        <!-- Withdrawal Form -->
        <div class="form-box">
            <h3>Withdraw Funds</h3>
            <form method="POST">
                <input type="number" name="amount" placeholder="Enter withdrawal amount" required>
                <button type="submit" name="withdraw">Withdraw</button>
            </form>
        </div>

        <!-- Transactions -->
        <h3>Recent Transactions</h3>
        <table>
            <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
            <?php while ($row = $transactions->fetch_assoc()) { ?>
            <tr>
                <td><?php echo $row["id"]; ?></td>
                <td><?php echo ($row["amount"] > 0 ? "+" : "") . $row["amount"]; ?></td>
                <td><?php echo ucfirst($row["status"]); ?></td>
                <td><?php echo $row["created_at"]; ?></td>
            </tr>
            <?php } ?>
        </table>

        <p><a href="logout.php">Logout</a></p>
    </div>
</body>
</html>

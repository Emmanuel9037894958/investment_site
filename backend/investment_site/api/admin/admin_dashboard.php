<?php
// admin_dashboard.php

// --- TURN OFF WARNINGS FOR JSON ---
error_reporting(0);
ini_set('display_errors', 0);

session_start();

// --- CORS / JSON HEADERS ---
header("Access-Control-Allow-Origin: *"); // Or restrict to your frontend
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: text/html; charset=UTF-8"); // This is an HTML page

// --- DATABASE CONNECTION ---
require_once __DIR__ . '/../db_config.php';

// --- CHECK ADMIN LOGIN ---
if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

// --- FETCH DASHBOARD STATS ---
$users = $conn->query("SELECT COUNT(*) AS total FROM users")->fetch_assoc()['total'] ?? 0;
$payments = $conn->query("SELECT COUNT(*) AS total FROM payments")->fetch_assoc()['total'] ?? 0;
$revenue = $conn->query("SELECT SUM(amount) AS total FROM payments WHERE status='success'")->fetch_assoc()['total'] ?? 0;
$plans = $conn->query("SELECT COUNT(*) AS total FROM investment_plans")->fetch_assoc()['total'] ?? 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard</title>
<style>
body { font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px; margin:0; }
h1 { color: #333; text-align: center; }
.dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
.card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 3px 6px rgba(0,0,0,0.1); text-align: center; }
.card h3 { margin-bottom: 10px; }
button { background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }
button:hover { background: #0056b3; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; justify-content: center; }
a.logout { display: inline-block; margin-top: 40px; text-decoration: none; color: white; background: #dc3545; padding: 10px 20px; border-radius: 8px; }
a.logout:hover { background: #b02a37; }
</style>
</head>
<body>

<h1>Welcome Admin</h1>

<div class="dashboard">
  <div class="card"><h3>Total Users</h3><p><?= $users ?></p></div>
  <div class="card"><h3>Payments</h3><p><?= $payments ?></p></div>
  <div class="card"><h3>Revenue</h3><p>$<?= number_format($revenue, 2) ?></p></div>
  <div class="card"><h3>Investment Plans</h3><p><?= $plans ?></p></div>
</div>

<div class="actions">
  <button onclick="deleteUser()">🗑️ Delete User</button>
  <button onclick="refundPayment()">💸 Refund Payment</button>
  <button onclick="addPlan()">📈 Add Investment Plan</button>
  <button onclick="broadcast()">📢 Send Message to All Users</button>
</div>

<script>
async function deleteUser() {
  const id = prompt("Enter User ID to delete:");
  if (!id) return;
  try {
    const res = await fetch('actions/delete_user.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user_id: id})
    });
    const data = await res.json();
    alert(data.message || 'Action completed');
  } catch (e) {
    alert('Error deleting user');
  }
}

async function refundPayment() {
  const id = prompt("Enter Payment ID to refund:");
  if (!id) return;
  try {
    const res = await fetch('actions/refund_payment.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({payment_id: id})
    });
    const data = await res.json();
    alert(data.message || 'Action completed');
  } catch (e) {
    alert('Error refunding payment');
  }
}

async function addPlan() {
  const name = prompt("Plan Name:");
  const min = prompt("Min Amount:");
  const max = prompt("Max Amount:");
  const rate = prompt("Return Rate (%):");
  if (!name || !min || !max || !rate) return;
  try {
    const res = await fetch('actions/add_plan.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, min_amount: min, max_amount: max, return_rate: rate})
    });
    const data = await res.json();
    alert(data.message || 'Plan added');
  } catch (e) {
    alert('Error adding plan');
  }
}

async function broadcast() {
  const msg = prompt("Enter message to send to all users:");
  if (!msg) return;
  try {
    const res = await fetch('actions/broadcast_message.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: msg})
    });
    const data = await res.json();
    alert(data.message || 'Message sent');
  } catch (e) {
    alert('Error sending message');
  }
}
</script>

<a href="logout.php" class="logout">Logout</a>

</body>
</html>

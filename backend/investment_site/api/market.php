<?php
require_once __DIR__ . '/db_config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Fetch all rows
    $rows = $pdo->query("SELECT id, symbol, name, price, `change`, `percent` FROM market")->fetchAll(PDO::FETCH_ASSOC);

    // Simulate random price updates
    foreach ($rows as &$row) {
        $oldPrice = (float)$row['price'];

        // Generate random change between -2% and +2%
        $percentChange = mt_rand(-200, 200) / 100; // -2.00 to +2.00
        $newPrice = $oldPrice * (1 + $percentChange / 100);

        $row['change'] = number_format($newPrice - $oldPrice, 2);
        $row['percent'] = number_format($percentChange, 2);
        $row['price'] = number_format($newPrice, 2);

        // Update DB so next call remembers new price
        $stmt = $pdo->prepare("UPDATE market SET price=?, `change`=?, `percent`=? WHERE id=?");
        $stmt->execute([$row['price'], $row['change'], $row['percent'], $row['id']]);
    }

    echo json_encode(["success" => true, "market" => $rows]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

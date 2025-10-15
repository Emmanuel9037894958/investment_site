<?php
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Stripe\Stripe;
use Stripe\PaymentIntent;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Securely set Stripe secret key from .env
Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

// CORS & JSON headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Read JSON request body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['amount']) || !is_numeric($input['amount'])) {
        throw new Exception('Invalid or missing amount.');
    }

    $amount = (int) ($input['amount'] * 100); // convert dollars to cents
    $plan   = $input['plan'] ?? 'Default Plan';

    // Create the Payment Intent
    $intent = PaymentIntent::create([
        'amount' => $amount,
        'currency' => 'usd',
        'description' => "Investment: {$plan}",
        'automatic_payment_methods' => ['enabled' => true],
    ]);

    echo json_encode(['clientSecret' => $intent->client_secret]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

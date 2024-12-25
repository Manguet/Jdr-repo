<?php
// public/test.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

echo json_encode([
    'status' => 'ok',
    'message' => 'API is working',
    'time' => date('Y-m-d H:i:s')
]);

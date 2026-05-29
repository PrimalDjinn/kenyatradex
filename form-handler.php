<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

function readSecret(string $key): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        $value = $_SERVER[$key] ?? '';
    }

    return trim((string) $value);
}

$brevoApiKey = readSecret('KENYA_TRADEX_BREVO_API_KEY');
$recaptchaSecret = readSecret('KENYA_TRADEX_RECAPTCHA_SECRET');

if ($brevoApiKey === '' || $recaptchaSecret === '') {
    error_log('Kenya Tradex Form Error: Missing Brevo or reCAPTCHA server environment variables.');
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Server email configuration is incomplete. Please contact Kenya Tradex directly at info@kenyatradex.africa.'
    ]);
    exit;
}

$recipient = readSecret('KENYA_TRADEX_FORM_RECIPIENT') ?: 'info@kenyatradex.africa';
$fromEmail = 'info@kenyatradex.africa';
$fromName = 'Kenya Tradex';
$redirectUrl = 'https://kenyatradex.africa/';

// Verify reCAPTCHA
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptchaResponse)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Please complete the reCAPTCHA verification.']);
    exit;
}

// Verify reCAPTCHA with Google
$recaptchaVerify = file_get_contents(
    'https://www.google.com/recaptcha/api/siteverify?' .
    http_build_query([
        'secret' => $recaptchaSecret,
        'response' => $recaptchaResponse,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ])
);

$recaptchaResult = json_decode($recaptchaVerify, true);

if (!($recaptchaResult['success'] ?? false)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'reCAPTCHA verification failed. Please try again.']);
    exit;
}

// Get and sanitize form data
$ignoreFields = ['page_name', 'g-recaptcha-response'];
$fields = [];
$pageName = trim((string) ($_POST['page_name'] ?? 'Website Inquiry'));

foreach ($_POST as $key => $value) {
    if (in_array($key, $ignoreFields, true)) {
        continue;
    }

    if (is_array($value)) {
        $value = implode(', ', $value);
    }

    $cleanKey = trim((string) $key);
    $cleanValue = trim((string) $value);

    if ($cleanKey === '' || $cleanValue === '') {
        continue;
    }

    // Prevent email header injection
    if (in_array($cleanKey, ['email', 'name'])) {
        $cleanValue = preg_replace("/[\r\n]/", '', $cleanValue);
    }

    $fields[$cleanKey] = $cleanValue;
}

// Server-side validation
$errors = [];

// Name validation
$name = $fields['name'] ?? '';
if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name is required (minimum 2 characters)';
}

// Email validation
$email = $fields['email'] ?? '';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required';
}

// Phone validation (if provided, must be valid Kenyan format)
$phone = $fields['phone'] ?? '';
if (!empty($phone)) {
    $phoneClean = preg_replace('/[\s\(\)\-\+]/', '', $phone);
    if (!preg_match('/^(254|0)?[1-9]\d{8,9}$/', $phoneClean)) {
        $errors[] = 'Phone number must be valid (e.g., (254) 723 000 000)';
    }
}

// Message validation
$message = $fields['message'] ?? '';
if (empty($message)) {
    $errors[] = 'Please provide cargo/service details';
}

// Normalize page-specific fields so all forms can be processed by one handler.
$serviceKeys = [
    'service',
    'service_interest',
    'shipment_type',
    'shipping_method',
    'cargo_type',
    'vehicle_type',
    'location',
];
$destinationKeys = [
    'destination',
    'country',
    'origin_country',
    'origin',
    'location',
];

$service = '';
foreach ($serviceKeys as $key) {
    if (!empty($fields[$key])) {
        $service = trim((string) $fields[$key]);
        break;
    }
}
if ($service === '') {
    $service = $pageName !== '' ? $pageName : 'Website Inquiry';
}
$fields['service'] = $service;

$destination = '';
foreach ($destinationKeys as $key) {
    if (!empty($fields[$key])) {
        $destination = trim((string) $fields[$key]);
        break;
    }
}
if ($destination !== '') {
    $fields['destination'] = $destination;
}

// If validation errors, return JSON error
if (!empty($errors)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => implode('. ', $errors)]);
    exit;
}

$customerEmail = $email;
$customerName = $name;

// Function to send email via Brevo API
function sendBrevoEmail($apiKey, $toEmail, $toName, $subject, $htmlContent, $replyTo = null) {
    $data = [
        'sender' => [
            'name' => 'Kenya Tradex',
            'email' => 'info@kenyatradex.africa'
        ],
        'to' => [
            [
                'email' => $toEmail,
                'name' => $toName
            ]
        ],
        'subject' => $subject,
        'htmlContent' => $htmlContent
    ];
    
    if ($replyTo) {
        $data['replyTo'] = [
            'email' => $replyTo,
            'name' => $toName
        ];
    }
    
    $jsonData = json_encode($data);
    
    if (function_exists('curl_init')) {
        $ch = curl_init('https://api.brevo.com/v3/smtp/email');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'api-key: ' . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true, 'response' => $response];
        }
        
        error_log("Brevo cURL Error: HTTP $httpCode - Response: $response - Error: $error");
        return ['success' => false, 'error' => "HTTP $httpCode: $response"];
    }
    
    // Fallback
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\napi-key: $apiKey\r\n",
            'content' => $jsonData,
            'timeout' => 30,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents('https://api.brevo.com/v3/smtp/email', false, $context);
    
    if ($response !== false) {
        $result = json_decode($response, true);
        if (isset($result['messageId'])) {
            return ['success' => true, 'response' => $response];
        }
    }
    
    return ['success' => false, 'error' => 'Failed to send email'];
}

// Build HTML for owner email
$ownerSubject = $pageName . ' | Kenya Tradex Inquiry';
$ownerHtml = '<html><body style="font-family: Arial, sans-serif; color: #333;">'
    . '<h2 style="color: #0B1A33;">New website inquiry received</h2>'
    . '<table style="border-collapse: collapse; width: 100%; max-width: 600px;">';

foreach ($fields as $key => $value) {
    $label = ucwords(str_replace(['_', '-'], ' ', $key));
    $ownerHtml .= '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">' . htmlspecialchars($label) . ':</td>'
        . '<td style="padding: 8px; border-bottom: 1px solid #eee;">' . htmlspecialchars($value) . '</td></tr>';
}

$ownerHtml .= '</table></body></html>';

// Send email to Kenya Tradex (owner)
$ownerResult = sendBrevoEmail($brevoApiKey, $recipient, 'Kenya Tradex', $ownerSubject, $ownerHtml, $customerEmail);

// Send auto-reply to customer
if (filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    $safeCustomerName = htmlspecialchars($customerName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $autoReplySubject = 'Kenya Tradex: Inquiry Received';
    
    $autoReplyHtml = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: #0B1A33; padding: 24px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Kenya Tradex</h1>
                            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Freight Forwarding & Logistics</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 24px;">
                            <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 1.6;">Dear ' . $safeCustomerName . ',</p>
                            <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 1.6;">Thank you for contacting Kenya Tradex.</p>
                            <p style="margin: 0 0 24px; color: #333333; font-size: 16px; line-height: 1.6;">We have received your inquiry and our team is reviewing it. We will get back to you shortly.</p>
                            <p style="margin: 0 0 24px; color: #333333; font-size: 16px; line-height: 1.6;">In the meantime, feel free to reach us directly:</p>
                            <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                                <tr>
                                    <td style="padding: 12px 16px; background-color: #f8fafc; border-radius: 6px;">
                                        <p style="margin: 0; color: #555555; font-size: 14px;"><strong style="color: #0B1A33;">Phone:</strong> <a href="tel:+254721596259" style="color: #C62828; text-decoration: none;">+254 721 596 259</a></p>
                                        <p style="margin: 8px 0 0; color: #555555; font-size: 14px;"><strong style="color: #0B1A33;">Email:</strong> <a href="mailto:info@kenyatradex.africa" style="color: #C62828; text-decoration: none;">info@kenyatradex.africa</a></p>
                                        <p style="margin: 8px 0 0; color: #555555; font-size: 14px;"><strong style="color: #0B1A33;">Website:</strong> <a href="https://kenyatradex.africa" style="color: #C62828; text-decoration: none;">kenyatradex.africa</a></p>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0 0 24px; color: #333333; font-size: 16px; line-height: 1.6;">Thank you for considering Kenya Tradex as your logistics partner.</p>
                            <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">Kind regards,<br><strong style="color: #0B1A33;">Kenya Tradex Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center;">
                            <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.6;">
                                Kenya Tradex | Mombasa, Kenya<br>
                                <a href="https://kenyatradex.africa" style="color: #C62828; text-decoration: none;">kenyatradex.africa</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
    
    sendBrevoEmail($brevoApiKey, $customerEmail, $safeCustomerName, $autoReplySubject, $autoReplyHtml);
}

// Check result and respond
if ($ownerResult['success']) {
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
}

// Log the error
error_log("Kenya Tradex Form Error: " . json_encode($ownerResult));

http_response_code(500);
header('Content-Type: application/json');
echo json_encode(['success' => false, 'error' => 'Failed to send email. Please try again.']);
exit;

<?php
// ⚠️  UNUSED FILE - This contact form is not active on the website
// The main website uses direct email links instead of form submissions
// This file is kept for reference only and can be safely deleted

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Please fill out all required fields.";
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid email format.";
        exit;
    }

    // Set up email
    $to = "website@daniel-hackl.com";

    // Create email subject
    $email_subject = "Website Contact Form: " . $subject;
    if (empty($subject)) {
        $email_subject = "Website Contact Form: New Message";
    }

    // Create email message
    $email_body = "You have received a new message from your website contact form.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";

    // Set email headers
    $headers = "From: noreply@daniel-hackl.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send the email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Return success with 200 status code
        http_response_code(200);
        echo "Your message has been sent successfully!";
    } else {
        // Return error with 500 status code
        http_response_code(500);
        echo "There was a problem sending the email. Please try again later.";
    }
} else {
    http_response_code(405);
    echo "Invalid request method.";
}
?>
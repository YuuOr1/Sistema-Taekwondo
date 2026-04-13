<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP (datos de Mailtrap)
    $mail->isSMTP();
    $mail->Host       = 'sandbox.smtp.mailtrap.io'; // Reemplaza con tu Host de Mailtrap
    $mail->SMTPAuth   = true;
    $mail->Username   = 'TU_USERNAME';               // Reemplaza con tu Username
    $mail->Password   = 'TU_PASSWORD';               // Reemplaza con tu Password
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 2525;                        // Reemplaza con tu Port

    // Remitente y destinatario
    $mail->setFrom('from@example.com', 'Sistema Taekwondo');
    $mail->addAddress('destinatario@example.com');

    // Contenido del correo
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->Subject = 'Correo de prueba';
    $mail->Body    = '<h1>Hola!</h1><p>Este es un correo de prueba desde PHPMailer.</p>';

    $mail->send();
    echo 'Correo enviado correctamente';

} catch (Exception $e) {
    echo "Error al enviar: {$mail->ErrorInfo}";
}

TransportFactory::setConfig('mailtrap', [
    'host' => 'sandbox.smtp.mailtrap.io',
    'port' => 2525,
    'username' => '7dd67096fb549c',
    'password' => '37189c3ebb4475',
    'className' => 'Smtp'
]);
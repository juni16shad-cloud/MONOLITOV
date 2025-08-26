<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = htmlspecialchars(trim($_POST["name"]));
    $contact = htmlspecialchars(trim($_POST["contact"]));
    
    // Настройки письма
    $to = "juni16shad@gmail.com";
    $subject = "Новая заявка с сайта";
    $message = "Имя: $name\nКонтакт: $contact\n\nДата: " . date('d.m.Y H:i');
    $headers = "From: webmaster@site.com\r\n";
    $headers .= "Reply-To: $contact\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Отправляем письмо
    if (mail($to, $subject, $message, $headers)) {
        header("Location: success.html");
        exit;
    } else {
        header("Location: error.html");
        exit;
    }
}
?>
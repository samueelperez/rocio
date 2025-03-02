<?php
// Iniciar sesión si no está iniciada
function start_session_if_not_started() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

// Función para verificar si el usuario está autenticado
function is_authenticated() {
    start_session_if_not_started();
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Función para verificar si el usuario es administrador
function is_admin() {
    start_session_if_not_started();
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

// Función para redirigir si no está autenticado
function require_authentication() {
    if (!is_authenticated()) {
        header('Location: /');
        exit;
    }
}

// Función para redirigir si no es administrador
function require_admin() {
    require_authentication();
    if (!is_admin()) {
        header('Location: /afiliados/dashboard.html');
        exit;
    }
}

// Función para sanitizar entradas
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Función para generar un hash seguro de contraseña
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Función para verificar una contraseña
function verify_password($password, $hash) {
    return password_verify($password, $hash);
}
?> 
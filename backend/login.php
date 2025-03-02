<?php
require_once 'config/db.php';
require_once 'includes/functions.php';

// Iniciar sesión
start_session_if_not_started();

// Verificar si ya está autenticado
if (is_authenticated()) {
    header('Location: /afiliados/dashboard.html');
    exit;
}

// Procesar el formulario de login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validar que los campos no estén vacíos
    if (empty($username) || empty($password)) {
        $_SESSION['login_error'] = 'Por favor, completa todos los campos.';
        header('Location: /');
        exit;
    }
    
    try {
        // Buscar el usuario en la base de datos
        $stmt = $pdo->prepare('SELECT id, username, password, is_admin FROM users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        // Verificar si el usuario existe y la contraseña es correcta
        if ($user && verify_password($password, $user['password'])) {
            // Guardar información del usuario en la sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['is_admin'] = (bool)$user['is_admin'];
            
            // Redirigir al dashboard
            header('Location: /afiliados/dashboard.html');
            exit;
        } else {
            // Credenciales incorrectas
            $_SESSION['login_error'] = 'Usuario o contraseña incorrectos.';
            header('Location: /');
            exit;
        }
    } catch (PDOException $e) {
        // Error de base de datos
        $_SESSION['login_error'] = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
        // En producción, registrar el error en un archivo de log
        error_log('Error en login.php: ' . $e->getMessage());
        header('Location: /');
        exit;
    }
} else {
    // Si no es una solicitud POST, redirigir a la página principal
    header('Location: /');
    exit;
}
?> 
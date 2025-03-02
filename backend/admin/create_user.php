<?php
require_once '../config/db.php';
require_once '../includes/functions.php';

// Verificar que el usuario sea administrador
require_admin();

// Procesar el formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
    $is_admin = isset($_POST['is_admin']) ? 1 : 0;
    
    // Validar que los campos no estén vacíos
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $_SESSION['create_error'] = 'Por favor, completa todos los campos.';
        header('Location: index.php');
        exit;
    }
    
    // Validar que las contraseñas coincidan
    if ($password !== $confirm_password) {
        $_SESSION['create_error'] = 'Las contraseñas no coinciden.';
        header('Location: index.php');
        exit;
    }
    
    try {
        // Verificar si el usuario ya existe
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
        $stmt->execute([$username]);
        
        if ($stmt->fetch()) {
            $_SESSION['create_error'] = 'El nombre de usuario ya está en uso.';
            header('Location: index.php');
            exit;
        }
        
        // Crear el nuevo usuario
        $hashed_password = hash_password($password);
        
        $stmt = $pdo->prepare('INSERT INTO users (username, password, is_admin, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$username, $hashed_password, $is_admin]);
        
        $_SESSION['create_success'] = 'Usuario creado correctamente.';
        header('Location: index.php');
        exit;
        
    } catch (PDOException $e) {
        $_SESSION['create_error'] = 'Error al crear el usuario.';
        error_log('Error en create_user.php: ' . $e->getMessage());
        header('Location: index.php');
        exit;
    }
} else {
    // Si no es una solicitud POST, redirigir al panel de administración
    header('Location: index.php');
    exit;
}
?> 
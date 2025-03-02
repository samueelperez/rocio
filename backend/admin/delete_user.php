<?php
require_once '../config/db.php';
require_once '../includes/functions.php';

// Verificar que el usuario sea administrador
require_admin();

// Obtener el ID del usuario a eliminar
$user_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($user_id <= 0) {
    header('Location: index.php');
    exit;
}

// No permitir eliminar el propio usuario
if ($user_id == $_SESSION['user_id']) {
    $_SESSION['delete_error'] = 'No puedes eliminar tu propio usuario.';
    header('Location: index.php');
    exit;
}

try {
    // Eliminar el usuario
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$user_id]);
    
    $_SESSION['delete_success'] = 'Usuario eliminado correctamente.';
} catch (PDOException $e) {
    $_SESSION['delete_error'] = 'Error al eliminar el usuario.';
    error_log('Error en delete_user.php: ' . $e->getMessage());
}

// Redirigir al panel de administración
header('Location: index.php');
exit;
?> 
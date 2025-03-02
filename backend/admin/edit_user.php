<?php
require_once '../config/db.php';
require_once '../includes/functions.php';

// Verificar que el usuario sea administrador
require_admin();

// Obtener el ID del usuario a editar
$user_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($user_id <= 0) {
    header('Location: index.php');
    exit;
}

// Procesar el formulario de edición
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? sanitize_input($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $is_admin = isset($_POST['is_admin']) ? 1 : 0;
    
    // Validar que el nombre de usuario no esté vacío
    if (empty($username)) {
        $error = 'El nombre de usuario no puede estar vacío.';
    } else {
        try {
            // Verificar si el nombre de usuario ya existe (excluyendo el usuario actual)
            $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? AND id != ?');
            $stmt->execute([$username, $user_id]);
            
            if ($stmt->fetch()) {
                $error = 'El nombre de usuario ya está en uso.';
            } else {
                // Actualizar el usuario
                if (!empty($password)) {
                    // Si se proporcionó una nueva contraseña, actualizarla también
                    $hashed_password = hash_password($password);
                    $stmt = $pdo->prepare('UPDATE users SET username = ?, password = ?, is_admin = ? WHERE id = ?');
                    $stmt->execute([$username, $hashed_password, $is_admin, $user_id]);
                } else {
                    // Si no se proporcionó una nueva contraseña, mantener la actual
                    $stmt = $pdo->prepare('UPDATE users SET username = ?, is_admin = ? WHERE id = ?');
                    $stmt->execute([$username, $is_admin, $user_id]);
                }
                
                $_SESSION['edit_success'] = 'Usuario actualizado correctamente.';
                header('Location: index.php');
                exit;
            }
        } catch (PDOException $e) {
            $error = 'Error al actualizar el usuario.';
            error_log('Error en edit_user.php: ' . $e->getMessage());
        }
    }
}

// Obtener los datos del usuario
try {
    $stmt = $pdo->prepare('SELECT id, username, is_admin FROM users WHERE id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        header('Location: index.php');
        exit;
    }
} catch (PDOException $e) {
    $error = 'Error al obtener los datos del usuario.';
    error_log('Error en edit_user.php: ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Usuario - CCOO Burriana</title>
    <link rel="stylesheet" href="/src/styles.css">
    <link rel="stylesheet" href="/src/afiliados.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .admin-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background-color: var(--white);
            border-radius: 8px;
            box-shadow: var(--shadow);
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <header class="main-header">
        <div class="container header-container">
            <div class="logo-container">
                <a href="/" class="logo">
                    <img src="/assets/logo sección sindical ccoo burriana.png" alt="Logo CCOO Burriana">
                    <span>Comisiones Obreras Burriana</span>
                </a>
            </div>
            
            <nav class="main-nav">
                <button class="menu-toggle" aria-label="Abrir menú">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>
                
                <ul class="nav-links">
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/afiliados/dashboard.html">Panel de Afiliados</a></li>
                    <li><a href="/backend/logout.php" class="btn-secondary">Cerrar Sesión</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="admin-container">
        <div class="admin-header">
            <h1>Editar Usuario</h1>
            <a href="index.php" class="btn-secondary">Volver al Panel</a>
        </div>
        
        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <form action="edit_user.php?id=<?php echo $user['id']; ?>" method="post">
            <div class="form-group">
                <label for="username">Nombre de Usuario</label>
                <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="password">Nueva Contraseña (dejar en blanco para mantener la actual)</label>
                <input type="password" id="password" name="password">
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="is_admin" value="1" <?php echo $user['is_admin'] ? 'checked' : ''; ?>>
                    Es administrador
                </label>
            </div>
            
            <button type="submit" class="btn-primary">Guardar Cambios</button>
        </form>
    </div>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="/assets/logo sección sindical ccoo burriana.png" alt="Logo CCOO Burriana">
                    <p>Comisiones Obreras Burriana</p>
                </div>
                <div class="footer-links">
                    <h4>Enlaces rápidos</h4>
                    <ul>
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/afiliados/dashboard.html">Panel de Afiliados</a></li>
                    </ul>
                </div>
                <div class="footer-contact">
                    <h4>Contacto</h4>
                    <p><i class="fas fa-map-marker-alt"></i> Calle Principal 123, Burriana</p>
                    <p><i class="fas fa-phone"></i> +34 912 345 678</p>
                    <p><i class="fas fa-envelope"></i> info@ccooburriana.org</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 Comisiones Obreras Burriana. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
</body>
</html> 
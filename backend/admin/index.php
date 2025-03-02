<?php
require_once '../config/db.php';
require_once '../includes/functions.php';

// Verificar que el usuario sea administrador
require_admin();

// Obtener la lista de usuarios
try {
    $stmt = $pdo->query('SELECT id, username, is_admin, created_at FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = 'Error al obtener la lista de usuarios.';
    error_log('Error en admin/index.php: ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - CCOO Burriana</title>
    <link rel="stylesheet" href="/src/styles.css">
    <link rel="stylesheet" href="/src/afiliados.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .admin-container {
            max-width: 1000px;
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
        
        .users-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .users-table th, .users-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--gray-light);
        }
        
        .users-table th {
            background-color: var(--background-light);
            font-weight: 600;
        }
        
        .users-table tr:hover {
            background-color: var(--gray-light);
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
        }
        
        .btn-small {
            padding: 6px 12px;
            font-size: 0.8rem;
        }
        
        .btn-danger {
            background-color: #dc3545;
            color: var(--white);
        }
        
        .btn-danger:hover {
            background-color: #c82333;
        }
        
        .create-user-form {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid var(--gray-light);
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
            <h1>Panel de Administración</h1>
            <a href="/afiliados/dashboard.html" class="btn-secondary">Volver al Dashboard</a>
        </div>
        
        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <h2>Gestión de Usuarios</h2>
        
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                <tr>
                    <td><?php echo $user['id']; ?></td>
                    <td><?php echo htmlspecialchars($user['username']); ?></td>
                    <td><?php echo $user['is_admin'] ? 'Administrador' : 'Afiliado'; ?></td>
                    <td><?php echo date('d/m/Y H:i', strtotime($user['created_at'])); ?></td>
                    <td class="action-buttons">
                        <a href="edit_user.php?id=<?php echo $user['id']; ?>" class="btn-primary btn-small">Editar</a>
                        <?php if ($user['id'] != $_SESSION['user_id']): ?>
                        <a href="delete_user.php?id=<?php echo $user['id']; ?>" class="btn-danger btn-small" onclick="return confirm('¿Estás seguro de que deseas eliminar este usuario?')">Eliminar</a>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <div class="create-user-form">
            <h2>Crear Nuevo Usuario</h2>
            
            <?php if (isset($_SESSION['create_error'])): ?>
                <div class="error-message"><?php echo $_SESSION['create_error']; unset($_SESSION['create_error']); ?></div>
            <?php endif; ?>
            
            <?php if (isset($_SESSION['create_success'])): ?>
                <div class="success-message"><?php echo $_SESSION['create_success']; unset($_SESSION['create_success']); ?></div>
            <?php endif; ?>
            
            <form action="create_user.php" method="post">
                <div class="form-group">
                    <label for="new_username">Nombre de Usuario</label>
                    <input type="text" id="new_username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="new_password">Contraseña</label>
                    <input type="password" id="new_password" name="password" required>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirmar Contraseña</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="is_admin" value="1">
                        Es administrador
                    </label>
                </div>
                
                <button type="submit" class="btn-primary">Crear Usuario</button>
            </form>
        </div>
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
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ccoo_burriana CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE ccoo_burriana;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar un usuario administrador por defecto
-- Contraseña: admin123
INSERT INTO users (username, password, is_admin, created_at) VALUES 
('admin', '$2y$10$YourHashedPasswordHere', 1, NOW()); 
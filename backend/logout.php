<?php
require_once 'includes/functions.php';

// Iniciar sesión
start_session_if_not_started();

// Destruir la sesión
session_unset();
session_destroy();

// Redirigir a la página principal
header('Location: /');
exit;
?> 
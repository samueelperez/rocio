document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si el usuario ya está autenticado
    checkAuthentication();
    
    // Manejar el formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // En un entorno real, esto se haría con una petición AJAX a un servidor
            // Para este ejemplo, usamos usuarios hardcodeados
            if (authenticateUser(username, password)) {
                // Guardar la sesión
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('username', username);
                
                // Redirigir al dashboard
                window.location.href = '/afiliados/dashboard.html';
            } else {
                // Mostrar error
                document.getElementById('login-error').style.display = 'block';
            }
        });
    }
    
    // Manejar el botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Limpiar la sesión
            sessionStorage.removeItem('authenticated');
            sessionStorage.removeItem('username');
            
            // Redirigir al login
            window.location.href = '/afiliados/';
        });
    }
    
    // Mostrar el nombre de usuario en el dashboard
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        const username = sessionStorage.getItem('username');
        if (username) {
            userDisplayName.textContent = `Bienvenido/a, ${username}`;
        }
    }
});

// Función para comprobar si el usuario está autenticado
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    const currentPath = window.location.pathname;
    
    // Si estamos en el dashboard y no está autenticado, redirigir al login
    if (currentPath.includes('/dashboard') && !isAuthenticated) {
        window.location.href = '/afiliados/';
    }
    
    // Si estamos en el login y ya está autenticado, redirigir al dashboard
    if (currentPath === '/afiliados/' && isAuthenticated) {
        window.location.href = '/afiliados/dashboard.html';
    }
}

// Función para autenticar al usuario
function authenticateUser(username, password) {
    // En un entorno real, esto se haría con una petición al servidor
    // Para este ejemplo, usamos usuarios hardcodeados
    const validUsers = [
        { username: 'admin', password: 'admin123' },
        { username: 'usuario1', password: 'password1' },
        { username: 'usuario2', password: 'password2' }
    ];
    
    return validUsers.some(user => 
        user.username === username && user.password === password
    );
} 
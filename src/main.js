import './script.js'

document.addEventListener('DOMContentLoaded', function() {
    // Toggle menu en móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animar las barras del menú
            const bars = menuToggle.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }
    
    // Toggle búsqueda
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', function() {
            searchForm.classList.toggle('active');
        });
        
        // Cerrar búsqueda al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!searchToggle.contains(event.target) && !searchForm.contains(event.target)) {
                searchForm.classList.remove('active');
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                
                // Restaurar barras del menú
                const bars = menuToggle.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.remove('active'));
            }
        });
    });

    // Login para Afiliados
    const loginSection = document.getElementById('loginSection');
    const loginToggleBtn = document.getElementById('loginToggleBtn');
    const closeLogin = document.querySelector('.close-login');
    const loginForm = document.getElementById('login-form');

    if (loginToggleBtn && loginSection) {
        // Mostrar formulario de login
        loginToggleBtn.addEventListener('click', function() {
            loginSection.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        });

        // Cerrar formulario al hacer clic en la X
        if (closeLogin) {
            closeLogin.addEventListener('click', function() {
                loginSection.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            });
        }

        // Cerrar formulario al hacer clic fuera del contenido
        loginSection.addEventListener('click', function(event) {
            if (event.target === loginSection) {
                loginSection.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
    }

    // Manejar envío del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Usuarios de prueba
            const validUsers = [
                { username: 'admin', password: 'admin123' },
                { username: 'usuario1', password: 'password1' },
                { username: 'usuario2', password: 'password2' }
            ];
            
            // Verificar credenciales
            const isValid = validUsers.some(user => 
                user.username === username && user.password === password
            );
            
            if (isValid) {
                // Guardar sesión
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('username', username);
                
                // Redirigir al dashboard
                window.location.href = './afiliados/dashboard.html';
            } else {
                // Mostrar error
                document.getElementById('login-error').style.display = 'block';
            }
        });
    }

    // Verificar si el usuario ya está autenticado
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated && window.location.pathname === '/') {
        // Si está en la página principal y ya está autenticado, mostrar un botón para ir al dashboard
        if (loginToggleBtn) {
            loginToggleBtn.textContent = 'Ir a Mi Panel';
            loginToggleBtn.addEventListener('click', function() {
                window.location.href = './afiliados/dashboard.html';
            }, { once: true }); // Sobrescribir el evento anterior
        }
    }
});

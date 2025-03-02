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

    // Modal de Afiliados
    const modal = document.getElementById('afiliadosModal');
    const btn = document.getElementById('afiliadosBtn');
    const span = document.getElementsByClassName('close-modal')[0];

    if (btn && modal && span) {
        // Abrir modal al hacer clic en el botón
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
        });

        // Cerrar modal al hacer clic en la X
        span.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
        });

        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
    }
});

const nombreCorrecto = 'rocio';

function verificarNombre() {
    const nombreIngresado = document.getElementById('nombreInput').value.toLowerCase().trim();
    
    if (nombreIngresado === nombreCorrecto) {
        agregarCorazonesFlotantes();
        document.getElementById('verificacion').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('verificacion').style.display = 'none';
            document.getElementById('contador').style.display = 'block';
            setTimeout(() => {
                document.getElementById('contador').style.opacity = '1';
                iniciarContador();
            }, 100);
        }, 1000);
    } else {
        sacudirInput();
        Swal.fire({
            title: '💔 Lo siento...',
            text: 'Esta página es solo para una personita especial',
            icon: 'error',
            confirmButtonText: 'Entiendo',
            confirmButtonColor: '#ff6b6b'
        });
    }
}

function sacudirInput() {
    const input = document.getElementById('nombreInput');
    input.style.animation = 'sacudir 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function agregarCorazonesFlotantes() {
    for (let i = 0; i < 5; i++) {
        const corazon = document.createElement('div');
        corazon.innerHTML = '❤️';
        corazon.className = 'corazon-flotante';
        corazon.style.left = `${Math.random() * 80 + 10}%`;
        corazon.style.top = `${Math.random() * 80 + 10}%`;
        corazon.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(corazon);
        
        setTimeout(() => {
            corazon.remove();
        }, 3000);
    }
}

function iniciarContador() {
    fetch('/.netlify/functions/contador')
        .then(response => response.json())
        .then(data => {
            if (!data.fecha_final) {
                const fechaInicio = new Date();
                const tiempoTotal = 
                    (4 * 24 * 60 * 60 * 1000) +  // 4 días
                    (23 * 60 * 60 * 1000) +      // 23 horas
                    (4 * 60 * 1000);             // 4 minutos
                
                const fechaFinal = fechaInicio.getTime() + tiempoTotal;
                
                return fetch('/.netlify/functions/contador', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fechaFinal: fechaFinal
                    })
                });
            }
            return Promise.resolve(data);
        })
        .then((data) => {
            if (data.fecha_final) {
                iniciarActualizacionContador();
            }
        })
        .catch(error => {
            console.error("Error al iniciar contador:", error);
        });
}

function iniciarActualizacionContador() {
    function actualizarContador() {
        fetch('/.netlify/functions/contador')
            .then(response => response.json())
            .then(data => {
                if (data.fecha_final) {
                    const fechaFinal = data.fecha_final;
                    const ahora = new Date().getTime();
                    const diferencia = fechaFinal - ahora;
                    
                    if (diferencia <= 0) {
                        clearInterval(intervalo);
                        fetch('/.netlify/functions/contador', {
                            method: 'DELETE'
                        });
                        mostrarPreguntaFinal();
                        return;
                    }

                    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
                    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
                    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
                    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
                }
            })
            .catch(error => {
                console.error("Error al actualizar contador:", error);
            });
    }

    actualizarContador(); // Ejecutar inmediatamente
    const intervalo = setInterval(actualizarContador, 1000);
}

function mostrarPreguntaFinal() {
    document.getElementById('contador').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('contador').style.display = 'none';
        document.getElementById('pregunta').style.display = 'block';
        setTimeout(() => {
            document.getElementById('pregunta').style.opacity = '1';
            agregarCorazonesFlotantes();
        }, 100);
    }, 1000);
}

function verificarRespuesta() {
    const respuesta = document.getElementById('respuesta').value.toLowerCase().trim();
    const respuestasCorrectas = ['si', 'sí', 'yes', 'claro', 'por supuesto'];

    if (respuestasCorrectas.includes(respuesta)) {
        document.getElementById('pregunta').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('pregunta').style.display = 'none';
            document.getElementById('segundaPantalla').style.display = 'block';
            setTimeout(() => {
                document.getElementById('segundaPantalla').style.opacity = '1';
                crearCorazones();
                crearBrillo();
            }, 100);
        }, 1000);
    } else {
        sacudirInput();
        Swal.fire({
            title: '💔 ¿Estás segura?',
            text: '¡Piénsalo bien, mi amor!',
            icon: 'question',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#ff6b6b'
        });
    }
}

// Actualizar la verificación al cargar la página
window.addEventListener('load', () => {
    fetch('/.netlify/functions/contador')
        .then(response => response.json())
        .then(data => {
            if (data.fecha_final) {
                const ahora = new Date().getTime();
                const diferencia = data.fecha_final - ahora;
                
                if (diferencia > 0) {
                    document.getElementById('verificacion').style.display = 'none';
                    document.getElementById('contador').style.display = 'block';
                    document.getElementById('contador').style.opacity = '1';
                    iniciarActualizacionContador();
                } else {
                    fetch('/.netlify/functions/contador', {
                        method: 'DELETE'
                    });
                    mostrarPreguntaFinal();
                }
            }
        })
        .catch(error => {
            console.error("Error al verificar contador:", error);
        });
});

// Funciones de efectos visuales
function crearBrillo() {
    const esMovil = window.innerWidth <= 414;
    const esTablet = window.innerWidth <= 1024 && window.innerWidth > 414;
    const cantidadBrillos = esMovil ? 15 : (esTablet ? 20 : 30);

    for (let i = 0; i < cantidadBrillos; i++) {
        const brillo = document.createElement('div');
        brillo.innerHTML = '✨';
        brillo.style.position = 'fixed';
        brillo.style.left = Math.random() * 100 + 'vw';
        brillo.style.top = Math.random() * 100 + 'vh';
        brillo.style.animation = `brillar ${Math.random() * 2 + 1}s infinite`;
        brillo.style.fontSize = esMovil ? '14px' : (esTablet ? '16px' : '18px');
        document.body.appendChild(brillo);
    }
}

function crearCorazones() {
    const esMovil = window.innerWidth <= 414;
    const esTablet = window.innerWidth <= 1024 && window.innerWidth > 414;
    const cantidadCorazones = esMovil ? 20 : (esTablet ? 35 : 50);

    for (let i = 0; i < cantidadCorazones; i++) {
        const corazon = document.createElement('div');
        corazon.innerHTML = '❤️';
        corazon.style.position = 'fixed';
        corazon.style.left = Math.random() * 100 + 'vw';
        corazon.style.animationDuration = Math.random() * 3 + 2 + 's';
        corazon.style.opacity = Math.random();
        const tamanoBase = esMovil ? 15 : (esTablet ? 18 : 20);
        corazon.style.fontSize = Math.random() * tamanoBase + 10 + 'px';
        corazon.style.animation = 'caida ' + (Math.random() * 3 + 2) + 's linear infinite';
        document.body.appendChild(corazon);
    }
}

// Estilos de animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes caida {
        0% { transform: translateY(-100vh) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
    }

    @keyframes sacudir {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    .container {
        opacity: 1;
        transition: opacity 1s ease;
    }

    #pregunta, #segundaPantalla {
        opacity: 0;
        transition: opacity 1s ease;
    }
`;
document.head.appendChild(styleSheet);

// Ajustes para móviles
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        ajustarAlturaVH();
    }, 200);
});

function ajustarAlturaVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

ajustarAlturaVH();

// Al inicio del archivo
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnVerificar')
        .addEventListener('click', verificarNombre);
    
    document.getElementById('btnResponder')
        .addEventListener('click', verificarRespuesta);
}); 
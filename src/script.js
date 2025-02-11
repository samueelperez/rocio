const nombreCorrecto = 'rocio';

function verificarNombre() {
    const nombreIngresado = document.getElementById('nombreInput').value.toLowerCase().trim();
    
    if (nombreIngresado === nombreCorrecto) {
        // Guardar que ya ha visitado la página
        localStorage.setItem('yaHaVisitado', 'true');
        
        agregarCorazonesFlotantes();
        document.getElementById('verificacion').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('verificacion').style.display = 'none';
            document.getElementById('contador').style.display = 'block';
            setTimeout(() => {
                document.getElementById('contador').style.opacity = '1';
                if (window.contadorActivo) {
                    iniciarActualizacionContador();
                } else {
                    iniciarContador();
                }
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
    console.log('Iniciando contador...');
    fetch('/.netlify/functions/contador')
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            if (!data || !data.fecha_final) {
                const fechaInicio = new Date();
                const tiempoTotal = 
                    (4 * 24 * 60 * 60 * 1000) + // 4 días
                    (20 * 60 * 60 * 1000);      // 20 horas
                
                const fechaFinal = fechaInicio.getTime() + tiempoTotal;
                
                console.log('Creando nuevo contador para:', new Date(fechaFinal));
                return fetch('/.netlify/functions/contador', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fechaFinal: fechaFinal
                    })
                }).then(response => response.json());
            }
            return data;
        })
        .then((data) => {
            console.log('Datos finales:', data);
            if (data && (data.fecha_final || (data.data && data.data.fecha_final))) {
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
                console.log('Actualizando contador:', data);
                const fechaFinal = data.fecha_final || (data.data && data.data.fecha_final);
                
                if (fechaFinal) {
                    const ahora = new Date().getTime();
                    const diferencia = fechaFinal - ahora;
                    
                    console.log('Diferencia:', diferencia);
                    
                    if (diferencia <= 0) {
                        console.log('Contador terminado');
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

                    console.log(`Tiempo restante: ${dias}:${horas}:${minutos}:${segundos}`);

                    // Agregar efectos visuales cada hora y cuando quedan pocos minutos
                    if (minutos === 0 && segundos === 0) {
                        agregarCorazonesFlotantes();
                    }
                    
                    // Efecto especial en los últimos 5 minutos
                    if (dias === 0 && horas === 0 && minutos <= 5) {
                        document.body.style.animation = 'latido 1s infinite';
                    }

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

    console.log('Iniciando actualización del contador');
    actualizarContador();
    const intervalo = setInterval(actualizarContador, 1000);
    
    // Iniciar la lluvia de corazones
    const lluviaIntervalo = crearLluviaConstante();
    
    // Guardar el intervalo de la lluvia para poder detenerlo si es necesario
    window.lluviaIntervalo = lluviaIntervalo;
    
    return intervalo;
}

function mostrarPreguntaFinal() {
    if (window.lluviaIntervalo) {
        clearInterval(window.lluviaIntervalo);
    }
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
    const yaHaVisitado = localStorage.getItem('yaHaVisitado');
    
    fetch('/.netlify/functions/contador')
        .then(response => response.json())
        .then(data => {
            const fechaFinal = data.fecha_final || (data.data && data.data.fecha_final);
            
            if (fechaFinal) {
                const ahora = new Date().getTime();
                const diferencia = fechaFinal - ahora;
                
                if (diferencia <= 0) {
                    fetch('/.netlify/functions/contador', {
                        method: 'DELETE'
                    });
                    mostrarPreguntaFinal();
                } else {
                    window.contadorActivo = true;
                    // Si ya ha visitado antes, mostrar el contador directamente
                    if (yaHaVisitado) {
                        document.getElementById('verificacion').style.display = 'none';
                        document.getElementById('contador').style.display = 'block';
                        document.getElementById('contador').style.opacity = '1';
                        iniciarActualizacionContador();
                    }
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

// Función para crear la lluvia de corazones
function crearLluviaConstante() {
    const emojis = ['❤️', '💝', '💖', '💗'];
    
    function crearCorazon() {
        const corazon = document.createElement('div');
        corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        corazon.className = 'corazon-lluvia';
        corazon.style.left = `${Math.random() * 100}vw`;
        corazon.style.animationDuration = `${Math.random() * 3 + 4}s`; // Entre 4 y 7 segundos
        corazon.style.opacity = (Math.random() * 0.4 + 0.1).toString(); // Opacidad entre 0.1 y 0.5
        corazon.style.fontSize = `${Math.random() * 15 + 10}px`; // Tamaño entre 10px y 25px
        document.body.appendChild(corazon);

        // Eliminar el corazón después de que termine la animación
        corazon.addEventListener('animationend', () => {
            corazon.remove();
        });
    }

    // Crear un nuevo corazón cada 300ms
    return setInterval(crearCorazon, 300);
}

// Agregar los estilos necesarios
const styleSheet = document.createElement('style');
styleSheet.textContent += `
    .corazon-lluvia {
        position: fixed;
        top: -20px;
        z-index: -1;
        pointer-events: none;
        animation: caerLento linear forwards;
    }

    @keyframes caerLento {
        0% {
            transform: translateY(-20px) rotate(0deg);
        }
        100% {
            transform: translateY(120vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(styleSheet);

// Estilos de animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes latido {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

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
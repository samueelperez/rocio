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
    const cantidadCorazones = 8;
    let corazonesCreados = 0;

    function crearCorazon() {
        const corazon = document.createElement('div');
        corazon.innerHTML = '❤️';
        corazon.className = 'corazon-flotante';
        corazon.style.left = `${Math.random() * 80 + 10}%`;
        corazon.style.bottom = '-50px';
        corazon.style.opacity = '0';
        document.body.appendChild(corazon);

        setTimeout(() => {
            corazon.style.opacity = '1';
            corazon.style.transform = `translateY(-${Math.random() * 50 + 100}vh) rotate(${Math.random() * 360}deg)`;
            
            setTimeout(() => {
                corazon.style.opacity = '0';
                setTimeout(() => corazon.remove(), 1000);
            }, 2000);
        }, 50);

        corazonesCreados++;
        if (corazonesCreados < cantidadCorazones) {
            setTimeout(crearCorazon, Math.random() * 300);
        }
    }

    crearCorazon();
}

function iniciarContador() {
    console.log('Iniciando contador...');
    fetch('/.netlify/functions/contador')
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            if (!data || !data.fecha_final) {
                const fechaInicio = new Date();
                const tiempoTotal = 9; // 9 segundos
                
                console.log('Iniciando contador de', tiempoTotal, 'segundos');
                return fetch('/.netlify/functions/contador', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tiempoTotal: tiempoTotal
                    })
                }).then(response => response.json());
            }
            return data;
        })
        .then((data) => {
            console.log('Datos finales:', data);
            if (data && (data.segundos_restantes || (data.data && data.data.segundos_restantes))) {
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
                const datos = data.data || data;
                
                if (datos.fecha_inicio && datos.segundos_restantes) {
                    const ahora = new Date().getTime();
                    const tiempoTranscurrido = (ahora - datos.fecha_inicio) / 1000;
                    const segundosRestantes = datos.segundos_restantes - tiempoTranscurrido;
                    
                    console.log('Segundos restantes:', segundosRestantes);
                    
                    if (segundosRestantes <= 0) {
                        console.log('Contador terminado');
                        clearInterval(intervalo);
                        fetch('/.netlify/functions/contador', {
                            method: 'DELETE'
                        });
                        mostrarPreguntaFinal();
                        return;
                    }

                    const segundos = Math.max(0, Math.ceil(segundosRestantes));
                    const segundosMostrar = Math.min(9, segundos);

                    console.log(`Tiempo restante: ${segundos} segundos`);

                    document.getElementById('segundos').textContent = String(segundosMostrar).padStart(2, '0');
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
            setTimeout(() => {
                agregarCorazonesFlotantes();
            }, 500);
        }, 100);
    }, 1000);
}

function manejarRespuesta(respuesta) {
    document.getElementById('pregunta').style.opacity = '0';
  
    setTimeout(() => {
        document.getElementById('pregunta').style.display = 'none';
        const mensajeIntermedio = document.createElement('div');
        mensajeIntermedio.className = 'container mensaje-intermedio';
        mensajeIntermedio.style.opacity = '0';

        if (respuesta === 'si') {
            mensajeIntermedio.innerHTML = `
                <h2 class="texto-animado">Seguro que no era como yo... 😏</h2>
                <button id="btnContinuar" class="boton-respuesta">Continuar ❤️</button>
            `;
            document.body.appendChild(mensajeIntermedio);
            setTimeout(() => {
                mensajeIntermedio.style.opacity = '1';
                const btnContinuar = mensajeIntermedio.querySelector('#btnContinuar');
                btnContinuar.addEventListener('click', mostrarPropuesta);
            }, 100);
        } else {
            const primerMensaje = document.createElement('h2');
            primerMensaje.className = 'mensaje-flotante';
            primerMensaje.textContent = 'Pues yo tampoco te voy a pedir salir...';
            document.body.appendChild(primerMensaje);

            setTimeout(() => {
                primerMensaje.style.opacity = '1';

                setTimeout(() => {
                    primerMensaje.style.opacity = '0';
                    primerMensaje.style.transform = 'translateY(-20px)';

                    setTimeout(() => {
                        primerMensaje.remove();
                        const segundoMensaje = document.createElement('h2');
                        segundoMensaje.className = 'mensaje-flotante';
                        segundoMensaje.textContent = 'Pero voy a ser diferente...';
                        document.body.appendChild(segundoMensaje);

                        setTimeout(() => {
                            segundoMensaje.style.opacity = '1';

                            setTimeout(() => {
                                const contenedorBoton = document.createElement('div');
                                contenedorBoton.className = 'container-boton-carta';
                                contenedorBoton.innerHTML = `
                                    <button id="btnCarta" class="boton-respuesta">Carta Para Roro 💌</button>
                                `;
                                document.body.appendChild(contenedorBoton);

                                setTimeout(() => {
                                    contenedorBoton.style.opacity = '1';
                                    const btnCarta = contenedorBoton.querySelector('#btnCarta');
                                    btnCarta.addEventListener('click', () => {
                                        segundoMensaje.style.opacity = '0';
                                        contenedorBoton.style.opacity = '0';
                                        setTimeout(() => {
                                            segundoMensaje.remove();
                                            contenedorBoton.remove();
                                            mostrarCarta();
                                        }, 1500);
                                    });
                                }, 500);
                            }, 2500);
                        }, 500);
                    }, 1500);
                }, 2500);
            }, 500);
        }
    }, 1000);
}

function mostrarCarta() {
    document.querySelector('.mensaje-intermedio').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.mensaje-intermedio').remove();
        document.getElementById('segundaPantalla').style.display = 'block';
        setTimeout(() => {
            document.getElementById('segundaPantalla').style.opacity = '1';
            document.getElementById('mensajeFinal').textContent = 
                'Pues ha llegado el momento... ¿Quieres ser mi novia? 💝';
            crearCorazones();
            crearBrillo();
        }, 100);
    }, 1000);
}

function mostrarPropuesta() {
    document.querySelector('.mensaje-intermedio').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.mensaje-intermedio').remove();
        document.getElementById('segundaPantalla').style.display = 'block';
        setTimeout(() => {
            document.getElementById('segundaPantalla').style.opacity = '1';
            document.getElementById('mensajeFinal').textContent = 
                'Pues olvídate de todos, porque ahora... ¿Quieres ser mi novia? 💝';
            crearCorazones();
            crearBrillo();
        }, 100);
    }, 1000);
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
styleSheet.textContent = `
    html, body {
        touch-action: none;
        -ms-touch-action: none;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
    }

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

    .container {
        opacity: 1;
        transition: opacity 1s ease;
    }

    #pregunta, #segundaPantalla {
        opacity: 0;
        transition: opacity 1s ease;
    }

    .botones-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .boton-respuesta {
        padding: 15px 40px;
        font-size: 18px;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: pulsar 1.5s infinite;
    }

    .boton-respuesta:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(255,107,107,0.4);
    }

    .mensaje-intermedio {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }

    .texto-animado {
        opacity: 1;
        transform: translateY(0);
        transition: all 1s ease;
    }

    .segundo-texto {
        transition: opacity 1s ease 1s;
    }

    #btnCarta {
        transition: opacity 1s ease;
    }

    .mensaje-flotante {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 28px;
        text-align: center;
        opacity: 0;
        transition: opacity 1.5s ease;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        width: 90%;
        max-width: 600px;
        font-weight: 300;
        letter-spacing: 1px;
        padding: 20px;
    }

    .container-boton-carta {
        position: fixed;
        left: 50%;
        top: 65%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 1.5s ease;
        z-index: 1000;
    }

    .corazon-flotante {
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 1000;
        transition: all 2s ease-out;
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
    
    document.getElementById('btnSi')
        .addEventListener('click', () => manejarRespuesta('si'));
    
    document.getElementById('btnNo')
        .addEventListener('click', () => manejarRespuesta('no'));

    document.getElementById('btnReiniciar')
        .addEventListener('click', () => {
            localStorage.removeItem('yaHaVisitado');
            window.location.reload();
        });

    // Prevenir zoom con gestos
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });

    // Prevenir zoom en iOS
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevenir zoom con doble tap
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            e.preventDefault();
        }
        lastTap = currentTime;
    });

    // Prevenir zoom con teclas (Ctrl + rueda del ratón o Ctrl + +/-)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
            e.preventDefault();
        }
    });

    // Prevenir zoom con la rueda del ratón
    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
}); 
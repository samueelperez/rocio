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
            // Crear mensaje de bienvenida
            const mensajeBienvenida = document.createElement('h2');
            mensajeBienvenida.className = 'mensaje-flotante mensaje-bienvenida';
            mensajeBienvenida.textContent = '¡Bienvenida Rocio! 💖';
            document.body.appendChild(mensajeBienvenida);

            setTimeout(() => {
                mensajeBienvenida.style.opacity = '1';
                
                setTimeout(() => {
                    mensajeBienvenida.style.opacity = '0';
                    setTimeout(() => {
                        mensajeBienvenida.remove();
                        // Mostrar contador
                        document.getElementById('contador').style.display = 'block';
                        setTimeout(() => {
                            document.getElementById('contador').style.opacity = '1';
                            if (window.contadorActivo) {
                                iniciarActualizacionContador();
                            } else {
                                iniciarContador();
                            }
                        }, 500);
                    }, 1000);
                }, 2000);
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
        const pregunta = document.querySelector('#pregunta p');
        pregunta.className = 'pregunta-especial';
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
            const primerMensaje = document.createElement('h2');
            primerMensaje.className = 'mensaje-flotante';
            primerMensaje.textContent = 'Pues yo voy a ser diferente...';
            document.body.appendChild(primerMensaje);

            setTimeout(() => {
                primerMensaje.style.opacity = '1';

                setTimeout(() => {
                    primerMensaje.style.opacity = '0';

                    setTimeout(() => {
                        primerMensaje.remove();
                        const segundoMensaje = document.createElement('h2');
                        segundoMensaje.className = 'mensaje-flotante';
                        segundoMensaje.textContent = 'Yo no te voy a pedir salir...';
                        document.body.appendChild(segundoMensaje);

                        setTimeout(() => {
                            segundoMensaje.style.opacity = '1';

                            setTimeout(() => {
                                segundoMensaje.style.opacity = '0';
                                setTimeout(() => {
                                    segundoMensaje.remove();
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
                                            contenedorBoton.style.opacity = '0';
                                            setTimeout(() => {
                                                contenedorBoton.remove();
                                                mostrarCarta();
                                            }, 1000);
                                        });
                                    }, 100);
                                }, 1000);
                            }, 2500);
                        }, 500);
                    }, 1500);
                }, 2500);
            }, 500);
        } else {
            const primerMensaje = document.createElement('h2');
            primerMensaje.className = 'mensaje-flotante';
            primerMensaje.textContent = 'Pues yo tampoco te voy a pedir salir...';
            document.body.appendChild(primerMensaje);

            setTimeout(() => {
                primerMensaje.style.opacity = '1';

                setTimeout(() => {
                    primerMensaje.style.opacity = '0';

                    setTimeout(() => {
                        primerMensaje.remove();
                        const segundoMensaje = document.createElement('h2');
                        segundoMensaje.className = 'mensaje-flotante';
                        segundoMensaje.textContent = 'Pero voy a ser diferente...';
                        document.body.appendChild(segundoMensaje);

                        setTimeout(() => {
                            segundoMensaje.style.opacity = '1';

                            setTimeout(() => {
                                segundoMensaje.style.opacity = '0';
                                setTimeout(() => {
                                    segundoMensaje.remove();
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
                                            contenedorBoton.style.opacity = '0';
                                            setTimeout(() => {
                                                contenedorBoton.remove();
                                                mostrarCarta();
                                            }, 1000);
                                        });
                                    }, 100);
                                }, 1000);
                            }, 2500);
                        }, 500);
                    }, 1500);
                }, 2500);
            }, 500);
        }
    }, 1000);
}

function mostrarCarta() {
    const sobreContainer = document.createElement('div');
    sobreContainer.className = 'sobre-container';
    sobreContainer.innerHTML = `
        <div class="sobre">
            <div class="sobre-solapa"></div>
            <div class="sobre-frente">💌</div>
        </div>
        <div class="carta">
            <p>Querida Roro,</p>
            <p>Desde que te conocí, cada día ha sido especial. Tu sonrisa ilumina mi mundo de una manera que nunca pensé posible. Me encantan nuestras conversaciones, nuestras risas compartidas, y todos esos pequeños momentos que hacen que mi corazón lata más fuerte.</p>
            <p>No quiero simplemente pedirte salir... quiero crear algo único y especial contigo. Quiero ser esa persona que te haga sonreír cada mañana, que te apoye en cada momento, y que construya junto a ti un futuro lleno de amor y felicidad.</p>
            <p>Cada vez que te miro, veo no solo lo hermosa que eres por fuera, sino también la persona increíble que eres por dentro. Tu forma de ser, tu personalidad, todo en ti me hace querer ser mejor persona.</p>
            <p>Por eso hoy, de esta manera especial, quiero preguntarte algo importante...</p>
            <p style="font-weight: bold; margin-top: 30px;">¿Me darías la oportunidad de hacerte feliz?</p>
            <p style="text-align: right; margin-top: 40px;">Con todo mi cariño,<br>Dani 💝</p>
            <button id="btnCerrarCarta" class="boton-cerrar">Guardar en mi corazón ❤️</button>
        </div>
    `;
    document.body.appendChild(sobreContainer);

    setTimeout(() => {
        const sobre = sobreContainer.querySelector('.sobre');
        sobre.classList.add('abierto');

        setTimeout(() => {
            const carta = sobreContainer.querySelector('.carta');
            carta.classList.add('visible');

            setTimeout(() => {
                carta.classList.add('animada');
                // Iniciar lluvia de corazones
                crearCorazones();
                // Detener la lluvia después de 3 segundos
                setTimeout(() => {
                    const corazones = document.querySelectorAll('.corazon-flotante');
                    corazones.forEach(corazon => {
                        corazon.style.opacity = '0';
                        setTimeout(() => corazon.remove(), 1000);
                    });
                }, 3000);
                
                crearBrillo();

                // Mostrar el botón de cerrar después de un momento
                setTimeout(() => {
                    const btnCerrar = sobreContainer.querySelector('#btnCerrarCarta');
                    btnCerrar.classList.add('visible');
                    
                    btnCerrar.addEventListener('click', () => {
                        // Quitar animación de flotado
                        carta.classList.remove('animada');
                        // Agregar animación de guardado
                        carta.classList.add('guardando');
                        
                        setTimeout(() => {
                            // Cerrar la solapa del sobre
                            sobre.classList.remove('abierto');
                            sobre.classList.add('cerrandose');
                            
                            setTimeout(() => {
                                // Desvanecer todo el sobre
                                sobreContainer.style.opacity = '0';
                                setTimeout(() => {
                                    sobreContainer.remove();
                                    // Mostrar nuevos mensajes
                                    const primerMensaje = document.createElement('h2');
                                    primerMensaje.className = 'mensaje-flotante';
                                    primerMensaje.textContent = 'Ahora te pregunto...';
                                    document.body.appendChild(primerMensaje);

                                    setTimeout(() => {
                                        primerMensaje.style.opacity = '1';

                                        setTimeout(() => {
                                            primerMensaje.style.opacity = '0';
                                            setTimeout(() => {
                                                primerMensaje.remove();
                                                const mensajeFinal = document.createElement('h2');
                                                mensajeFinal.className = 'mensaje-flotante mensaje-propuesta';
                                                mensajeFinal.textContent = 'Rocio Velasco, ¿quieres ser mi compañera de vida y empezar nuestra historia juntos?';
                                                document.body.appendChild(mensajeFinal);

                                                setTimeout(() => {
                                                    mensajeFinal.style.opacity = '1';

                                                    setTimeout(() => {
                                                        const botonesContainer = document.createElement('div');
                                                        botonesContainer.className = 'botones-respuesta-final';
                                                        botonesContainer.innerHTML = `
                                                            <button class="boton-respuesta-final aceptar">Claro que quiero</button>
                                                            <button class="boton-respuesta-final rechazar">No, gracias</button>
                                                        `;
                                                        document.body.appendChild(botonesContainer);

                                                        setTimeout(() => {
                                                            botonesContainer.style.opacity = '1';
                                                            
                                                            // Agregar eventos a los botones
                                                            botonesContainer.querySelector('.aceptar').addEventListener('click', () => {
                                                                // Ocultar los botones y el mensaje anterior
                                                                botonesContainer.style.opacity = '0';
                                                                mensajeFinal.style.opacity = '0';
                                                                
                                                                setTimeout(() => {
                                                                    botonesContainer.remove();
                                                                    mensajeFinal.remove();
                                                                    
                                                                    // Mostrar mensaje de confirmación
                                                                    const mensajeConfirmacion = document.createElement('h2');
                                                                    mensajeConfirmacion.className = 'mensaje-flotante mensaje-confirmacion';
                                                                    mensajeConfirmacion.textContent = 'No tenía ninguna duda 💝';
                                                                    document.body.appendChild(mensajeConfirmacion);
                                                                    
                                                                    setTimeout(() => {
                                                                        mensajeConfirmacion.style.opacity = '1';
                                                                        
                                                                        setTimeout(() => {
                                                                            mensajeConfirmacion.style.opacity = '0';
                                                                            
                                                                            setTimeout(() => {
                                                                                mensajeConfirmacion.remove();
                                                                                
                                                                                // Crear contenedor para la foto y el mensaje final
                                                                                const contenedorFinal = document.createElement('div');
                                                                                contenedorFinal.className = 'contenedor-final';
                                                                                contenedorFinal.innerHTML = `
                                                                                    <div class="marco-foto">
                                                                                        <img src="foto.JPG" alt="Nosotros" class="foto-final">
                                                                                        <div class="corazones-marco"></div>
                                                                                    </div>
                                                                                    <p class="mensaje-final-amor">Te quiero mucho Rocio, nunca lo olvides 💖</p>
                                                                                `;
                                                                                document.body.appendChild(contenedorFinal);
                                                                                
                                                                                setTimeout(() => {
                                                                                    contenedorFinal.style.opacity = '1';
                                                                                    crearCorazones();
                                                                                    crearBrillo();
                                                                                }, 100);
                                                                            }, 1000);
                                                                        }, 2000);
                                                                    }, 100);
                                                                }, 1000);
                                                            });
                                                            
                                                            botonesContainer.querySelector('.rechazar').addEventListener('click', () => {
                                                                // Ocultar los botones y el mensaje anterior
                                                                botonesContainer.style.opacity = '0';
                                                                mensajeFinal.style.opacity = '0';
                                                                
                                                                setTimeout(() => {
                                                                    botonesContainer.remove();
                                                                    mensajeFinal.remove();
                                                                    
                                                                    // Mostrar mensaje de error
                                                                    const mensajeError = document.createElement('h2');
                                                                    mensajeError.className = 'mensaje-flotante mensaje-error';
                                                                    mensajeError.textContent = 'Creo que te has equivocado... 🤔';
                                                                    document.body.appendChild(mensajeError);
                                                                    
                                                                    setTimeout(() => {
                                                                        mensajeError.style.opacity = '1';
                                                                        
                                                                        setTimeout(() => {
                                                                            mensajeError.style.opacity = '0';
                                                                            setTimeout(() => {
                                                                                mensajeError.remove();
                                                                                
                                                                                // Volver a mostrar la pregunta y los botones
                                                                                const mensajeFinal = document.createElement('h2');
                                                                                mensajeFinal.className = 'mensaje-flotante mensaje-propuesta';
                                                                                mensajeFinal.textContent = 'Rocio Velasco, ¿quieres ser mi compañera de vida y empezar nuestra historia juntos?';
                                                                                document.body.appendChild(mensajeFinal);
                                                                                
                                                                                setTimeout(() => {
                                                                                    mensajeFinal.style.opacity = '1';
                                                                                    
                                                                                    setTimeout(() => {
                                                                                        const botonesContainer = document.createElement('div');
                                                                                        botonesContainer.className = 'botones-respuesta-final';
                                                                                        botonesContainer.innerHTML = `
                                                                                            <button class="boton-respuesta-final aceptar">Claro que quiero</button>
                                                                                            <button class="boton-respuesta-final rechazar">No, gracias</button>
                                                                                        `;
                                                                                        document.body.appendChild(botonesContainer);
                                                                                        
                                                                                        setTimeout(() => {
                                                                                            botonesContainer.style.opacity = '1';
                                                                                            // Volver a añadir los event listeners
                                                                                            botonesContainer.querySelector('.aceptar').addEventListener('click', () => {
                                                                                                // ... (mismo código que el botón aceptar original)
                                                                                            });
                                                                                            botonesContainer.querySelector('.rechazar').addEventListener('click', () => {
                                                                                                // ... (mismo código que este event listener)
                                                                                            });
                                                                                        }, 100);
                                                                                    }, 1000);
                                                                                }, 100);
                                                                            }, 1000);
                                                                        }, 2000);
                                                                    }, 100);
                                                                }, 1000);
                                                            });
                                                        }, 100);
                                                    }, 1000);
                                                }, 100);
                                            }, 1000);
                                        }, 2000);
                                    }, 100);
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    });
                }, 4000);
            }, 1500);
        }, 1000);
    }, 500);
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap');

    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
        z-index: -2;
    }

    html, body {
        touch-action: none;
        -ms-touch-action: none;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
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
        text-align: center;
        padding: 30px;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        position: relative;
        overflow: hidden;
    }

    .container h2 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(24px, 5vw, 32px);
        color: #ff6b6b;
        margin-bottom: 30px;
        font-weight: 600;
        line-height: 1.4;
        text-shadow: 2px 2px 8px rgba(255, 107, 107, 0.2);
        font-style: italic;
    }

    .mensaje-amor {
        margin-top: 20px;
        font-size: 18px;
        color: #ff6b6b;
        font-weight: 500;
    }

    #nombreInput {
        font-family: 'Poppins', sans-serif;
        font-size: clamp(16px, 4vw, 20px);
        padding: 12px 20px;
        border: 2px solid rgba(255, 107, 107, 0.4);
        border-radius: 10px;
        width: 80%;
        max-width: 300px;
        margin: 20px auto;
        transition: all 0.3s ease;
        background-color: rgba(255, 255, 255, 0.9);
        text-align: center;
        color: #ff6b6b;
    }

    #nombreInput:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
        background-color: white;
    }

    #nombreInput::placeholder {
        color: rgba(255, 107, 107, 0.6);
        font-weight: 300;
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

    #btnVerificar {
        margin-top: 25px;
        padding: 12px 30px;
        font-size: clamp(16px, 3.5vw, 18px);
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        border: none;
        border-radius: 25px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        letter-spacing: 0.5px;
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
    }

    #btnVerificar:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        background: linear-gradient(45deg, #ff5f5f, #ff8282);
    }

    .mensaje-flotante {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: clamp(24px, 5vw, 36px);
        text-align: center;
        opacity: 0;
        transition: opacity 1.5s ease;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        z-index: 1000;
        width: 90%;
        max-width: 600px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        letter-spacing: 1px;
        padding: 20px;
        will-change: opacity;
        line-height: 1.4;
        pointer-events: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }

    @media (max-width: 768px) {
        .mensaje-flotante {
            font-size: clamp(20px, 6vw, 28px);
            width: 85%;
            padding: 15px;
            font-weight: 700;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
        }
    }

    @media (max-width: 480px) {
        .mensaje-flotante {
            font-size: clamp(18px, 5.5vw, 24px);
            width: 80%;
            padding: 10px;
        }
    }

    .container-boton-carta {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 1.5s ease;
        z-index: 1001;
        width: 90%;
        max-width: 300px;
        text-align: center;
    }

    .boton-respuesta {
        font-size: clamp(16px, 4vw, 20px);
        padding: clamp(12px, 3vw, 20px) clamp(25px, 5vw, 40px);
        position: relative;
        z-index: 1002;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        box-shadow: 0 5px 15px rgba(255,107,107,0.4);
        transform: scale(1);
        transition: all 0.3s ease;
    }

    .boton-respuesta:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(255,107,107,0.6);
    }

    .corazon-flotante {
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 1000;
        transition: all 2s ease-out;
    }

    .pregunta-especial {
        font-family: 'Playfair Display', serif;
        font-size: clamp(32px, 7vw, 48px);
        color: #ff6b6b;
        margin-bottom: 30px;
        text-shadow: 2px 2px 6px rgba(255, 107, 107, 0.3);
        font-weight: 700;
        font-style: italic;
        line-height: 1.3;
    }

    .sobre-container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 280px;
        height: 180px;
        perspective: 1000px;
        z-index: 1000;
    }

    .sobre {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ffecec, #ffe0e0);
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transform-style: preserve-3d;
        transition: transform 1s ease;
    }

    .sobre-frente {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .sobre-solapa {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: linear-gradient(45deg, #ffd6d6, #ffbdbd);
        transform-origin: top;
        transition: transform 1s ease;
        border-radius: 10px 10px 0 0;
    }

    .sobre.abierto .sobre-solapa {
        transform: rotateX(180deg);
    }

    .carta {
        position: fixed;
        left: 50%;
        top: 50vh;
        transform: translateX(-50%);
        width: 280px;
        background: white;
        padding: min(30px, 5vh) min(30px, 5vw);
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        opacity: 0;
        transition: all 1.5s ease;
        font-family: 'Playfair Display', serif;
        font-size: clamp(12px, 3vw, 14px);
        line-height: 1.6;
        color: #333;
        max-height: 70vh;
        overflow-y: auto;
        text-align: left;
        margin: 0;
        transform-origin: center bottom;
    }

    .carta p {
        margin-bottom: 15px;
    }

    .carta p:first-child {
        font-size: 1.2em;
        color: #ff6b6b;
        margin-bottom: 25px;
    }

    .carta.visible {
        opacity: 1;
        transform: translate(-50%, -100%);
    }

    @keyframes flotar {
        0%, 100% { transform: translate(-50%, -100%); }
        50% { transform: translate(-50%, -105%); }
    }

    .carta.animada {
        animation: flotar 3s ease-in-out infinite;
    }

    .boton-cerrar {
        display: block;
        margin: 30px auto 10px;
        padding: 15px 30px;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: clamp(14px, 3vw, 16px);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }

    .boton-cerrar.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .boton-cerrar:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255,107,107,0.4);
    }

    .carta.guardando {
        animation: guardarCarta 1s ease-out forwards;
    }

    .sobre.cerrandose .sobre-solapa {
        transform: rotateX(0deg);
    }

    @keyframes guardarCarta {
        0% { transform: translate(-50%, -100%); }
        100% { transform: translate(-50%, 50%); opacity: 0; }
    }

    .mensaje-propuesta {
        font-family: 'Playfair Display', serif !important;
        font-size: clamp(24px, 5vw, 36px) !important;
        font-weight: 600 !important;
        color: #ff4d6d !important;
        text-shadow: 3px 3px 10px rgba(255, 77, 109, 0.4) !important;
        line-height: 1.5 !important;
        padding: 20px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border-radius: 20px !important;
        box-shadow: 0 10px 30px rgba(255, 77, 109, 0.2) !important;
        max-width: 90% !important;
        margin: 0 auto !important;
        backdrop-filter: blur(5px) !important;
        border: 2px solid rgba(255, 77, 109, 0.3) !important;
    }

    .botones-respuesta-final {
        position: fixed;
        left: 50%;
        top: 70%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 20px;
        opacity: 0;
        transition: all 1s ease;
        z-index: 1000;
        flex-direction: column;
        align-items: center;
    }

    .boton-respuesta-final {
        padding: 15px 40px;
        font-size: clamp(16px, 3.5vw, 20px);
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        color: white;
        width: 250px;
        margin: 10px 0;
        font-family: 'Poppins', sans-serif;
        letter-spacing: 0.5px;
    }

    .boton-respuesta-final.aceptar {
        background: linear-gradient(45deg, #ff4d6d, #ff758c);
        box-shadow: 0 5px 15px rgba(255,107,107,0.4);
        border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .boton-respuesta-final.rechazar {
        background: transparent;
        border: 2px solid rgba(255, 77, 109, 0.5);
        color: #ff4d6d;
    }

    .boton-respuesta-final:hover {
        transform: translateY(-5px);
    }

    .boton-respuesta-final.aceptar:hover {
        box-shadow: 0 8px 25px rgba(255, 77, 109, 0.6);
        background: linear-gradient(45deg, #ff3d5d, #ff657c);
    }

    .boton-respuesta-final.rechazar:hover {
        background: rgba(255, 77, 109, 0.1);
        border-color: rgba(255, 77, 109, 0.7);
    }

    @media (max-width: 480px) {
        .botones-respuesta-final {
            flex-direction: column;
            gap: 15px;
        }
    }

    @media (min-width: 768px) {
        .carta {
            width: 380px;
            font-size: 16px;
            max-height: 70vh;
            padding: 40px;
        }

        .sobre-container {
            width: 320px;
            height: 200px;
        }
    }

    .carta::-webkit-scrollbar {
        width: 8px;
    }

    .carta::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    .carta::-webkit-scrollbar-thumb {
        background: #ff6b6b;
        border-radius: 4px;
    }

    .carta::-webkit-scrollbar-thumb:hover {
        background: #ff8e8e;
    }

    .mensaje-bienvenida {
        font-family: 'Playfair Display', serif !important;
        font-size: clamp(28px, 6vw, 42px) !important;
        color: #ff4d6d !important;
        text-shadow: 3px 3px 12px rgba(255, 77, 109, 0.5) !important;
        font-weight: 700 !important;
        letter-spacing: 1px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        padding: 25px 40px !important;
        border-radius: 20px !important;
        box-shadow: 0 10px 30px rgba(255, 77, 109, 0.3) !important;
        transform: scale(0.9) !important;
        animation: aparecerBienvenida 0.5s forwards !important;
    }

    @keyframes aparecerBienvenida {
        from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }

    .mensaje-confirmacion {
        font-family: 'Playfair Display', serif !important;
        font-size: clamp(28px, 5vw, 38px) !important;
        color: #ff4d6d !important;
        text-shadow: 2px 2px 8px rgba(255, 77, 109, 0.4) !important;
    }

    .contenedor-final {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
        transition: opacity 1s ease;
    }

    .marco-foto {
        position: relative;
        padding: 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(255, 77, 109, 0.3);
        margin-bottom: 30px;
        max-width: 90vw;
        animation: flotar 3s ease-in-out infinite;
    }

    .foto-final {
        width: 100%;
        max-width: 400px;
        border-radius: 15px;
        display: block;
    }

    .corazones-marco {
        position: absolute;
        inset: -15px;
        border: 3px solid #ff4d6d;
        border-radius: 25px;
        z-index: -1;
    }

    .corazones-marco::before,
    .corazones-marco::after {
        content: '❤️';
        position: absolute;
        font-size: 24px;
    }

    .corazones-marco::before {
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
    }

    .corazones-marco::after {
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
    }

    .mensaje-final-amor {
        font-family: 'Playfair Display', serif;
        font-size: clamp(20px, 4vw, 28px);
        color: #ff4d6d;
        text-shadow: 2px 2px 8px rgba(255, 77, 109, 0.3);
        margin-top: 20px;
        font-weight: 600;
        animation: brillarTexto 2s infinite;
    }

    @keyframes brillarTexto {
        0%, 100% { text-shadow: 2px 2px 8px rgba(255, 77, 109, 0.3); }
        50% { text-shadow: 2px 2px 12px rgba(255, 77, 109, 0.6); }
    }

    .mensaje-error {
        font-family: 'Playfair Display', serif !important;
        font-size: clamp(24px, 5vw, 34px) !important;
        color: #ff4d6d !important;
        text-shadow: 2px 2px 8px rgba(255, 77, 109, 0.4) !important;
        background: rgba(255, 255, 255, 0.95) !important;
        padding: 20px 30px !important;
        border-radius: 15px !important;
        box-shadow: 0 5px 20px rgba(255, 77, 109, 0.2) !important;
        animation: aparecer 0.5s ease-out forwards !important;
    }

    @keyframes aparecer {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
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
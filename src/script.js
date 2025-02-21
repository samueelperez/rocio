const codigoSecreto = 'R0C10'; // Este será el código que dejarás en la mesa

// Definir las pistas del juego
const pistas = [
    {
        titulo: "Primera Pista",
        texto: "Para comenzar esta aventura, busca donde guardas tu bebida caliente favorita cada mañana... ¿Qué palabra encuentras?",
        respuesta: "amor", // La palabra que estará en la taza
        imagen: "/assets/pista1.jpg" // Opcional: imagen de ayuda
    },
    {
        titulo: "¡Bien hecho! Segunda Pista",
        texto: "El lugar donde los momentos dulces se guardan, y el frío mantiene todo en su lugar. Busca en la puerta del refrigerador...",
        respuesta: "cocina",
        imagen: "/assets/pista2.jpg"
    },
    {
        titulo: "¡Vas muy bien! Tercera Pista",
        texto: "Donde descansas tus sueños cada noche, debajo de tu almohada hay algo especial esperándote...",
        respuesta: "dormitorio",
        imagen: "/assets/pista3.jpg"
    },
    {
        titulo: "¡Última Pista!",
        texto: "El lugar donde guardas tus mejores outfits esconde el regalo final... ¡Búscalo!",
        respuesta: "armario",
        imagen: "/assets/pista4.jpg"
    }
];

let pistaActual = 0;

function verificarCodigo() {
    const codigoIngresado = document.getElementById('codigoInput').value.trim();
    
    if (codigoIngresado.toUpperCase() === codigoSecreto) {
        agregarCorazonesFlotantes();
        document.getElementById('verificacion').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('verificacion').style.display = 'none';
            mostrarPista();
        }, 1000);
    } else {
        sacudirInput();
        mostrarError('¡Código incorrecto! Busca bien en la mesa...');
    }
}

function mostrarError(mensaje) {
    Swal.fire({
        title: '¡Código Incorrecto!',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#d76d77'
    });
}

function sacudirInput() {
    const input = document.getElementById('codigoInput');
    input.style.animation = 'sacudir 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function mostrarPista() {
    const contenedorPista = document.getElementById('pista');
    const tituloPista = contenedorPista.querySelector('.titulo-pista');
    const textoPista = contenedorPista.querySelector('.texto-pista');
    const imagenPista = contenedorPista.querySelector('.imagen-pista');
    const inputRespuesta = document.getElementById('respuestaPista');
    
    contenedorPista.style.display = 'block';
    setTimeout(() => {
        contenedorPista.style.opacity = '1';
        
        tituloPista.textContent = pistas[pistaActual].titulo;
        textoPista.textContent = pistas[pistaActual].texto;
        
        if (pistas[pistaActual].imagen) {
            imagenPista.src = pistas[pistaActual].imagen;
            imagenPista.style.display = 'block';
        } else {
            imagenPista.style.display = 'none';
        }
        
        inputRespuesta.style.display = 'block';
        inputRespuesta.value = '';
    }, 100);
}

function verificarRespuesta() {
    const respuesta = document.getElementById('respuestaPista').value.toLowerCase().trim();
    
    if (respuesta === pistas[pistaActual].respuesta) {
        pistaActual++;
        
        if (pistaActual >= pistas.length) {
            mostrarFinal();
        } else {
            Swal.fire({
                title: '¡Correcto!',
                text: '¡Has encontrado la pista! Vamos por la siguiente...',
                icon: 'success',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#3a1c71'
            }).then(() => {
                mostrarPista();
            });
        }
    } else {
        mostrarError('Esa no es la respuesta correcta. ¡Sigue buscando!');
    }
}

function mostrarFinal() {
    Swal.fire({
        title: '¡Lo has conseguido!',
        text: '¡Has encontrado todas las pistas! Ahora ve al armario por tu sorpresa final...',
        icon: 'success',
        confirmButtonText: '¡Gracias!',
        confirmButtonColor: '#3a1c71'
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnVerificar').addEventListener('click', verificarCodigo);
    document.getElementById('btnSiguientePista').addEventListener('click', verificarRespuesta);
    
    // Permitir enviar con Enter
    document.getElementById('codigoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verificarCodigo();
    });
    
    document.getElementById('respuestaPista').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verificarRespuesta();
    });
});

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
            // Solo iniciar un nuevo contador si no hay datos o si el contador ya expiró
            const ahora = new Date().getTime();
            const fechaFinal = data.fecha_final || (data.data && data.data.fecha_final);
            const contadorExpirado = fechaFinal && (fechaFinal - ahora <= 0);
            
            if (!data || !fechaFinal || contadorExpirado) {
                const fechaInicio = new Date();
                // Calcular el tiempo total en segundos (3 días, 8 horas, 37 minutos)
                const dias = 3;
                const horas = 8;
                const minutos = 37;
                const tiempoTotal = (dias * 24 * 60 * 60) + (horas * 60 * 60) + (minutos * 60);
                
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

                    const totalSegundos = Math.max(0, Math.floor(segundosRestantes));
                    const dias = Math.floor(totalSegundos / (24 * 60 * 60));
                    const horas = Math.floor((totalSegundos % (24 * 60 * 60)) / (60 * 60));
                    const minutos = Math.floor((totalSegundos % (60 * 60)) / 60);
                    const segundos = Math.floor(totalSegundos % 60);

                    console.log(`Tiempo restante: ${dias}d ${horas}h ${minutos}m ${segundos}s`);

                    // Asegurarse de que los elementos existen antes de actualizarlos
                    const elementoDias = document.getElementById('dias');
                    const elementoHoras = document.getElementById('horas');
                    const elementoMinutos = document.getElementById('minutos');
                    const elementoSegundos = document.getElementById('segundos');

                    if (elementoDias) elementoDias.textContent = String(dias).padStart(2, '0');
                    if (elementoHoras) elementoHoras.textContent = String(horas).padStart(2, '0');
                    if (elementoMinutos) elementoMinutos.textContent = String(minutos).padStart(2, '0');
                    if (elementoSegundos) elementoSegundos.textContent = String(segundos).padStart(2, '0');
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
                                                                                        <img src="/assets/foto.JPG" alt="Nosotros" class="foto-final">
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
                                                                                                                        <img src="/assets/foto.JPG" alt="Nosotros" class="foto-final">
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
        .addEventListener('click', verificarCodigo);
    
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
const codigoSecreto = 'R0C10';

const pistas = [
    {
        titulo: "Primera Pista",
        texto: "¡Bienvenida a tu búsqueda del tesoro! 🌙 Donde mas tiempo pasamos juntos, donde siempre hay confianza maxima... ahí encontraras la siguiente pista 💝",
        respuesta: "ABRIL"
    },
    {
        titulo: "¡Bien hecho! Segunda Pista",
        texto: "Ahora busca debajo del lugar donde todo empezó, donde tuvimos nuestra primera conversación en el piso... ese mueble guarda nuestro primer momento juntos 💝",
        respuesta: "las 50 sombras de grey"
    },
    {
        titulo: "¡Vas muy bien! Tercera Pista",
        texto: "Hay un armario con candado que guarda un secreto... pero antes de abrirlo, necesito que encuentres el código que hay delante de él 🔒",
        respuesta: "ESPECIAL"
    },
    {
        titulo: "¡Última Pista!",
        texto: "Llevas siempre contigo muchas cosas... pero hoy llevas algo más. Encuentra la llave para descubrir la sorpresa final 🗝️"
    }
];

let pistaActual = 0;

function verificarCodigo() {
    const codigoIngresado = document.getElementById('codigoInput').value.trim();
    
    if (codigoIngresado.toUpperCase() === codigoSecreto.toUpperCase()) {
        agregarCorazonesFlotantes();
        document.getElementById('verificacion').style.animation = 'fadeIn 0.3s ease-out forwards';
        document.getElementById('verificacion').style.display = 'none';
        mostrarPista();
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
        confirmButtonColor: '#d76d77',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            const inputRespuesta = document.getElementById('respuestaPista');
            if (inputRespuesta) {
                inputRespuesta.value = '';
                inputRespuesta.focus();
            }
        }
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
    const inputRespuesta = document.getElementById('respuestaPista');
    
    contenedorPista.style.animation = 'none';
    contenedorPista.offsetHeight;
    contenedorPista.style.animation = 'fadeIn 0.3s ease-out forwards';
    
    contenedorPista.style.display = 'block';
    window.scrollTo(0, 0);
    
    tituloPista.textContent = pistas[pistaActual].titulo;
    textoPista.textContent = pistas[pistaActual].texto;
    
    if (pistaActual === 3) {
        inputRespuesta.style.display = 'none';
        const btnSiguientePista = document.getElementById('btnSiguientePista');
        btnSiguientePista.textContent = '¡Encontré la llave! 🗝️';
        btnSiguientePista.style.display = 'block';
        btnSiguientePista.onclick = mostrarFinal;
    } else {
        inputRespuesta.style.display = 'block';
        inputRespuesta.value = '';
        inputRespuesta.focus();
        const btnSiguientePista = document.getElementById('btnSiguientePista');
        btnSiguientePista.textContent = '¡Lo encontré! 🔍';
        btnSiguientePista.onclick = verificarRespuesta;
    }
}

function verificarRespuesta() {
    document.getElementById('btnSiguientePista').disabled = true;
    
    let respuestaUsuario = document.getElementById('respuestaPista').value || '';
    respuestaUsuario = respuestaUsuario.trim().toUpperCase();
    
    let respuestaCorrecta = pistas[pistaActual].respuesta.toUpperCase();
    
    console.log('Pista actual:', pistaActual);
    console.log('Respuesta usuario (limpia):', respuestaUsuario);
    console.log('Respuesta correcta (limpia):', respuestaCorrecta);
    console.log('¿Son iguales?:', respuestaUsuario === respuestaCorrecta);
    
    if (!respuestaUsuario) {
        document.getElementById('btnSiguientePista').disabled = false;
        return;
    }
    
    let mensajeError = 'Esa no es la respuesta correcta. ¡Sigue buscando!';
    if (pistaActual === 0) {
        mensajeError = '¡Código incorrecto! El mensaje sigue esperando ser descubierto... ¿Has buscado bien en el lugar donde descansas tus sueños? 🌙';
    } else if (pistaActual === 1) {
        mensajeError = '¡Código incorrecto! Revisa bien el código que encontraste debajo del sofá...';
    } else if (pistaActual === 2) {
        mensajeError = '¡Código incorrecto! Revisa bien el código que hay delante del armario...';
    }
    
    if (respuestaUsuario === respuestaCorrecta) {
        console.log('¡Respuesta correcta! Pasando a siguiente pista...');
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
        console.log('Respuesta incorrecta, mostrando error');
        mostrarError(mensajeError);
    }
    
    setTimeout(() => {
        document.getElementById('btnSiguientePista').disabled = false;
    }, 1000);
}

function mostrarFinal() {
    Swal.fire({
        title: 'Recuerda...',
        text: 'Porque eres especial Rocio ❤️',
        icon: 'success',
        confirmButtonText: 'FIN ✨',
        confirmButtonColor: '#3a1c71'
    }).then(() => {
        document.getElementById('verificacion').style.display = 'none';
        document.getElementById('pista').style.display = 'none';
        
        Swal.fire({
            title: 'Te quiero mucho ❤️',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: `
                rgba(58, 28, 113, 0.4)
                url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_P7sC%7Banimation:spinner_svv2 .8s linear infinite;animation-delay:-.8s%7D.spinner_s1WN%7Banimation-delay:-.65s%7D.spinner_oXPr%7Banimation-delay:-.5s%7D@keyframes spinner_svv2%7B0%25,66.66%25%7Banimation-timing-function:cubic-bezier(0.4,0,0.2,1);y:13px;height:2px%7D33.33%25%7Banimation-timing-function:cubic-bezier(0.8,0,0.6,1);y:5px;height:18px%7D%7D%3C/style%3E%3Cpath d='M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z' fill='none' stroke='%23d76d77' stroke-width='2'/%3E%3Cpath class='spinner_P7sC' d='M12 3C16.9706 3 21 7.02944 21 12' stroke='%23d76d77' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")
                center center
                no-repeat
            `
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnVerificar').addEventListener('click', verificarCodigo);
    document.getElementById('btnSiguientePista').addEventListener('click', verificarRespuesta);
    
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
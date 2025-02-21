const codigoSecreto = 'R0C10';

const pistas = [
    {
        titulo: "Primera Pista",
        texto: "¡Bienvenida a tu búsqueda del tesoro! 🌙 Donde tus sueños descansan cada noche, donde la luz tenue ilumina tus lecturas antes de dormir, un mensaje especial te espera... ¿Podrás encontrarlo? ✨",
        respuesta: "te quiero"
    },
    {
        titulo: "¡Bien hecho! Segunda Pista",
        texto: "Ahora busca debajo del lugar donde todo empezó, donde tuvimos nuestra primera conversación en el piso... ese mueble guarda nuestro primer momento juntos 💝",
        respuesta: "las 50 sombras de grey"
    },
    {
        titulo: "¡Vas muy bien! Tercera Pista",
        texto: "Hay un armario con candado que guarda un secreto... pero antes de abrirlo, necesito que encuentres el código que hay delante de él 🔒",
        respuesta: "candado"
    },
    {
        titulo: "¡Última Pista!",
        texto: "Llevas siempre contigo muchas cosas... pero hoy llevas algo más. Tu bolso guarda la llave para descubrir la sorpresa final 🗝️",
        respuesta: "llave"
    }
];

let pistaActual = 0;

function verificarCodigo() {
    const codigoIngresado = document.getElementById('codigoInput').value.trim();
    
    if (codigoIngresado.toUpperCase() === codigoSecreto) {
        agregarCorazonesFlotantes();
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
    const inputRespuesta = document.getElementById('respuestaPista');
    
    contenedorPista.style.display = 'block';
    window.scrollTo(0, 0);
    
    tituloPista.textContent = pistas[pistaActual].titulo;
    textoPista.textContent = pistas[pistaActual].texto;
    
    inputRespuesta.style.display = 'block';
    inputRespuesta.value = '';
    inputRespuesta.focus();
}

function verificarRespuesta() {
    const respuesta = document.getElementById('respuestaPista').value.toLowerCase().trim();
    
    let mensajeError = 'Esa no es la respuesta correcta. ¡Sigue buscando!';
    if (pistaActual === 0) {
        mensajeError = '¡Código incorrecto! El mensaje sigue esperando ser descubierto... ¿Has buscado bien en el lugar donde descansas tus sueños? 🌙';
    } else if (pistaActual === 1) {
        mensajeError = '¡Código incorrecto! Revisa bien el código que encontraste debajo del sofá...';
    } else if (pistaActual === 2) {
        mensajeError = '¡Código incorrecto! Busca bien el código que hay delante del armario con candado...';
    } else if (pistaActual === 3) {
        mensajeError = '¡Esa no es la respuesta! Mira bien en tu bolso, seguro que encuentras algo especial...';
    }
    
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
        mostrarError(mensajeError);
    }
}

function mostrarFinal() {
    Swal.fire({
        title: '¡Lo has conseguido!',
        text: '¡Has encontrado la llave! Ahora puedes abrir el candado del armario y descubrir tu sorpresa final... 💝',
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

// Efectos visuales
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
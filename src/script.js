const codigoSecreto = 'R0C10';

const pistas = [
    {
        titulo: "Primera Pista",
        texto: "Para comenzar esta aventura, busca donde guardas tu bebida caliente favorita cada mañana... ¿Qué palabra encuentras?",
        respuesta: "amor",
        imagen: "/assets/pista1.jpg"
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
    window.scrollTo(0, 0);
    
    setTimeout(() => {
        contenedorPista.style.opacity = '1';
        
        tituloPista.textContent = pistas[pistaActual].titulo;
        textoPista.textContent = pistas[pistaActual].texto;
        
        if (pistas[pistaActual].imagen) {
            imagenPista.src = pistas[pistaActual].imagen;
            imagenPista.style.display = 'block';
            imagenPista.onload = () => {
                window.scrollTo(0, 0);
            };
        } else {
            imagenPista.style.display = 'none';
        }
        
        inputRespuesta.style.display = 'block';
        inputRespuesta.value = '';
        inputRespuesta.focus();
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
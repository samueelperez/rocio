let data = {
    fecha_inicio: null,
    fecha_final: null,
    segundos_restantes: null
};

// Ruta al archivo de datos
const dataPath = '/tmp/contador-data.json';

// Cargar datos existentes si los hay
try {
    const fs = require('fs');
    if (fs.existsSync(dataPath)) {
        const savedData = JSON.parse(fs.readFileSync(dataPath));
        data = savedData;
    }
} catch (error) {
    console.error('Error al cargar datos:', error);
}

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    console.log('Request Method:', event.httpMethod);
    console.log('Request Body:', event.body);

    try {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({})
            };
        }

        if (event.httpMethod === 'GET') {
            // Si no hay datos, inicializar con el tiempo especificado
            if (!data.fecha_inicio || !data.fecha_final) {
                const tiempoTotal = (3 * 24 * 60 * 60) + (8 * 60 * 60) + (37 * 60); // 3 días, 8 horas, 37 minutos
                data.fecha_inicio = Date.now();
                data.segundos_restantes = tiempoTotal;
                data.fecha_final = data.fecha_inicio + (tiempoTotal * 1000);
                
                // Guardar datos
                try {
                    const fs = require('fs');
                    fs.writeFileSync(dataPath, JSON.stringify(data));
                } catch (error) {
                    console.error('Error al guardar datos:', error);
                }
            }
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data)
            };
        }

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const tiempoTotal = body.tiempoTotal;
            
            data.fecha_inicio = Date.now();
            data.segundos_restantes = tiempoTotal;
            data.fecha_final = data.fecha_inicio + (tiempoTotal * 1000);
            
            // Guardar datos
            try {
                const fs = require('fs');
                fs.writeFileSync(dataPath, JSON.stringify(data));
            } catch (error) {
                console.error('Error al guardar datos:', error);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(data)
            };
        }

        if (event.httpMethod === 'DELETE') {
            data = {
                fecha_inicio: null,
                fecha_final: null,
                segundos_restantes: null
            };
            
            // Eliminar archivo de datos
            try {
                const fs = require('fs');
                if (fs.existsSync(dataPath)) {
                    fs.unlinkSync(dataPath);
                }
            } catch (error) {
                console.error('Error al eliminar datos:', error);
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
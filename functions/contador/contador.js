let data = {
    fecha_inicio: null,
    fecha_final: null,
    segundos_restantes: null
};

// Cargar datos existentes si los hay
try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, 'contador-data.json');
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

        switch (event.httpMethod) {
            case 'GET':
                console.log('GET - Current data:', data);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data || {})
                };

            case 'POST':
                const body = JSON.parse(event.body);
                const tiempoTotal = body.tiempoTotal;
                
                data.fecha_inicio = Date.now();
                data.segundos_restantes = tiempoTotal;
                data.fecha_final = data.fecha_inicio + (tiempoTotal * 1000);
                
                // Guardar datos
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const dataPath = path.join(__dirname, 'contador-data.json');
                    fs.writeFileSync(dataPath, JSON.stringify(data));
                } catch (error) {
                    console.error('Error al guardar datos:', error);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data)
                };

            case 'DELETE':
                console.log('DELETE - Clearing data');
                data = null;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('General error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
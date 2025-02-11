let contador = null;

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
    };

    try {
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 200, headers, body: '' };
        }

        switch (event.httpMethod) {
            case 'GET':
                // Si no hay contador iniciado, devolver objeto vacío
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(contador || {})
                };

            case 'POST':
                const data = JSON.parse(event.body);
                // Guardar la fecha final
                contador = {
                    fecha_final: data.fechaFinal,
                    iniciado: true
                };
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, data: contador })
                };

            case 'DELETE':
                contador = null;
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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 
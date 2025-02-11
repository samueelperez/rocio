const STORE_KEY = 'contador_data';
let data = null;

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
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data || {})
                };

            case 'POST':
                const postData = JSON.parse(event.body);
                data = {
                    fecha_final: postData.fechaFinal,
                    iniciado: true
                };
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        data: data 
                    })
                };

            case 'DELETE':
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
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 
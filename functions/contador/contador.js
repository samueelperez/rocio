let data = null;

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
                const postData = JSON.parse(event.body);
                console.log('POST - Received data:', postData);
                
                data = {
                    fecha_final: postData.fechaFinal,
                    iniciado: true
                };
                
                console.log('POST - Stored data:', data);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: data
                    })
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
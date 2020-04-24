export function response(status: number) {
    return new Response(status)
}

class Response {
    private headers: Object
    
    private readonly status: number
    
    constructor(status: number = 200) {
        this.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
        this.status = status
    }

    json(data: Object): Object|any {
        return {
            statusCode: this.status,
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
    }
}
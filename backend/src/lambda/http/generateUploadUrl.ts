import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { UploadTodoRequest } from '../../requests'
import { signedPutURL } from '../../domain/attachments'
import { response } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const request: UploadTodoRequest = new UploadTodoRequest(event)
    
    return response(200).json({ data: signedPutURL(request) })
}

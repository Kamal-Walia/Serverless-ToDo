import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../domain/todos'
import { response } from '../../utils/response'
import { DeleteTodoRequest } from '../../requests'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const request: DeleteTodoRequest = new DeleteTodoRequest(event)
    const deleted: boolean = await deleteTodo(request)

    return response((deleted) ? 204 : 422).json({})
}

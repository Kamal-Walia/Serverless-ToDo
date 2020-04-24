import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../domain/todos'
import { response } from '../../utils/response'
import { TodoItem } from '../../models/TodoItem'
import { GetTodosRequest } from '../../requests/GetTodosRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const request: GetTodosRequest = new GetTodosRequest(event)
    const payload: TodoItem[] = await getAllTodos(request)
    
    return response(200).json({ data: payload })
}

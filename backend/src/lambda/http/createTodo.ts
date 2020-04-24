import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests'
import { TodoItem } from '../../models/TodoItem'
import { createTodo } from '../../domain/todos'
import { response } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const request: CreateTodoRequest = new CreateTodoRequest(event)
    const todo: TodoItem = await createTodo(request)

    return response(201).json({ data: todo })
}

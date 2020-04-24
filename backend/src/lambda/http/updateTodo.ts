import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests'
import { TodoItem } from '../../models/TodoItem'
import { updateTodo } from '../../domain/todos'
import { response } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const request: UpdateTodoRequest = new UpdateTodoRequest(event)
        const todo: TodoItem = await updateTodo(request)

        return response(200).json({ data: todo })
    } catch (error) {
        return response(404).json({
            messages: [ error.message ]
        })
    }
}

import { APIGatewayProxyEvent } from "aws-lambda"
import Request from "./Request"

/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoInput {
  todoId: string,
  userId: string,
  name: string,
  dueDate: string,
  done: boolean,
  attachmentUrl?: string,
}

export class UpdateTodoRequest extends Request {
  constructor(event: APIGatewayProxyEvent) {
    super(event)
  }

  payload(): UpdateTodoInput {
    const event: APIGatewayProxyEvent = (this.event() as APIGatewayProxyEvent)
    
    return {
      ...JSON.parse(event.body),
      todoId: event.pathParameters.todoId,
      userId: this.user(),
    }
  }
}

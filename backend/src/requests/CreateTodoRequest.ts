import { APIGatewayProxyEvent } from "aws-lambda";
import Request from "./Request";

/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoInput {
  userId: string
  name: string
  dueDate: string
}

export class CreateTodoRequest extends Request {
  constructor(event: APIGatewayProxyEvent) {
    super(event)
  }

  payload(): CreateTodoInput {
    return {
      ...JSON.parse((this.event() as APIGatewayProxyEvent).body),
      userId: this.user()
    }
  }
}

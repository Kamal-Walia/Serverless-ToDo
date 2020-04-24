import { APIGatewayProxyEvent } from "aws-lambda";
import Request from "./Request";
import { FindTodoInput } from ".";

export class UploadTodoRequest extends Request {
  constructor(event: APIGatewayProxyEvent) {
    super(event)
  }

  payload(): FindTodoInput {
    return {
      todoId: this.event().pathParameters.todoId || '',
      userId: null,
    }
  }
}

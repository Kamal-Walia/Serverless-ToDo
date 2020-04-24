import { APIGatewayProxyEvent } from "aws-lambda";
import Request from "./Request";
import { FindTodoInput } from ".";

export class GetTodosRequest extends Request {
  constructor(event: APIGatewayProxyEvent) {
    super(event)
  }

  payload(): FindTodoInput {
    return {
      todoId: null,
      userId: this.user(),
    }
  }
}

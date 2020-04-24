'use strict'

import { TodoItem } from '../models/TodoItem'
import TodosPersistence from '../dal/TodosPersistence'
import { CreateTodoRequest, UpdateTodoRequest, UpdateTodoInput, FindTodoInput, DeleteTodoRequest } from '../requests'
import { GetTodosRequest } from '../requests/GetTodosRequest'

const persistence = new TodosPersistence()

export async function getAllTodos(request: GetTodosRequest): Promise<TodoItem[]> {
    return persistence.search(request.payload())
}

export async function createTodo(request: CreateTodoRequest): Promise<TodoItem> {
    return persistence.write(request.payload())
}

export async function deleteTodo(request: DeleteTodoRequest): Promise<boolean> {
    return persistence.delete(request.payload())
}

export async function updateTodo(request: UpdateTodoRequest): Promise<TodoItem> {
    const input: UpdateTodoInput = request.payload()
    const todo: TodoItem = await persistence.find(input as FindTodoInput)
    
    if (!todo) {
        throw new Error('Cannot find todo item to be updated!')
    }
    
    return persistence.update({ ...todo, ...input })
}

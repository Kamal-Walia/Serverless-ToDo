import * as aws from 'aws-sdk'
import * as xray from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'
import { CreateTodoInput, UpdateTodoInput, FindTodoInput } from '../requests'
import { createLogger } from '../utils/logger'

const DEFAULT_ATTACHMENT_URL = 'https://picsum.photos/800'
const xaws = xray.captureAWS(aws)
const logger = createLogger('todos-persistence')

export default class TodosPersistence {
    constructor(
        private readonly client: DocumentClient = dynamodb(),
        private readonly table: string = process.env.TODOS_TABLE,
        private readonly index: string = process.env.INDEX_NAME
    ) {
        // N/A
    }

    async dump(): Promise<TodoItem[]> {
        const data = await this.client.scan({
            TableName: this.table,
        }).promise()

        return data.Items as TodoItem[]
    }

    async search(input: FindTodoInput): Promise<TodoItem[]> {
        let todos = []
        
        await this.client.query({
            TableName: this.table,
            IndexName: this.index,
            KeyConditionExpression: "userId = :me",
            ExpressionAttributeValues: {
                ":me": input.userId
            }
        }, (error, data) => {
            if (error) {
                logger.error('Unable to find item. Error JSON:', { context: JSON.stringify(error, null, 2) })
            } else {    
                todos = data.Items

                logger.info('GetItem succeeded:', { context: JSON.stringify(data, null, 2) })
            }
        }).promise()

        return todos as TodoItem[]
    }

    async find(input: FindTodoInput): Promise<TodoItem> {
        let object: any
        
        await this.client.get({
            TableName: this.table,
            Key: { userId: input.userId, todoId: input.todoId, },
        }, (error, data) => {
            object = data

            if (error) {
                logger.error('Unable to find item. Error JSON:', { context: JSON.stringify(error, null, 2) })
            } else {    
                logger.info('GetItem succeeded:', { context: JSON.stringify(data, null, 2) })
            }
        }).promise()
        
        return (object) ? object.Item : null
    }

    async write(input: CreateTodoInput): Promise<TodoItem> {
        const object: TodoItem = {
            todoId: uuid.v4(),
            done: false,
            attachmentUrl: DEFAULT_ATTACHMENT_URL,
            createdAt: new Date().toISOString(),
            ...input,
        }

        logger.info('Storing new item: ', object)
        await this.client.put({
            TableName: this.table,
            Item: object,
        }).promise()
        
        return object
    }

    async update(input: UpdateTodoInput): Promise<TodoItem|null> {
        let updated: any
        
        await this.client.update({
            TableName: this.table,
            Key: { userId: input.userId, todoId: input.todoId, },
            ConditionExpression: 'userId = :userId and todoId = :todoId',
            UpdateExpression: 'set #nom = :nom, dueDate = :dueDate, done = :done, attachmentUrl = :url',
            ExpressionAttributeNames: {
                '#nom': 'name',
            },
            ExpressionAttributeValues: {
                ':todoId': input.todoId,
                ':userId': input.userId,
                ':nom': input.name,
                ':dueDate': input.dueDate || new Date().toISOString(),
                ':done': input.done || false,
                ':url': input.attachmentUrl || DEFAULT_ATTACHMENT_URL,
            },
            ReturnValues:'UPDATED_NEW',
        }, (error, data) => {
            updated = data

            if (error) {
                logger.error('Unable to update item. Error JSON:', { context: JSON.stringify(error, null, 2) })
            } else {    
                logger.info('UpdateItem succeeded:', { context: JSON.stringify(data, null, 2) })
            }
        }).promise()
        
        return (updated) ? updated.Attributes as TodoItem : null
    }

    async delete(input: FindTodoInput): Promise<boolean> {
        let state: boolean
        
        await this.client.delete({
            TableName: this.table,
            Key: { userId: input.userId, todoId: input.todoId },
        }, (error, data) => {
            if (error) {
                state = false

                logger.error('Unable to delete item. Error JSON:', { context: JSON.stringify(error, null, 2) })
            } else {
                state = true
                
                logger.info('DeleteItem succeeded:', { context: JSON.stringify(data, null, 2) })
            }
        }).promise()

        return state
    }
}

function dynamodb(): DocumentClient {
    return new xaws.DynamoDB.DocumentClient()
}
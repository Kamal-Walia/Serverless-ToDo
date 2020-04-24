'use strict'

import { APIGatewayProxyEvent, CustomAuthorizerEvent } from "aws-lambda"
import { bearer, jwt } from "../utils/auth"

export type AWSEvent = APIGatewayProxyEvent | CustomAuthorizerEvent

export default class Request {
    private readonly source: AWSEvent

    private bearer: string

    private me: string|null
    
    constructor(event: AWSEvent) {
        this.source = event
        this.bearer = ''
        this.me = null
    }

    event(): AWSEvent {
        return this.source
    }

    payload(): any {
        return {}
    }
    
    token(): string|null {
        if (this.bearer.length > 0) {
            return this.bearer
        }
        
        if (!this.source.hasOwnProperty('authorizationToken')) {
            return null
        }
        
        const event = this.source as any
        const header: string|null = event.authorizationToken

        if (!header) {
            throw new Error('No authentication header')
        }

        this.bearer = bearer(header)
        
        return this.bearer
    }
    
    user(): string|null {
        if (this.me) {
            return this.me
        }
        
        if (this.bearer.length <= 0) {
            this.bearer = bearer(this.source.headers.Authorization)
        }

        this.me = jwt(this.bearer).sub || null

        return this.me
    }
}
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import Request from '../../requests/Request'
import { authenticate, policy } from '../../utils/auth'

const logger = createLogger('auth')

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
        const request: Request = new Request(event)

        await authenticate(request.token())
        logger.info('User was authorized')

        return policy.allow(request.user())
    } catch (e) {
        logger.error('User not authorized', { error: e.message })

        return policy.deny('user')
    }
}

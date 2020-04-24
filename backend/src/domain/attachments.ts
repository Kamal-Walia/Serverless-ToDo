'use strict'

import * as aws from 'aws-sdk'
import * as xray from 'aws-xray-sdk'
import * as uuid from 'uuid'
import { UploadTodoRequest } from '../requests'

const xaws = xray.captureAWS(aws)
const s3 = new xaws.S3({ signatureVersion: 'v4' })
const bucket = (key: string): any => {
    return {
        Bucket: process.env.IMAGES_S3_BUCKET,
        Key: `uploads/${key}`,
        Expires: +process.env.SIGNED_URL_EXPIRATION
    }
}

export function signedPutURL(request: UploadTodoRequest): Object {
    const id = request.payload().todoId
    
    if (id.length <= 0) {
        throw new Error('signed upload url id cannot be empty')
    }

    if (id.includes('/') || id.includes('\\')) {
        throw new Error('signed upload url ids cannot contain directory separators')
    }

    const config = bucket(`${id}/${uuid.v4()}`)
    
    return {
        upload: s3.getSignedUrl('putObject', config),
        download: `https://${config.Bucket}.s3.amazonaws.com/${config.Key}`,
    }
}

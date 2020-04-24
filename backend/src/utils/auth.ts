'use strict'

import { decode, verify } from 'jsonwebtoken'
import { JwtPayload } from '../models/JwtPayload'
import { CustomAuthorizerResult } from 'aws-lambda'

export async function authenticate(token: string): Promise<JwtPayload> {
    return verify(token, certificate, { algorithms: ['RS256'] }) as JwtPayload
}

export function jwt(token: string): JwtPayload {
    return decode(token) as JwtPayload
}

export function bearer(header: string): string {
    if (!header.toLowerCase().startsWith('bearer ')) {
        throw new Error('Invalid authentication header format')
    }
    
    return header.split(' ').pop() || ''
}

export const policy = {
    allow: (principal: string): CustomAuthorizerResult => policy.document(principal, 'Allow'),
    deny: (principal: string): CustomAuthorizerResult => policy.document(principal, 'Deny'),
    document: (principal: string, effect: string): CustomAuthorizerResult => {
        return {
            principalId: principal,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

const certificate = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJFHirz5it7KHqMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1sbDZhcnFqNC5hdXRoMC5jb20wHhcNMjAwNDI0MTA1MTA3WhcNMzQw
MTAxMTA1MTA3WjAhMR8wHQYDVQQDExZkZXYtbGw2YXJxajQuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0cgLg/gAQUYa5RKSAfEovsHR
0uzhilaU5pfXvlLU41TRNRzYfnovlIrbXFVuky3jHtXwCqZ/dmgxmYpOldOcafdR
jIQ+MZjBYjr/kNjgNngT+yn5dsrZI/j7NKMizChgQOXpKrMDp7GiEWZQc4qapd2T
pJyPf1Bl9/KvZhMuADUQCyt7imTNpz3BiN3hiwqshYvR3bJk4AERa+kSenbbDqnG
DbAQXeTeIgHB673CsfA+YsqEFWD91M2yj//0e3mrENraba5z3n5novSg6ocRqKiY
WP+c2W6RMHbRiaGgP9EMrcZeAKgmNiZPwNRqdbh0L4mO4XkeOF7eVILagE4t2wID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTc0hDyfHwZJwOF4oCQ
cniL3xWMLDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAEMoZ2cE
nxpbAcUgRAyl7t6op2ah4W9M6oVb4YM/HjyPIEj1vX07WnMufcv840LMv/NhquFl
khXwHemMA51DZHjFKRMozmH7crPge/AruSqYwEQc5A4fawDs2565rEIDgITcgLSY
+OUmFSpn5RN3e0+Q4PtUiZdg7rX+M7Ppd43LFZ8eJCLwp/qqzCLh8UP9uW2DesZe
iICWipjEsyxdqoefcFgRO/rjK+rsu72CNpFwuKrrWb8C267cczEjeXFXUE2G3YQh
2hMDF0vZoflHnNipB24nv6AiRa7Hh/19xn9v9RhTPoS6Ya/pX7amcUtaw3WLt9Yy
pxYBZrNLP9vOW9M=
-----END CERTIFICATE-----`
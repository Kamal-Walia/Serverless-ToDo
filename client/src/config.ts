// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'drqhhtxt9k'
export const apiEndpoint = `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ll6arqj4.auth0.com',            // Auth0 domain
  clientId: 'DpZLYnoUupi2zx4oBdZ6lLf7VtzwCSut',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

import type { Express } from 'express';
import { auth } from 'express-openid-connect';


export default function authMiddleware(app: Express) {
  app.use(auth({
    authRequired: false,
    issuerBaseURL: process.env.OIDC_ISSUER_URL,
    baseURL: 'http://localhost:3000',
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    secret: process.env.SESSION_PASSWORD,
    authorizationParams: {
      response_type: 'code',
      scope: "openid email"
    },
    //https://stackoverflow.com/a/66769389
    //cognitoの場合、logoutのときは、post_logout_redirect_uriではなく、logout_uriらしい
    // logoutParams: { for Cognito
    //   logout_uri: "http://localhost:3000",
    //   client_id: process.env.OIDC_CLIENT_ID
    // },
    idpLogout: true,

  }));


}
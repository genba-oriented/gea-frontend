import type { Express, Request, Response } from 'express';
import { auth } from 'express-openid-connect';


export default function authMiddleware(app: Express) {
  app.use(auth({
    authRequired: false,
    issuerBaseURL: process.env.OIDC_ISSUER_URL,
    baseURL: 'http://localhost:3000',
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    secret: process.env.SESSION_PASSWORD,
    //https://stackoverflow.com/a/66769389
    //cognitoの場合、logoutのときは、post_logout_redirect_uriではなく、logout_uriらしい
    // logoutParams: { for Cognito
    //   logout_uri: "http://localhost:3000",
    //   client_id: process.env.OIDC_CLIENT_ID
    // },
    idpLogout: true,
    routes: {
      login: false
    },
    authorizationParams: {
      response_type: 'code',
      scope: "openid email",
    }
  }));


  app.get('/login', (req: Request, res: Response) => {
    const returnTo = req.query.afterAuth ? req.query.afterAuth as string : "/";
    res.oidc.login({
      returnTo: returnTo,
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
      },
    });
  });

}
import type { Express, Request, Response } from 'express';
import "express-session"; // for req.session
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextFunction } from 'http-proxy-middleware/dist/types';

export default function proxyMiddleware(app: Express) {
  const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    if (req.oidc?.accessToken == null) {
      next();
      return;
    }
    let { isExpired, refresh, } = req.oidc.accessToken;
    if (isExpired()) {
      try {
        await refresh();
        console.log("refreshed");
      } catch (error) {
        console.log(error);
        // リフレッシュトークンが無効なので、セッションを破棄する
        req.session.destroy((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("session destroyed.");
          }
        });
      }
    }
    next();
  };

  const proxyMiddleware = createProxyMiddleware<Request, Response>({
    target: process.env.API_BASE_URL,
    changeOrigin: true,
    xfwd: true,
    on: {
      proxyReq: async (proxyReq, req, res) => {
        proxyReq.removeHeader("Cookie");
        if (req.oidc?.accessToken != null) {
          proxyReq.setHeader('Authorization', "Bearer " + req.oidc.accessToken.access_token);
        }
      },
    }
  });

  app.use('/api', refreshToken, proxyMiddleware);
}
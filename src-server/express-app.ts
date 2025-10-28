import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from "helmet";
import authMiddleware from './auth-middleware';
import csrfMiddleware from './csrf-middleware';
import errorHandlerMiddleware from './error-handler-middleware';
import proxyMiddleware from './proxy-middleware';
import stubMiddleware from './stub-middleware';


export const app = express();
// セキュリティ関連のレスポンスヘッダを付けてくれる
// JavaScriptによる画像のロードを許可する　https://stackoverflow.com/a/78792462
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "blob:", "data:"],
      },
    },
  }),
);
app.use(cookieParser());
csrfMiddleware(app);
authMiddleware(app);
if (process.env.API_STUB != "true") {
  proxyMiddleware(app);
} else {
  stubMiddleware(app);
}
errorHandlerMiddleware(app);


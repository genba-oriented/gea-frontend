import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Express } from 'express';
import helmet from "helmet";
import proxy from "./api-proxy";
import authCallback from "./auth-callback";
import csrf from "./csrf";
import errorHandler from "./error-handler";
import logout from "./logout";
import session from "./session";
import startAuth from "./start-auth";
import stub from "./stub/api-stub";

export const addMiddlewares = (app: Express) => {

  app.use(helmet({ // セキュリティ関連のレスポンスヘッダを付けてくれる
    contentSecurityPolicy: false // for monaco editor
  }));
  app.use(cookieParser());
  app.use(csrf);
  app.use(session);
  app.use("/start-auth", startAuth);
  app.use("/auth-callback", authCallback);

  if (process.env.API_STUB != "true") {
    app.use("/api/*", bodyParser.raw({
      limit: "2mb",
      type: "*/*"
    }), proxy);
  } else {
    console.log("!!! use api stub");
    stub(app);
  }
  app.use("/logout", logout);
  app.use(errorHandler);
  return app;
};





import { Express, NextFunction, Request, Response } from 'express';
import { v4 } from "uuid";

export default function meMiddleware(app: Express) {
  app.use("/me", (req: Request, res: Response) => {
    if (req.oidc == null) {
      
    }
  });
}


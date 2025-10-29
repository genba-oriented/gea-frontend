
import { Express, Request, Response } from 'express';

export default function meMiddleware(app: Express) {
  app.use("/me", (req: Request, res: Response) => {
    if (req.oidc.isAuthenticated()) {
      res.json({
        name: req.oidc.user.preferred_username
      });
    } else {
      res.json({
        name: null
      });
    }
  });
}


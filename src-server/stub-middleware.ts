import type { Express } from 'express';
import { buy } from './stub/buy';
import { catalog } from './stub/catalog';
import { review } from './stub/review';
import { sell } from './stub/sell';
import { user } from './stub/user';

export default function stubMiddleware(app: Express) {
  console.log("!!! use api stub");
  catalog(app);
  review(app);
  user(app);
  buy(app);
  sell(app);
  app.use("/api/*splat", (req, res) => {
    res.status(404);
    res.send("api not found !");
  });


}
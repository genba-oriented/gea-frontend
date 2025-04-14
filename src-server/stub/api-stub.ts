import { Express } from 'express';
import { buy } from './buy';
import { catalog } from './catalog';
import { review } from './review';
import { sell } from './sell';
import { user } from './user';


export default function stub(app: Express) {
  catalog(app);
  review(app);
  user(app);
  buy(app);
  sell(app);
  app.use("/api/*", (req, res) => {
    res.status(404);
    res.send("api not found !");
  });
}


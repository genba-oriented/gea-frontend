
import express, { Request, Response } from "express";
import { addMiddlewares } from "./app-middlewares";

const baseDir = process.cwd();

const app = express();

addMiddlewares(app);

app.use(express.static(baseDir + "/dist"));
app.get('/{*splat}', (req: Request, res: Response) => {
  res.sendFile(baseDir + "/dist/index.html");
});

const port = 3000;

app.listen(port, (error) => {
  if (error != null) {
    console.error(error);
    return;
  }
  console.log(`Server is running at port ${port}`);
});


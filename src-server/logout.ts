import { NextFunction, Request, Response } from 'express';
import { getSession } from './session';


export default async function doFilter(req: Request, res: Response, next: NextFunction) {
  if (req.method != "POST") {
    res.status(400).send("logout must be POST");
    return;
  }
  const session = getSession(req);
  session.destroy();
  res.status(200).send("logout success");
}


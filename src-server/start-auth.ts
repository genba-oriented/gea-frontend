import { NextFunction, Request, Response } from 'express';
import { getAuthenticationRequestUrl } from './oidc';
import { getSession } from './session';


export default async function doFilter(req: Request, res: Response, next: NextFunction) {

  let afterAuth = req.query.afterAuth;
  if (afterAuth != null) {
    const session = getSession(req);
    await session.setData("afterAuth", afterAuth);
  }

  try {
    const url = await getAuthenticationRequestUrl(req, res);
    res.redirect(url);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).send("oidc error");
    return;
  }
}


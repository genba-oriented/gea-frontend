import { NextFunction, Request, Response } from 'express';
import { retrieveTokens } from './oidc';
import { getSession } from './session';


export default async function doFilter(req: Request, res: Response, next: NextFunction) {
  try {
    await retrieveTokens(req, res);

  } catch (error) {
    console.error(error);
    res.status(400).send("oidc error");
    return;
  }

  const session = getSession(req);
  let afterAuth = session.getData("afterAuth");
  if (afterAuth == null) {
    afterAuth = "/mypage";
  } else {
    await session.removeData("afterAuth");
  }
  res.redirect(afterAuth);
  return;

}


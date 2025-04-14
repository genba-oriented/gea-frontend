
import { NextFunction, Request, Response } from 'express';
import { IronSession, getIronSession } from "iron-session";



export default async function doFilter(req: Request, res: Response, next: NextFunction) {
  const ironSession = await createIronSession(req, res);
  const session = new Session(ironSession);
  req["_session"] = session;
  next();
}


export class Session {
  ironSession: IronSession<object>;
  constructor(ironSession: IronSession<object>) {
    this.ironSession = ironSession;
  }
  async setData(name: string, data: any) {
    this.ironSession[name] = data;
    await this.ironSession.save();
  }
  getData(name: string) {
    return this.ironSession[name];
  }
  async removeData(name: string) {
    delete this.ironSession[name];
    await this.ironSession.save();
  }
  destroy() {
    this.ironSession.destroy();
  }
}


export function getSession(req: Request): Session {
  return req["_session"];
}


async function createIronSession(req: Request, res: Response) {
  if (process.env.SESSION_PASSWORD == null) {
    throw Error("環境変数SESSION_PASSWORDが設定されていない");
  }
  return await getIronSession(req, res, { password: process.env.SESSION_PASSWORD, cookieName: "session" });

}

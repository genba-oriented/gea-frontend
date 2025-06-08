import { NextFunction, Request, Response } from 'express';
import { Dispatcher, request } from 'undici';
import { getIdToken } from './oidc';

export default async function doFilter(req: Request, res: Response, next: NextFunction) {
  const idToken = await getIdToken(req, res);
  try {
    await proxy(req, res, idToken);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function proxy(req: Request, res: Response, token: string) {

  const orgUrl = new URL(req.protocol + '://' + req.headers.host + req.originalUrl);
  const apiBaseUrl = process.env.API_BASE_URL;
  if (apiBaseUrl == null) {
    throw Error("環境変数API_BASE_URLが設定されてない");
  }
  const newUrl = apiBaseUrl + orgUrl.pathname.replace("/api/", "/") + orgUrl.search;

  const headers = {};
  for (const key of Object.keys(req.headers)) {
    const val = req.headers[key];
    headers[key] = val;
  }

  headers["X-Forwarded-Proto"] = orgUrl.protocol.replace(":", "");
  headers["X-Forwarded-Host"] = orgUrl.hostname;
  headers["X-Forwarded-Port"] = orgUrl.port;
  if (token != null) {
    headers["Authorization"] = "Bearer " + token;
  }
  // Cookieは削除
  delete headers["cookie"];

  // bodyが空の場合、Express 5だとundefinedになる様子(Express 4だと{}だった)
  const body = req.body == null ? null : req.body;

  const apiRes = await request(newUrl, {
    method: req.method as Dispatcher.HttpMethod,
    headers: headers,
    body: body
  });

  res.statusCode = apiRes.statusCode;
  res.setHeaders(new Map(Object.entries(apiRes.headers)));
  const chunk = await apiRes.body.arrayBuffer();
  res.write(new Uint8Array(chunk));
  res.end();

}


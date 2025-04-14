
import { NextFunction, Request, Response } from 'express';
import { v4 } from "uuid";


export default function doFilter(req: Request, res: Response, next: NextFunction) {
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH" || req.method == "DELETE") {
    if (!checkCsrfToken(req, res)) {
      res.status(403).send("csrf error");
      return;
    }
  }
  if (req.cookies["csrf"] == null) {
    embedCsrfToken(req, res);
  }
  next();
}

function embedCsrfToken(req: Request, res: Response) {
  res.cookie("csrf", v4(), { path: "/" });
}

function checkCsrfToken(req: Request, res: Response) {
  const cToken = req.cookies["csrf"];
  const hToken = req.headers["x-csrf-token"];
  if (cToken == null || hToken == null) {
    return false;
  }
  return cToken == hToken ? true : false;
}
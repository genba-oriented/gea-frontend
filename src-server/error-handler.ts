import { NextFunction, Request, Response } from 'express';


export default function doFilter(error: any, req: Request, res: Response, next: NextFunction) {
  console.error("error in middleware");
  console.error(error);
  res.status(500).send("error in middleware");
}
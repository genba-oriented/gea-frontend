// @vitest-environment node
import express from "express";
import request from "supertest";
import { expect, test } from 'vitest';
import errorHandler from "./error-handler";


function getExpress() {
  const app = express();
  app.get("/foo", (req, res) => {
    throw new Error("foo");
  });
  app.get("/bar", (req, res, next) => {
    next(new Error("bar"));
  });
  app.use(errorHandler);
  return app;
}


test("throw exception", async () => {
  const app = getExpress();
  const res = await request(app).get("/foo");
  expect(res.status).toBe(500);
  expect(res.text).toBe("error in middleware");
});

test("set errot to next function", async () => {
  const app = getExpress();
  const res = await request(app).get("/bar");
  expect(res.status).toBe(500);
  expect(res.text).toBe("error in middleware");
});

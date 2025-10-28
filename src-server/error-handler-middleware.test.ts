// @vitest-environment node
import express from "express";
import request from "supertest";
import { expect, test } from 'vitest';
import errorHandlerMiddleware from "./error-handler-middleware";


function getExpress() {
  const app = express();
  app.get("/foo", (req, res) => {
    throw new Error("foo");
  });
  app.get("/bar", (req, res, next) => {
    next(new Error("bar"));
  });
  app.get("/async", async (req, res) => {
    throw new Error("foo");
  });
  errorHandlerMiddleware(app);
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

test("throw exception in async function", async () => {
  const app = getExpress();
  const res = await request(app).get("/async");
  expect(res.status).toBe(500);
  expect(res.text).toBe("error in middleware");
});

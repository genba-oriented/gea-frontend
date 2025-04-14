// @vitest-environment node
import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { expect, test } from 'vitest';
import csrf from "./csrf";


function getExpress() {
  const app = express();
  app.use(cookieParser());
  app.use(csrf);
  return app;
}
test("no csrf token", async () => {
  const app = getExpress();
  app.post("/foo", (req, res) => {
    res.send("ok");
  });
  const res = await request(app).post("/foo")
  expect(res.status).toBe(403);
});

test("invalid csrf token", async () => {
  const app = getExpress();
  app.post("/foo", (req, res) => {
    res.send("ok");
  });
  const res = await request(app).post("/foo")
    .set("X-CSRF-TOKEN", "aaa")
    .set("Cookie", "csrf=bbb");
  expect(res.status).toBe(403);

});

test("ok csrf token", async () => {
  const app = getExpress();
  app.post("/foo", (req, res) => {
    res.send("ok");
  });
  const res = await request(app).post("/foo")
    .set("X-CSRF-TOKEN", "aaa")
    .set("Cookie", "csrf=aaa");
  expect(res.status).toBe(200);
});


test("set csrf token cookie", async () => {
  const app = getExpress();
  app.get("/foo", (req, res) => {
    res.send("ok");
  });
  const res = await request(app).get("/foo");
  expect(res.headers["set-cookie"][0]).contain("csrf=");

});

// @vitest-environment node
import * as cookie from 'cookie';
import cookieParser from "cookie-parser";
import express from "express";
import request from "supertest";
import { expect, test } from 'vitest';
import csrf from "./csrf";
import logout from "./logout";
import session, { getSession } from "./session";

function getExpress() {
  const app = express();
  app.use(cookieParser());
  app.use(csrf);
  app.use(session);
  app.use("/logout", logout);
  return app;
}


test("logout success", async () => {
  const app = getExpress();
  app.get("/foo", async (req, res) => {
    const session = getSession(req);
    await session.setData("foo", "bar");
    res.send("ok");
  });

  const agent = request.agent(app);
  let res = await agent.get("/foo");

  expect(res.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringMatching(/session=.+/)]));

  const token = cookie.parse(res.headers["set-cookie"][0]).csrf;

  res = await agent.post("/logout")
    .set("X-CSRF-TOKEN", token);
  expect(res.status).toBe(200);
  expect(res.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringMatching("session=")]));

});

test("logout by get fail", async () => {
  const app = getExpress();
  const res = await request(app).get("/logout");
  expect(res.status).toBe(400);
  expect(res.text).toBe("logout must be POST");
})



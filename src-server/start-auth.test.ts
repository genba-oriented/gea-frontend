// @vitest-environment node
import express from "express";
import request from "supertest";
import { expect, test } from 'vitest';
import session, { getSession } from "./session";
import startAuth from "./start-auth";


function getExpress() {
  const app = express();
  app.use(session);
  app.use("/start-auth", startAuth);
  return app;
}


test("start auth with afterAuth", async () => {
  const app = getExpress();
  app.get("/foo", (req, res) => {
    const session = getSession(req);
    res.json(session.getData("AuthRequestParams"));
  });

  app.get("/bar", (req, res) => {
    const session = getSession(req);
    res.send(session.getData("afterAuth"));
  });

  const agent = request.agent(app);
  let res = await agent.get("/start-auth")
    .query("afterAuth=/foo")
    ;
  expect(res.status).toBe(302);
  expect(res.headers["location"]).toBeDefined();

  const cookie = res.headers["set-cookie"][1];//secure cookieは送信できない様子　https://github.com/ladjs/supertest/issues/825

  res = await agent.get("/foo").set("Cookie", cookie);
  expect(res.body.code_verifier).toBeDefined();
  expect(res.body.state).toBeDefined();

  res = await agent.get("/bar").set("Cookie", cookie);
  expect(res.text).toBe("/foo");

});




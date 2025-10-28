// @vitest-environment node

import { setupMsw } from "@/util/test-utils";
import type { Request, Response } from 'express';
import express, { NextFunction } from "express";
import { http, HttpResponse } from "msw";
import request from "supertest";
import { expect, test } from "vitest";
import proxyMiddleware from "./proxy-middleware";


const server = setupMsw();

test("proxy no token", async () => {
  server.use(
    http.get(process.env.API_BASE_URL + "/foo", ({ request }) => {
      if (request.headers.get("Cookie") != null) {
        return;
      }
      if (request.headers.get("x-forwarded-proto") == null) {
        return;
      }
      if (request.headers.get("x-forwarded-host") == null) {
        return;
      }
      if (request.headers.get("x-forwarded-port") == null) {
        return;
      }
      if (request.headers.get("authorization") != null) {
        return;
      }
      return new HttpResponse("ok", { status: 200 });

    })
  );

  const app = express();
  proxyMiddleware(app);
  const res = await request(app).get("/api/foo").set("Cookie", "foo");
  expect(res.text).toBe("ok");

});



test("proxy with token", async () => {
  server.use(
    http.get(process.env.API_BASE_URL + "/bar", ({ request }) => {
      if (request.headers.get("authorization") != "Bearer my-token") {
        return;
      }
      return new HttpResponse("ok", { status: 200 });
    })
  );

  const app = express();
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.oidc = <any>{};
    req.oidc.accessToken = <any>{};
    req.oidc.accessToken.access_token = "my-token";
    req.oidc.accessToken.refresh = async () => null;
    req.oidc.accessToken.isExpired = () => false;
    next();
  });
  proxyMiddleware(app);

  const res = await request(app).get("/api/bar");
  expect(res.text).toBe("ok");

});

test("proxy with request body", async () => {
  server.use(
    http.post(process.env.API_BASE_URL + "/body", async ({ request }) => {
      if (await request.text() != "this is body") {
        return;
      }
      return new HttpResponse("ok", { status: 200 });
    })
  );

  const app = express();
  proxyMiddleware(app);
  const res = await request(app).post("/api/body").send("this is body");
  expect(res.text).toBe("ok");

});

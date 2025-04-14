// @vitest-environment node

import { setupVi } from "@/util/test-utils";
import bodyParser from "body-parser";
import express, { Request } from "express";
import request from "supertest";
import { MockAgent, setGlobalDispatcher } from "undici";
import { expect, test, vi } from "vitest";
import proxy from "./api-proxy";
import session from "./session";

function getExpress() {
  const app = express();
  app.use(session);
  app.use("/api/*", bodyParser.raw({
    limit: "2mb",
    type: "*/*"
  }), proxy);
  return app;
}

// MSWでUndiciのモック化はできない様子　https://github.com/mswjs/msw/issues/2165
// UndiciのMockAgentでモック化する
function getMockAgent() {
  const mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
  return mockAgent;
}


const apiBaseUrl = process.env.API_BASE_URL;

setupVi();
// vi.mockは、hoisted(自動的にファイルの先頭に移動される)される。
// testメソッドの中で呼び出すとtestメソッド固有のMockと誤解されるため、testメソッドの外で定義する
vi.mock("./oidc", () => {
  return {
    getIdToken: (req: Request) => {
      if (req.originalUrl == "/api/foo") {
        return null;
      }
      return "my-token";
    }
  }
})


test("proxy no token", async () => {
  const mockAgent = getMockAgent();
  mockAgent.get(apiBaseUrl).intercept({
    method: "GET", path: "/foo", headers: (headers) => {
      if (headers["x-forwarded-proto"] != "http") {
        return false;
      }
      if (headers["x-forwarded-host"] == null) {
        return false;
      }
      if (headers["x-forwarded-port"] == null) {
        return false;
      }
      if (headers["cookie"] != null) {
        return false;
      }
      if (headers["authorization"] != null) {
        return false;
      }
      return true;
    }
  }).reply(200, "ok");

  const app = getExpress();
  const res = await request(app).get("/api/foo").set("Cookie", "foo");
  expect(res.text).toBe("ok");

});


test("proxy with token", async () => {
  const mockAgent = getMockAgent();
  mockAgent.get(apiBaseUrl).intercept({
    method: "GET", path: "/bar", headers: (headers) => {
      if (headers["authorization"] != "Bearer my-token") {
        return false;
      }
      return true;
    }
  }).reply(200, "ok");


  const app = getExpress();
  const res = await request(app).get("/api/bar");
  expect(res.text).toBe("ok");

});


import { ErrorDialogModel } from "@/model/util/ErrorDialogModel";
import Cookies from "js-cookie";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { Api } from "./Api";
import { setupMsw } from "./test-utils";

const server = setupMsw();

test("add csrf token header", async () => {
  server.use(
    http.get("/foo", ({ request }) => {
      if (request.headers.get("X-CSRF-TOKEN") == "csrf-token") {
        return HttpResponse.text("ok");
      }
      return; //fail
    })
  );
  Cookies.set("csrf", "csrf-token");
  const api = new Api(null);
  const body = await api.fetch("/foo").then(res => res.text());
  expect(body).toBe("ok");

});

test("content type json", async () => {
  server.use(
    http.post("/foo", ({ request }) => {
      if (request.headers.get("Content-Type") == "application/json") {
        return HttpResponse.text("ok");
      }
      return; //fail
    })
  );
  const api = new Api(null);
  const body = await api.fetch("/foo", { method: "POST" }).then(res => res.text());
  expect(body).toBe("ok");

});


test("content type file", async () => {
  server.use(
    http.post("/foo", ({ request }) => {
      if (request.headers.get("Content-Type").startsWith("multipart/form-data")) {
        return HttpResponse.text("ok");
      }
      return; //fail
    })
  );
  const api = new Api(null);
  const formData = new FormData();
  formData.append("file", new File(["foo"], "foo.txt"));
  const body = await api.fetch("/foo", { method: "POST", body: formData }).then(res => res.text());
  expect(body).toBe("ok");

});

test("connection error", async () => {
  server.use(
    http.get("/foo", ({ request }) => {
      return; HttpResponse.error();
    })
  );
  const errorDialogModel = new ErrorDialogModel();
  const api = new Api(errorDialogModel);
  try {
    await api.fetch("/foo").then(res => res.json());
  } catch (error) {
    expect(errorDialogModel.message == null).toBe(false);
  }

});

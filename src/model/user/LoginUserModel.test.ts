import { Api } from "@/util/Api";
import { setupMsw } from "@/util/test-utils";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { LoginUserModel } from "./LoginUserModel";

const server = setupMsw();

test("not logined", async () => {
  server.use(
    http.get("/api/user/users/me", () => {
      return new HttpResponse(null, { status: 401 });
    })
  );

  const api = new Api(null);
  const loginUserModel = new LoginUserModel(api);
  await loginUserModel.load();
  expect(loginUserModel.logined).toBe(false);


}); 

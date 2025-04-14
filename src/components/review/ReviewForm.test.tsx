import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { setupMsw, setupRtl } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { ReviewForm } from "./ReviewForm";

const server = setupMsw();
setupRtl();

test("review as buyer", async () => {

  server.use(
    http.get("/api/review/rated-users/u02", () => {
      return HttpResponse.text(`
{
  "userId" : "u02",
  "userName" : "uname02",
  "reviewCount" : 10,
  "averageScore" : 4.3
}        
        `);
    }),
    http.post("/api/review/reviews", async ({ request }) => {
      const body = await request.clone().json();
      if (body.asBuyer == true && body.comment == "foo") {
        return new HttpResponse();
      }
      return; // fail
    })
  );

  const api = new Api(null);

  const user = userEvent.setup();
  let callbacked = false;

  render(
    <ApiProvider value={api}>
      <ReviewForm sellId="s01" revieweeId="u02" reviewAsBuyer={true} callback={() => {
        callbacked = true;
      }} />
    </ApiProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("uname02さんを評価してください"));
  });

  await user.type(screen.getByRole("textbox"), "foo");
  await user.click(screen.getByText("評価する"));
  expect(callbacked).toBe(true);

});

test("review as seller", async () => {

  server.use(
    http.get("/api/review/rated-users/u02", () => {
      return HttpResponse.text(`
{
  "userId" : "u02",
  "userName" : "uname02",
  "reviewCount" : 10,
  "averageScore" : 4.3
}        
        `);
    }),
    http.post("/api/review/reviews", async ({ request }) => {
      const body = await request.clone().json();
      if (body.asBuyer == false && body.comment == "foo") {
        return new HttpResponse();
      }
      return; // fail
    })
  );

  const api = new Api(null);
  const user = userEvent.setup();
  let callbacked = false;

  render(
    <ApiProvider value={api}>
      <ReviewForm sellId="s01" revieweeId="u02" reviewAsBuyer={false} callback={() => {
        callbacked = true;
      }} />
    </ApiProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("uname02さんを評価してください"));
  });

  await user.type(screen.getByRole("textbox"), "foo");
  await user.click(screen.getByText("評価する"));
  expect(callbacked).toBe(true);

});
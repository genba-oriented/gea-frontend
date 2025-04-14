
import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { setupMsw } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test } from "vitest";
import { BuyingPage } from "./BuyingPage";

const server = setupMsw();

test("show dialog after buy", async () => {
  server.use(
    http.get("/api/user/users/me", () => {
      return HttpResponse.text(`
{
  "id" : "u01",
  "name" : "uname01",
  "email" : "u01@example.com",
  "idpUserId" : "idp01",
  "balance" : 30000,
  "shippingAddress" : "address01"
}
        `);
    }),
    http.get("/api/catalog/sells/s01", async () => {
      return HttpResponse.text(`
{
  "id" : "s01",
  "userId" : "u02",
  "productName" : "pname01",
  "description" : "desc01",
  "price" : 1000,
  "productImageIds" : [ "pi01", "pi0" ]
}
          `);
    }),
    http.get("/api/review/rated-users/u02", async () => {
      return HttpResponse.text(`
{
  "userId" : "u02",
  "userName" : "uname02",
  "reviewCount" : 10,
  "averageScore" : 4.3
}        
        `);
    }),
    http.post("/api/buy/buys", async () => {
      return new HttpResponse(null, {
        headers: { "Location": "/api/buy/buys/b01" }
      })
    })
  );

  const api = new Api(null);

  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/buy/buying/s01"]}>
        <Routes>
          <Route path="/buy/buying/:sellId" element={<BuyingPage />} />
          <Route path="/buy/detail/b01" element={<div>test pass</div>} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("購入する")).toBeVisible();
  });

  const user = userEvent.setup();
  await user.click(screen.getByText("購入する"));

  await waitFor(() => {
    expect(screen.getByText("商品を購入しました")).toBeVisible();
  });

  await user.click(screen.getByText("OK"));

  await waitFor(() => {
    expect(screen.getByText("test pass")).toBeVisible();
  });
});
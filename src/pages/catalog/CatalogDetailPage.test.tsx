import { LoginUserModel } from "@/model/user/LoginUserModel";
import { LoginUserModelProvider } from "@/model/user/LoginUserModelProvider";
import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { setupMsw, setupRtl } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test } from "vitest";
import { CatalogDetailPage } from "./CatalogDetailPage";

const server = setupMsw();
setupRtl();

test("sell by myself", async () => {
  server.use(
    http.get("/api/catalog/sells/s01", () => {
      return HttpResponse.text(`

        {
          "id" : "s01",
          "userId" : "u01",
          "productName" : "pname01",
          "description" : "desc01",
          "price" : 1000,
          "productImageIds" : [ "pi01", "pi0" ]
        }        
        `);
    })
  );
  const userModel = new LoginUserModel(null);
  userModel.id = "u01";
  const api = new Api(null);
  render(
    <LoginUserModelProvider value={userModel}>
      <ApiProvider value={api}>
        <MemoryRouter initialEntries={["/catalog/detail/s01"]}>
          <Routes>
            <Route path="/catalog/detail/:id" element={<CatalogDetailPage />} />
            <Route path="/sell/detail/s01" element={<div>test pass</div>} />
          </Routes>
        </MemoryRouter>
      </ApiProvider>
    </LoginUserModelProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("test pass")).toBeVisible();
  });

});


test("bought by myself", async () => {
  server.use(
    http.get("/api/catalog/sells/s01", () => {
      return HttpResponse.text(`

        {
          "id" : "s01",
          "userId" : "u01",
          "productName" : "pname01",
          "description" : "desc01",
          "price" : 1000,
          "sold" : true,
          "productImageIds" : [ "pi01", "pi0" ]
        }        
        `);
    }),
    http.get("/api/buy/buys", ({ request }) => {
      const sellId = new URL(request.url).searchParams.get("sellId");
      if (sellId != "s01") {
        return null; //fail
      }
      return HttpResponse.text(`
[ {
  "id" : "b01",
  "sellId" : "s01",
  "sell" : {
    "id" : "s01",
    "productName" : "pname01",
    "price" : 2000,
    "shippedDateTime" : "2025-02-04T02:02:02",
    "completedDateTime" : "2025-02-05T02:02:02",
    "status" : "NEED_SHIPPING",
    "productImages" : [ {
      "id" : "pi01"
    }, {
      "id" : "pi02"
    } ]
  },
  "buyDateTime" : "2025-02-02T01:01:01"
} ]
  `);
    })
  );
  const userModel = new LoginUserModel(null);
  userModel.id = "u02";
  const api = new Api(null);
  render(
    <LoginUserModelProvider value={userModel}>
      <ApiProvider value={api}>
        <MemoryRouter initialEntries={["/catalog/detail/s01"]}>
          <Routes>
            <Route path="/catalog/detail/:id" element={<CatalogDetailPage />} />
            <Route path="/buy/detail/b01" element={<div>test pass</div>} />
          </Routes>
        </MemoryRouter>
      </ApiProvider>
    </LoginUserModelProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("test pass")).toBeVisible();
  });

});


test("show normally", async () => {
  server.use(
    http.get("/api/catalog/sells/s01", () => {
      return HttpResponse.text(`

        {
          "id" : "s01",
          "userId" : "u01",
          "productName" : "pname01",
          "description" : "desc01",
          "price" : 1000,
          "sold" : false,
          "productImageIds" : [ "pi01", "pi0" ]
        }        
        `);
    }),
    http.get("/api/review/rated-users/u01", () => {
      return HttpResponse.text(`
{
  "userId" : "u01",
  "userName" : "uname01",
  "reviewCount" : 10,
  "averageScore" : 4.3
}
        `);
    })
  );
  const userModel = new LoginUserModel(null);
  userModel.id = "u03";
  const api = new Api(null);
  render(
    <LoginUserModelProvider value={userModel}>
      <ApiProvider value={api}>
        <MemoryRouter initialEntries={["/catalog/detail/s01"]}>
          <Routes>
            <Route path="/catalog/detail/:id" element={<CatalogDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ApiProvider>
    </LoginUserModelProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("購入の手続きをする")).toBeVisible();
  });

});

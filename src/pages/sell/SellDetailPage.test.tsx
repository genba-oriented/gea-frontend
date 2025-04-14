import { ErrorDialogModel } from "@/model/util/ErrorDialogModel";
import { ErrorDialogModelProvider } from "@/model/util/ErrorDialogModelProvider";
import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { setupMsw, setupRtl } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test } from "vitest";
import { ErrorDialog } from "../ErrorDialog";
import { SellDetailPage } from "./SellDetailPage";

const server = setupMsw();
setupRtl();

function getSellJson(status) {
  return `
  {
    "id" : "s01",
    "userId" : "u01",
    "productName" : "pname01",
    "description" : "desc01",
    "price" : 1000,
    "sellDateTime" : "2025-02-03T10:10:10",
    "editDateTime" : "2025-02-01T10:10:10",
    "shippedDateTime" : "2025-02-04T10:10:10",
    "completedDateTime" : "2025-02-05T10:10:10",
    "status" : "${status}",
    "productImages" : [ {
      "id" : "pi01"
    }, {
      "id" : "pi02"
    } ]
  }
        `;
}

function getBuyerJson() {
  return `
{
  "userId" : "u01",
  "userName" : "uname01",
  "address" : "address01",
  "buyDateTime" : "2025-03-04T20:20:20"
}
        `;
}


function getRatedUserJson() {
  return `
{
  "userId" : "u01",
  "userName" : "uname01",
  "reviewCount" : 10,
  "averageScore" : 4.3
}
  `;
}

test("now selling", async () => {
  server.use(
    http.get("/api/sell/sells/s01", () => {
      return HttpResponse.text(getSellJson("NOW_SELLING"));
    })
  );

  const api = new Api(null);
  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/sell/detail/s01"]}>
        <Routes>
          <Route path="/sell/detail/:id" element={<SellDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("出品中")).toBeVisible();
  });
});

test("need shipping", async () => {
  server.use(
    http.get("/api/sell/sells/s01", () => {
      return HttpResponse.text(getSellJson("NEED_SHIPPING"));
    }),
    http.get("/api/buy/for-seller/buyers", ({ request }) => {
      const sellId = new URL(request.url).searchParams.get("sellId");
      if (sellId != "s01") {
        return; // fail
      }
      return HttpResponse.text(getBuyerJson());
    }),
    http.put("/api/shipping/sells/s01/shipped", () => {
      return new HttpResponse(`{"cause":"AlreadyShipped"}`, { status: 400 });
    })
  );

  const errorDialogModel = new ErrorDialogModel();
  //errorDialogModel.isOpen = true;
  const api = new Api(null);
  render(
    <ErrorDialogModelProvider value={errorDialogModel}>
      <ApiProvider value={api}>
        <MemoryRouter initialEntries={["/sell/detail/s01"]}>
          <Routes>
            <Route path="/sell/detail/:id" element={
              <>
                <div>aaa</div>
                <ErrorDialog />
                <div>bbb</div>
                <SellDetailPage />
              </>
            } />
          </Routes>
        </MemoryRouter>
      </ApiProvider>
    </ErrorDialogModelProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("商品を発送してください")).toBeVisible();
    expect(screen.getByText("発送したので発送通知する")).toBeVisible();
  });

  const user = userEvent.setup();
  user.click(screen.getByText("発送したので発送通知する"));
  await waitFor(() => {
    expect(screen.getByText("すでに発送済みです")).toBeVisible();
  });



});


test("wait for review", async () => {
  server.use(
    http.get("/api/sell/sells/s01", () => {
      return HttpResponse.text(getSellJson("NEED_REVIEW_BY_BUYER"));
    }),
    http.get("/api/buy/for-seller/buyers", ({ request }) => {
      const sellId = new URL(request.url).searchParams.get("sellId");
      if (sellId != "s01") {
        return; // fail
      }
      return HttpResponse.text(getBuyerJson());
    })
  );
  const api = new Api(null);
  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/sell/detail/s01"]}>
        <Routes>
          <Route path="/sell/detail/:id" element={<SellDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("購入者の評価待ちです")).toBeVisible();
  });
});

test("need review", async () => {
  server.use(
    http.get("/api/sell/sells/s01", () => {
      return HttpResponse.text(getSellJson("NEED_REVIEW_BY_SELLER"));
    }),
    http.get("/api/buy/for-seller/buyers", ({ request }) => {
      const sellId = new URL(request.url).searchParams.get("sellId");
      if (sellId != "s01") {
        return; // fail
      }
      return HttpResponse.text(getBuyerJson());
    }),
    http.get("/api/review/rated-users/u01", () => {
      return HttpResponse.text(getRatedUserJson());
    })
  );

  const api = new Api(null);
  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/sell/detail/s01"]}>
        <Routes>
          <Route path="/sell/detail/:id" element={<SellDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("購入者を評価してください")).toBeVisible();
    expect(screen.getByText("uname01さんを評価してください")).toBeVisible();
  });
});

test("completed", async () => {
  server.use(
    http.get("/api/sell/sells/s01", () => {
      return HttpResponse.text(getSellJson("COMPLETED"));
    }),
    http.get("/api/buy/for-seller/buyers", ({ request }) => {
      const sellId = new URL(request.url).searchParams.get("sellId");
      if (sellId != "s01") {
        return; // fail
      }
      return HttpResponse.text(getBuyerJson());
    })
  );
  const api = new Api(null);
  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/sell/detail/s01"]}>
        <Routes>
          <Route path="/sell/detail/:id" element={<SellDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );
  await waitFor(() => {
    expect(screen.getByText("取引は終了しました")).toBeVisible();
  });
});
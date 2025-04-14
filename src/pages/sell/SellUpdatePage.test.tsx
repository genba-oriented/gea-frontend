import { ProductImageEditModel } from "@/model/sell/ProductImageEditModel";
import { Api } from "@/util/Api";
import { ApiProvider } from "@/util/ApiProvider";
import { setupMsw, setupVi } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, test, vi } from "vitest";
import { SellUpdatePageWrapped } from "./SellUpdatePage";

const server = setupMsw();
setupVi();

test("preset", async () => {
  server.use(
    http.get("/api/sell/sells/s01", async () => {
      return HttpResponse.text(`
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
          "status" : "NOW_SELLING",
          "productImages" : [ {
            "id" : "pi01"
          }, {
            "id" : "pi02"
          } ]
        }
        `);
    })
  );
  const api = new Api(null);
  const productImageEditModel = new ProductImageEditModel(api);
  productImageEditModel.load = vi.fn();

  render(
    <ApiProvider value={api}>
      <MemoryRouter initialEntries={["/sell/update/s01"]}>
        <Routes>
          <Route path="/sell/update/:id" element={<SellUpdatePageWrapped productImageEditModel={productImageEditModel} />} />
        </Routes>
      </MemoryRouter>
    </ApiProvider>
  );

  await waitFor(() => {
    expect(screen.getByDisplayValue("1000")).toBeVisible();
  });



});
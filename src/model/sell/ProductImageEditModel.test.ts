import { Api } from "@/util/Api";
import { setupMsw } from "@/util/test-utils";
import isEquals from "lodash.isequal";
import { http, HttpResponse } from 'msw';
import { expect, test } from "vitest";
import { ProductImageEditModel } from "./ProductImageEditModel";


const server = setupMsw();

test("load add delete sync", async () => {

  server.use(
    http.get("/api/sell/sells/s01/product-images/pi01", () => {
      return new HttpResponse(new Blob());
    }),
    http.get("/api/sell/sells/s01/product-images/pi02", () => {
      return new HttpResponse(new Blob());
    }),
    http.post("/api/sell/sells/s01/product-images", () => {
      return new HttpResponse(null, {
        headers: {
          "Location": "/api/sell/sells/s01/product-images/pi99"
        }
      })
    }),
    http.delete("/api/sell/sells/s01/product-images/pi01", () => {
      return new HttpResponse();
    }),
    http.put("/api/sell/sells/s01/product-images/reorder", async ({ request }) => {
      const ids: Array<string> = await request.clone().json();
      if (isEquals(ids, ["pi02", "pi99"])) {
        return new HttpResponse();
      }
      return; // fail
    })
  );

  const model = new ProductImageEditModel(new Api(null));
  await model.load(["pi01", "pi02"], "s01");
  expect(model.getImages().length).toBe(2);
  expect(model.isNeedSync()).toBe(false);

  const newData = new Blob();
  model.addImage(newData);
  expect(model.getImages().length).toBe(3);
  expect(model.isNeedSync()).toBe(true);

  model.deleteImage(newData);
  expect(model.getImages().length).toBe(2);
  expect(model.isNeedSync()).toBe(false);

  model.deleteImage(model.getImages()[0].data);
  expect(model.getImages().length).toBe(1);
  expect(model.isNeedSync()).toBe(true);

  model.addImage(newData);
  expect(model.getImages().length).toBe(2);

  await model.doSync("s01");


});




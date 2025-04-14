import { ProductImageDto } from "@/dto/sell/ProductImageDto";
import { SellDto } from "@/dto/sell/SellDto";
import { ProductImageEditModel } from "@/model/sell/ProductImageEditModel";
import { setupRtl, setupVi } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { SellForm } from "./SellForm";

setupRtl();
setupVi();

test("preset", async () => {
  const sellDto = new SellDto();
  sellDto.id = "s01";
  sellDto.productName = "pname01";
  sellDto.description = "desc01";
  sellDto.price = 2000;
  sellDto.productImages = [];
  const productImage = new ProductImageDto();
  productImage.id = "pi01";
  sellDto.productImages.push(productImage);

  const productImageEditModel = new ProductImageEditModel(null);
  productImageEditModel.load = vi.fn();
  const user = userEvent.setup();

  render(
    <SellForm sellDto={sellDto} action={async (form) => { }} actionLabel="実行" cancel={() => { }} productImageEditModel={productImageEditModel} />
  );

  await waitFor(() => {
    expect(productImageEditModel.load).toHaveBeenCalled();
    expect(screen.getByText("実行")).toBeDisabled();
  });

  await user.upload(screen.getByTestId("file-input"), new File(["foo"], "foo.txt"));
  expect(screen.getByText("実行")).toBeEnabled();

});


test("new sell", async () => {
  const productImageEditModel = new ProductImageEditModel(null);
  const user = userEvent.setup();
  render(
    <SellForm sellDto={null} action={async (form) => { }} actionLabel="実行" cancel={() => { }} productImageEditModel={productImageEditModel} />
  );

  await waitFor(() => {
    expect(screen.getByText("実行")).toBeDisabled();
  });

  await user.type(screen.getByLabelText("商品名"), "name");
  await user.type(screen.getByLabelText("説明"), "desc");
  await user.type(screen.getByLabelText("値段"), "1000");
  await user.upload(screen.getByTestId("file-input"), new File(["foo"], "foo.txt"));
  expect(screen.getByText("実行")).toBeEnabled();


});
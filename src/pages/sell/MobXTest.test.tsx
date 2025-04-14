import { setupRtl } from "@/util/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { expect, test } from "vitest";

export class Foo {

  isOpen: boolean;
  message: string;

  constructor() {
    makeAutoObservable(this);
  }

  show(message: string) {
    this.isOpen = true;
    this.message = message;
  }

  hide() {
    this.isOpen = false;
    this.message = null;
  }

}

setupRtl();

const Show = observer(() => {

  const [errorDialogModel] = useState(new Foo());
  useEffect(() => {
    errorDialogModel.message = "dummy";
  }, []);
  return (<>
    <div>{errorDialogModel.message}</div>
    <button onClick={() => {
      errorDialogModel.message = "test pass";
    }}>ok</button>
  </>
  );
});

test("nnn", async () => {
  const user = userEvent.setup();
  render(
    <Show />
  );

  await waitFor(() => {
    expect(screen.getByText("dummy")).toBeVisible();
  });

  // await user.click(screen.getByText("ok"));
  // await waitFor(() => {
  //   expect(screen.getByText("test pass")).toBeVisible();
  // });





});
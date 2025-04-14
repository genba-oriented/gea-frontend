import { LoginUserModel } from "@/model/user/LoginUserModel";
import { LoginUserModelProvider } from "@/model/user/LoginUserModelProvider";
import { setupRtl } from "@/util/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router";
import { expect, test } from "vitest";
import { NeedLoginLayout } from "./NeedLoginLayout";

setupRtl();

test("logined activated user", async () => {
  const userModel = new LoginUserModel(null);
  userModel.logined = true;
  userModel.activated = true;

  render(
    <LoginUserModelProvider value={userModel}>
      <MemoryRouter>
        <Routes>
          <Route element={<NeedLoginLayout />}>
            <Route index element={<div>test pass</div>} />
          </Route>
        </Routes>
      </MemoryRouter>

    </LoginUserModelProvider>
  );

  expect(screen.getByText("test pass")).toBeVisible();
});

test("logined non-activated user", async () => {
  const userModel = new LoginUserModel(null);
  userModel.logined = true;
  userModel.activated = false;

  render(
    <LoginUserModelProvider value={userModel}>
      <MemoryRouter>
        <Routes>
          <Route element={<NeedLoginLayout />}>
            <Route index element={<div>dummy</div>} />
          </Route>
          <Route path="/user/register" element={<div>test pass</div>} />
        </Routes>
      </MemoryRouter>

    </LoginUserModelProvider>
  );

  expect(screen.getByText("test pass")).toBeVisible();
});


test("not logined user", async () => {
  const userModel = new LoginUserModel(null);
  userModel.logined = false;

  const DummyLoginPage = () => {
    const [params] = useSearchParams();
    return (
      <div>{params.get("afterAuth")}</div>
    )
  };

  render(
    <LoginUserModelProvider value={userModel}>
      <MemoryRouter initialEntries={["/foo"]}>
        <Routes>
          <Route element={<NeedLoginLayout />}>
            <Route path="/foo" element={<div>dummy</div>} />
          </Route>
          <Route path="/login" element={<DummyLoginPage />} />
        </Routes>
      </MemoryRouter>
    </LoginUserModelProvider>
  );

  expect(screen.getByText("/foo")).toBeVisible();
});



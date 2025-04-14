
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, test } from "vitest";
import { LoginPage } from "./LoginPage";

test("show login link", async () => {

  render(
    <MemoryRouter initialEntries={["/foo?aaa=bbb"]}>
      <LoginPage />
    </MemoryRouter>
  );
  expect(screen.getByText("Login with Google")).toHaveAttribute("href", "/start-auth?aaa=bbb");

});
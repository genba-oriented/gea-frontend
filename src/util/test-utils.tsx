import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

export function setupMsw() {
  const server = setupServer();
  beforeAll(() => {
    // supertestでリクエストを投げた際に、unhandleの警告が出ないようにする
    server.listen(
      { onUnhandledRequest: "bypass" }
    );
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
  return server;
}

export function setupRtl() {
  // js-domはURL.createObjectURLをサポートしていない様子 https://stackoverflow.com/a/56643520
  window.URL.createObjectURL = vi.fn();

  afterEach(() => {
    cleanup();
  });
}

export function setupVi() {
  afterEach(() => {
    vi.restoreAllMocks();
  });
}
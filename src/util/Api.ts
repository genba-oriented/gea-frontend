import { ErrorDialogModel } from "@/model/util/ErrorDialogModel";
import Cookies from "js-cookie";

export class Api {


  private errorDialogModel: ErrorDialogModel;

  constructor(errorDialogModel: ErrorDialogModel) {
    this.errorDialogModel = errorDialogModel;
  }

  async fetch(path: string, init?: RequestInit) {
    const afterInit = { ...init };
    const headers = new Headers(afterInit.headers);
    const csrf = Cookies.get("csrf");
    if (csrf != null) {
      headers.append("X-CSRF-TOKEN", csrf);
    }
    if (afterInit.method == "POST" || afterInit.method == "PUT") {
      if (!(afterInit.body instanceof FormData)) {
        headers.append("Content-Type", "application/json");
      }
    }
    afterInit.headers = headers;
    const fullPath = path.startsWith("http://") || path.startsWith("https://") ? path : window.location.origin + path;
    const res = await fetch(fullPath, afterInit);

    if (res.status >= 500) {
      this.errorDialogModel.show("ネットワークエラーが発生しました");
      throw new Error("ネットワークエラー");
    }

    return res;
  }


}


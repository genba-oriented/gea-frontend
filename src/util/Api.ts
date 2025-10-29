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
    let res: Response = null;
    try {
      res = await fetch(fullPath, afterInit);
    } catch (error) {
      this.errorDialogModel.show("ネットワークエラーが発生しました");
      throw error;
    }
    if (res.status >= 500) {
      this.errorDialogModel.show("サーバ側でエラーが発生しました");
      throw new Error("サーバ側でエラー");
    }
    if (res.status == 401) {
      this.errorDialogModel.show("セッションの有効期限が切れました");
      throw new Error("セッションの有効期限切れ");
    }

    return res;
  }


}


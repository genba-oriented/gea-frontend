import { UserDto } from "@/dto/user/UserDto";
import { Api } from "@/util/Api";
import { makeAutoObservable, runInAction } from "mobx";


export class LoginUserModel {

  logined: boolean;
  activated: boolean;
  id: string
  name: string;
  email: string;

  private api: Api;

  constructor(api: Api) {
    makeAutoObservable(this);
    this.api = api;
  }

  async load() {
    const userDto: UserDto = await this.api.fetch("/api/user/users/me")
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else if (res.status == 401) {
          console.log("認証されていません");
          return null;
        }
        return null;
      });

    runInAction(() => {
      if (userDto != null) {
        this.logined = true;
        this.id = userDto.id;
        this.name = userDto.name;
        this.email = userDto.email;
        this.activated = userDto.activated;
      } else {
        this.logined = false;
      }
    });

  }

  async logout() {
    await this.api.fetch("/logout", {
      method: "POST"
    });
    runInAction(() => {
      this.logined = false;
      this.id = null;
      this.name = null;
      this.email = null;
    });
  }

}
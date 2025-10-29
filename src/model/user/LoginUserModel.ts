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

    const data = await this.api.fetch("/me").then(res => res.json());
    if (data.name == null) {
      console.log("認証されていません");
      return null;
    }

    try {
      const userDto: UserDto = await this.api.fetch("/api/user/users/me")
        .then(res => res.json());

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
    } catch (error) {
      this.logined = false;
      return;
    }
  }

}
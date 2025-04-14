import { makeAutoObservable } from "mobx";

export class ErrorDialogModel {

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
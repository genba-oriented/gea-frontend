import { action, makeObservable, observable } from "mobx";

export class ValidatableForm {

  private errorsWhileTouch = new Map<string, string>();
  private values = new Map<string, any>();
  private touched = new Map<string, boolean>();
  private validations = new Map<string, Function>();

  constructor() {
    makeObservable<ValidatableForm, "errorsWhileTouch" | "values" | "touched">(this, {
      errorsWhileTouch: observable,
      values: observable,
      touched: observable,
      preset: action,
      touch: action,
      clear: action
    });
  }

  setValidation(name: string, validation: (value: any) => true | string) {
    this.validations.set(name, validation);
  }

  preset(name: string, value: any) {
    this.values.set(name, value);
  }

  touch(name: string, value: any) {
    this.touched.set(name, true);
    this.values.set(name, value);
    const validation = this.validations.get(name);
    if (validation == null) {
      return;
    }
    const result = validation(value);
    if (result == true) {
      this.errorsWhileTouch.delete(name);
    } else {
      this.errorsWhileTouch.set(name, result);
    }
  }


  isAllValid(): boolean {
    for (const name of this.validations.keys()) {
      let value = this.values.get(name);
      const validation = this.validations.get(name);
      if (validation(value) != true) {
        return false;
      }
    }
    return true;
  }


  getValue(name: string) {
    const val = this.values.get(name);
    // 入力されてない場合は空文字を返す
    // reactのinputのvalue={form.getValue("foo")}でcontrolledなinputにする都合が大きい
    if (val == null) {
      return "";
    } else {
      return val;
    }
  }

  isTouched(name: string) {
    return this.touched.get(name) == true;
  }

  isAnyTouched() {
    return this.touched.size != 0;
  }

  getValuesAsObject() {
    return Object.fromEntries(this.values);
  }

  hasError(name: string) {
    if (this.errorsWhileTouch.get(name) != null) {
      return true;
    }
    return false;
  }
  getError(name: string) {
    return this.errorsWhileTouch.get(name);
  }

  clear() {
    this.errorsWhileTouch.clear();
    this.values.clear();
    this.touched.clear();
  }

}

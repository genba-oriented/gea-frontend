import { expect, test } from "vitest";
import { ValidatableForm } from "./ValidatableForm";

test("validation, touch", () => {
  const form = new ValidatableForm();
  form.setValidation("foo", (val: string) => {
    if (val == null || val.length == 0) {
      return "error";
    }
    return true;
  })
  expect(form.isTouched("foo")).toBe(false);
  form.touch("foo", "");
  expect(form.hasError("foo")).toBe(true);
  expect(form.isTouched("foo")).toBe(true);
  form.touch("foo", "a");
  expect(form.hasError("foo")).toBe(false);

});
import test, { chromium } from '@playwright/test';
import { http, HttpResponse } from 'msw';
import { createWorker } from 'playwright-msw';


test("google login", async () => {

  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: "en-US"
  });
  const page = await context.newPage();

  const worker = await createWorker(page);
  worker.use(
    http.get("/api/user/users/me", async () => {
      return HttpResponse.text(`
{
  "id" : "u01",
  "name" : "uname01000",
  "email" : "u01@example.com",
  "idpUserId" : "idp01",
  "activated" : false
}
          `);
    })
  );

  await page.goto("http://localhost:3000/login");
  await page.getByText("Login with Google").click();
  await page.getByLabel("Email or Phone").fill(process.env.AUTH_EMAIL);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel("Enter your password").fill(process.env.AUTH_PASSWORD);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForURL("http://localhost:3000/user/register");

});
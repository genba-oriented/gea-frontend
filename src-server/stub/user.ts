import { Express } from 'express';
import { isLogined } from '../oidc';
export const user = (app: Express) => {
  app.get("/api/user/users/me", async (req, res) => {

    if (!await isLogined(req, res)) {
      res.status(401).send();
      return;
    }
    const json = `
{
  "id" : "u02",
  "name" : "uname02",
  "email" : "u02@example.com",
  "idpUserId" : "idp02",
  "balance" : 30000,
  "address" : "address02",
  "activated": true
}
  `;
    res.send(json);
  });

  app.post("/api/user/users", (req, res) => {
    res.status(201).send();
  });
}
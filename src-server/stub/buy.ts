import { Express } from 'express';
import { getBagJson, getCameraJson, getPsJson, getShoesJson } from './jsons';

export const buy = (app: Express) => {
  app.post("/api/buy/buys", (req, res) => {
    res.status(201).setHeader("Location", "http://example.com/api/buy/buys/b99").send();
    //res.status(400).json({ cause: "BalanceShortage" });
  });

  app.get("/api/buy/buys", (req, res) => {
    const json = `
[{
  "id" : "b01",
  "sellId" : "s01",
  "sell" : ${getPsJson("NEED_SHIPPING")},
  "buyDateTime" : "2025-02-02T01:01:01"
}]
      `;
    res.send(json);

  });

  app.get("/api/buy/buys/:id", (req, res) => {
    let sell = null;
    let sellId = null;
    if (req.params.id == "b01") {
      sell = getPsJson("NEED_SHIPPING");
      sellId = "s01";
    } else if (req.params.id == "b02") {
      sell = getShoesJson("NEED_SHIPPING");
      sellId = "s02";
    } else if (req.params.id == "b03") {
      sell = getBagJson("NEED_SHIPPING");
      sellId = "s03";
    } else if (req.params.id == "b99") {
      sell = getCameraJson("NEED_SHIPPING");
      sellId = "s99";
    }

    const json = `
{
  "id" : "${req.params.id}",
  "sellId" : "${sellId}",
  "sell" : ${sell},
  "buyDateTime" : "2025-02-02T01:01:01"
}
        `;
    res.send(json);
  });


  app.get("/api/buy/for-seller/buyers", (req, res) => {
    const json = `
{
  "userId" : "u02",
  "userName" : "uname02",
  "address" : "address02",
  "buyDateTime" : "2025-03-04T20:20:20"
}
        `;
    res.send(json);
  });

}

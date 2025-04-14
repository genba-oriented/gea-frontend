import { Express } from 'express';
import fs from "node:fs";
import { getBagJson, getCameraJson, getPsJson, getShoesJson } from './jsons';


export const sell = (app: Express) => {

  app.get("/api/sell/sells", (req, res) => {
    const json = `
[
    ${getShoesJson("NOW_SELLING")}
]
      `;
    res.send(json);
  });

  app.get("/api/sell/sells/:sellId", (req, res) => {
    let json = null;
    if (req.params.sellId == "s01") {
      json = getPsJson("NOW_SELLING");
    } else if (req.params.sellId == "s02") {
      json = getShoesJson("NOW_SELLING");
    } else if (req.params.sellId == "s03") {
      json = getBagJson("NOW_SELLING");
    } else if (req.params.sellId == "s99") {
      json = getCameraJson("NOW_SELLING");
    }
    res.send(json);
  });


  app.get("/api/sell/sells/:sellId/product-images/:id", (req, res) => {
    let fileName = null;
    if (req.params.id == "pi01") {
      fileName = "ps.jpg";
    } else if (req.params.id == "pi02") {
      fileName = "ps2.jpg";
    } else if (req.params.id == "pi03") {
      fileName = "shoes.jpg";
    } else if (req.params.id == "pi04") {
      fileName = "bag.jpg";
    } else if (req.params.id == "pi99") {
      fileName = "camera.jpg";
    }
    const data = fs.readFileSync(import.meta.dirname + "/" + fileName);
    res.send(data);
  });

  app.post("/api/sell/sells/:sellId/product-images", (req, res) => {
    res.status(201);
    res.header("Location", "http://localhost:3001/api/sell/sells/foo/product-images/pi99");
    res.send();
  });


  app.post("/api/sell/sells", (req, res) => {
    res.status(201);
    res.header("Location", "http://localhost:3001/api/sell/sells/s99");
    res.send();
  });

  app.delete("/api/sell/sells/:sellId/product-images/:id", (req, res) => {
    res.status(204).send();
  });


  app.put("/api/sell/sells/:sellId", (req, res) => {
    res.status(204).send();
  });

  app.put("/api/sell/sells/:sellId/product-images/reorder", (req, res) => {
    res.status(204).send();
  });
};

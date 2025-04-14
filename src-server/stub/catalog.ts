import { Express } from 'express';
import fs from "node:fs";

function getPsJson(sold) {
  return `
{
    "id" : "s01",
    "userId" : "u01",
  "productName" : "【美品】初代プレイステーション",
  "description" : "状態がよいです。",
    "price" : 10000,
    "sold" : ${sold},
    "productImageIds" : [ "pi01", "pi02" ]
  } 
  `;
}

function getShoesJson(sold) {
  return `
{
    "id" : "s02",
    "userId" : "u02",
  "productName" : "レアなスニーカー",
  "description" : "傷や汚れはございません。",
    "price" : 5000,
    "sold" : ${sold},
    "productImageIds" : [ "pi03"]
  } 
  `;
}

function getBagJson(sold) {
  return `
{
    "id" : "s03",
    "userId" : "u03",
  "productName" : "おしゃれなバッグ",
  "description" : "若干使用感があります。",
    "price" : 9000,
    "sold" : ${sold},
    "productImageIds" : [ "pi04"]
  } 
  `;
}
function getCameraJson(sold) {
  return `
{
    "id" : "s99",
    "userId" : "u02",
  "productName" : "ビンテージカメラ",
  "description" : "貴重なカメラです。",
    "price" : 20000,
    "sold" : ${sold},
    "productImageIds" : [ "pi99"]
  } 
  `;
}

export const catalog = (app: Express) => {
  app.get("/api/catalog/sells", (req, res) => {
    const json = `
{
  "content" : [ 
  ${getPsJson(false)},
  ${getShoesJson(false)},
  ${getBagJson(false)}
  ],
  "pageable" : {
    "pageNumber" : 0,
    "pageSize" : 3,
    "sort" : {
      "empty" : true,
      "sorted" : false,
      "unsorted" : true
    },
    "offset" : 0,
    "paged" : true,
    "unpaged" : false
  },
  "last" : false,
  "totalElements" : 10,
  "totalPages" : 4,
  "size" : 3,
  "number" : 0,
  "sort" : {
    "empty" : true,
    "sorted" : false,
    "unsorted" : true
  },
  "first" : true,
  "numberOfElements" : 3,
  "empty" : false
}
  `;
    res.send(json);
  });


  app.get("/api/catalog/sells/:sellId", (req, res) => {
    let json = null;
    if (req.params.sellId == "s01") {
      json = getPsJson(false);
    } else if (req.params.sellId == "s02") {
      json = getShoesJson(false);
    } else if (req.params.sellId == "s03") {
      json = getBagJson(false);
    } else if (req.params.sellId == "s99") {
      json = getCameraJson(true);
    }
    res.send(json);
  });

  app.get("/api/catalog/sells/:sellId/product-images/:id", (req, res) => {
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



};
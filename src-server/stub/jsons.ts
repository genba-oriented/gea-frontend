export function getPsJson(status) {
  return `
{
  "id" : "s01",
  "userId" : "u01",
  "productName" : "【美品】初代プレイステーション",
  "description" : "状態がよいです。",
  "price" : 10000,
  "sellDateTime" : "2025-02-03T10:10:10",
  "editDateTime" : "2025-02-01T10:10:10",
  "shippedDateTime" : "2025-02-04T10:10:10",
  "completedDateTime" : "2025-02-05T10:10:10",
  "status" : "${status}",
  "productImages" : [ {
    "id" : "pi01"
  }, {
    "id" : "pi02"
  } ]
}  `;
}

export function getShoesJson(status) {
  return `
{
  "id" : "s02",
  "userId" : "u02",
  "productName" : "レアなスニーカー",
  "description" : "傷や汚れはございません。",
  "price" : 5000,
  "sellDateTime" : "2025-02-03T10:10:10",
  "editDateTime" : "2025-02-01T10:10:10",
  "shippedDateTime" : "2025-02-04T10:10:10",
  "completedDateTime" : "2025-02-05T10:10:10",
  "status" : "${status}",
  "productImages" : [ {
    "id" : "pi03"
  }]
}  `;
}

export function getBagJson(status) {
  return `
{
  "id" : "s03",
  "userId" : "u03",
  "productName" : "おしゃれなバッグ",
  "description" : "若干使用感があります。",
  "price" : 9000,
  "sellDateTime" : "2025-02-03T10:10:10",
  "editDateTime" : "2025-02-01T10:10:10",
  "shippedDateTime" : "2025-02-04T10:10:10",
  "completedDateTime" : "2025-02-05T10:10:10",
  "status" : "${status}",
  "productImages" : [ {
    "id" : "pi04"
  }]
}  `;
}

export function getCameraJson(status) {
  return `
{
  "id" : "s99",
  "userId" : "u02",
  "productName" : "ビンテージカメラ",
  "description" : "貴重なカメラです。",
  "price" : 20000,
  "sellDateTime" : "2025-02-03T10:10:10",
  "editDateTime" : "2025-02-01T10:10:10",
  "shippedDateTime" : "2025-02-04T10:10:10",
  "completedDateTime" : "2025-02-05T10:10:10",
  "status" : "${status}",
  "productImages" : [ {
    "id" : "pi99"
  }]
}  `;
}

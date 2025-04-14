import { Express } from 'express';
export const review = (app: Express) => {
  app.get("/api/review/rated-users/:userId", (req, res) => {
    const json = `
{
  "userId" : "${req.params.userId}",
  "userName" : "${req.params.userId}name",
  "reviewCount" : 10,
  "averageScore" : 4.3
}
  `;
    res.send(json);
  });


  app.post("/api/review/reviews", (req, res) => {
    res.status(201).setHeader("Location", "http://example.com/api/review/reviews/r01").send();
  });

}
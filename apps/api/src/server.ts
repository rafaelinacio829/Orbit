import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3333);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    name: "orbit-api",
    status: "ok"
  });
});

app.listen(port, () => {
  console.log(`Orbit API listening on port ${port}`);
});

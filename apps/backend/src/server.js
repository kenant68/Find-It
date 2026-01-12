import dotenv from "dotenv";
import express from "express";


dotenv.config({ path: "../../.env" });

import apiRouter from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/api", apiRouter);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

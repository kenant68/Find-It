import "dotenv/config";

import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";


function validateEnvironmentVariables() {
  const requiredVars = ['JWT_SECRET'];

  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].trim() === '') {
      console.error(`Variable d'environnement manquante ou vide: ${varName}`);
      console.error(`Veuillez définir ${varName} dans votre fichier .env`);
      process.exit(1);
    }
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.warn(`JWT_SECRET est très court (${process.env.JWT_SECRET.length} caractères).`);
    console.warn(`Pour la sécurité, utilisez au moins 32 caractères.`);
  }

  console.log(`Variables d'environnement validées`);
}

validateEnvironmentVariables();

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use("/api", apiRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

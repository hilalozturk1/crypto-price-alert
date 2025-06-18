import express, { Router } from "express";
import { connectMongoDB } from "./config/db";

const app = express();
const router = Router();

app.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use("/api", router);

app.listen(3000, () => {
  console.log(`localhost:3000/api`);
});

connectMongoDB().then(() => {
  app.listen(3000, () => {
    console.log(`localhost:3000/api`);
  });
});

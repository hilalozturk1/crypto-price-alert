import express, { Router } from "express";
import { connectMongoDB } from "./config/db";
import alertRoutes from "./routes/alertRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./utils/errorHandlers";
import { config } from "./config";
import { logger } from "./utils/logger";

const app = express();
const router = Router();

app.use(express.json());

router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", router);
app.use("/api/alerts", alertRoutes);

app.use(errorHandler);

connectMongoDB().then(() => {
  app.listen(3000, () => {
    logger.info(`Server running on port ${config.port}`);
  });
});

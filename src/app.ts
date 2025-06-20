import express, { Router } from "express";
import { connectMongoDB, redisClient } from "./config/db";
import alertRoutes from "./routes/alertRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./utils/errorHandlers";
import { config } from "./config";
import { logger } from "./utils/logger";
import { apiLimiter } from "./config/rateLimit"; //
import {
  register,
  httpRequestsTotal,
  mongoConnectionStatus,
  redisConnectionStatus,
} from "./config/metrics";

const app = express();
const router = Router();

app.use(express.json());

app.use(apiLimiter);

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal
      .labels(
        req.method,
        req.route ? req.route.path : req.path,
        res.statusCode.toString(),
      )
      .inc();
  });
  next();
});

router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use("/api", router);
app.use("/api/alerts", alertRoutes);

app.use(errorHandler);

connectMongoDB()
  .then(() => {
    mongoConnectionStatus.set(1);
    logger.info("MongoDB connected successfully");
    app.listen(config.port || 3000, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error("MongoDB connection failed: " + error.message);
    mongoConnectionStatus.set(0);
  });

redisClient.on("connect", () => {
  redisConnectionStatus.set(1);
});
redisClient.on("error", () => {
  redisConnectionStatus.set(0);
});

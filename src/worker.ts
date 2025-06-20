import cron from "node-cron";
import { connectMongoDB } from "./config/db";
import { config } from "./config";
import { logger } from "./utils/logger";
import { fetchCryptoPrices } from "./services/cyptoService";
import { checkAndTriggerAlerts } from "./services/alertService";
import { notificationService } from "./services/notificationService";

connectMongoDB()
  .then(() => {
    logger.info("Worker: MongoDB connection established.");

    notificationService.init();

    fetchCryptoPrices().catch((error: any) => {
      logger.error(
        "Initial fetchAndCacheCryptoPrices error:",
        error.message || error,
      );
    });

    cron.schedule(`*/${config.alertCheckIntervalMinutes} * * * *`, async () => {
      logger.info(
        `Worker: Scheduled price fetch and alert check (every ${config.alertCheckIntervalMinutes} minutes).`,
      );
      try {
        await fetchCryptoPrices();
      } catch (error: any) {
        logger.error(
          "Scheduled fetchAndCacheCryptoPrices error:",
          error.message || error,
        );
      }
      try {
        await checkAndTriggerAlerts();
      } catch (error: any) {
        logger.error(
          "Scheduled checkAndTriggerAlerts error:",
          error.message || error,
        );
      }
    });

    logger.info(
      `Worker started. Checking alerts every ${config.alertCheckIntervalMinutes} minutes.`,
    );
  })
  .catch((error) => {
    logger.error(
      "Worker: Failed to connect to MongoDB, exiting.",
      error.message || error,
    );
    process.exit(1);
  });

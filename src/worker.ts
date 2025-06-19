import cron from "node-cron";
import { connectMongoDB } from "./config/db";
import { config } from "./config";
import { fetchCryptoPrices } from "./services/cyptoService";
import { checkAndTriggerAlerts } from "./services/alertService";


connectMongoDB()
  .then(() => {
    fetchCryptoPrices();
    
    cron.schedule(`*/${config.alertCheckIntervalMinutes} * * * *`, async () => {
      await fetchCryptoPrices();
      await checkAndTriggerAlerts();
    });

    console.log(
      `Worker started, checking alerts every ${config.alertCheckIntervalMinutes} minutes.`,
    );
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

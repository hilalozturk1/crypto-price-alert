import { AlertDocument } from "../models/alert";

import { logger } from "../utils/logger";
import { redisClient } from "../config/db";
import { REDIS_CHANNELS } from "../config/redisChannels";

class NotificationService {
  private subscriber: typeof redisClient;

  constructor() {
    this.subscriber = redisClient.duplicate();
    this.setupSubscriber();
  }

  private setupSubscriber() {
    this.subscriber.on("message", (channel, message) => {
      if (channel === REDIS_CHANNELS.ALERT_TRIGGERED) {
        try {
          const { alert, currentPrice } = JSON.parse(message);

          logger.info("Received alert trigger message:", alert);
          this.sendNotification(alert, currentPrice);
        } catch (error) {
          logger.error("Error parsing alert message from Redis:", error);
        }
      }
    });

    this.subscriber.subscribe(REDIS_CHANNELS.ALERT_TRIGGERED, (err, count) => {
      if (err) {
        logger.error("Failed to subscribe to Redis channel:", err);
      } else {
        logger.info(
          `Subscribed to ${count} Redis channel: ${REDIS_CHANNELS.ALERT_TRIGGERED}`,
        );
      }
    });
  }
  private async sendNotification(
    alert: AlertDocument,
    currentPrice: number,
  ): Promise<void> {
    const message = `
      Alert!
      Crypto: ${alert.symbol.toUpperCase()}
      Target Price: $${alert.targetPrice}
      Current Price: $${currentPrice}
      Alert Type: ${alert.alertType === "above" ? "Above" : "Below"}
      UserId: ${alert.userId}
      Alert ID: ${alert._id}
    `;

    logger.info(
      `--- NOTIFICATION SENT ---\n${message}\n------------------------`,
    );
  }
  public init() {
    logger.info("Notification Service initialized and listening for alerts.");
  }
}

export const notificationService = new NotificationService();

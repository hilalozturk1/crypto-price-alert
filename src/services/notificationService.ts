import { AlertDocument } from "../models/alert";

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
          this.sendNotification(alert, currentPrice);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });

    this.subscriber.subscribe(REDIS_CHANNELS.ALERT_TRIGGERED, (err, count) => {
      if (err) {
        console.error(
          `Failed to subscribe to channel: ${REDIS_CHANNELS.ALERT_TRIGGERED}`,
          err,
        );
      } else {
        console.log(
          `Subscribed to channel: ${REDIS_CHANNELS.ALERT_TRIGGERED}. Total subscriptions: ${count}`,
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

    console.log(`*********Notification sent: ${message}`);
  }
  public init() {
    console.log("Notification service initialized and listening for alerts.");
  }
}

export const notificationService = new NotificationService();

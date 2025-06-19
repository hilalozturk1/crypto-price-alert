import { AlertDocument } from "../models/alert";
class NotificationService {

  public async sendNotification(alert: AlertDocument, currentPrice: number): Promise<void> {
    const message = `
      Alert!
      Crypto: ${alert.symbol.toUpperCase()}
      Target Price: $${alert.targetPrice}
      Current Price: $${currentPrice}
      Alert Type: ${alert.alertType === 'above' ? 'Above' : 'Below'}
      UserId: ${alert.userId}
      Alert ID: ${alert._id}
    `;

    console.log(`*********Notification sent: ${message}`);
  }

}

export const notificationService = new NotificationService();
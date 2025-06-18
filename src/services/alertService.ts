import { Alert, AlertDocument } from "../models/alert";
import { IAlert } from "../types";
import { ConflictError, CustomError } from "../utils/errorHandlers";

export const createAlert = async (
  alertData: Partial<IAlert>,
): Promise<AlertDocument> => {
  if (!alertData.userId) {
    alertData.userId = "123456"; // Default userId for testing purposes
  }

  const existingAlert = await Alert.findOne({
    userId: alertData.userId,
    symbol: alertData.symbol?.toLowerCase(),
    targetPrice: alertData.targetPrice,
    alertType: alertData.alertType,
    isActive: true,
  });

  if (existingAlert) {
    throw new ConflictError(
      "Similar active alert already exists for this user.",
    );
  }

  const alert = new Alert(alertData);
  await alert.save();
  return alert;
};

export const getAlertsByUserId = async (userId: string): Promise<AlertDocument[]> => {
    return Alert.find({ userId }).sort({ createdAt: -1 });
};

export const updateAlert = async (alertId: string, updateData: Partial<IAlert>): Promise<AlertDocument | null> => {
    const alert = await Alert.findByIdAndUpdate(alertId, updateData, { new: true });
    if (!alert) {
        throw new CustomError('Alert not found.', 404);
    }
    return alert;
};
import { Request, Response, NextFunction } from "express";
import * as alertService from "../services/alertService";
import { CustomError } from "../utils/errorHandlers";

// CREATE Alert
export const createAlert = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, symbol, targetPrice, alertType } = req.body;

    const newAlert = await alertService.createAlert({
      userId,
      symbol,
      targetPrice,
      alertType,
    });

    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    next(error);
  }
};

// GET Alerts by UserId
export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new CustomError('User ID is required.', 400);
    }
    const alerts = await alertService.getAlertsByUserId(userId);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};
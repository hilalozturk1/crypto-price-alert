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

// UPDATE Alert
export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alertId } = req.params;
    const updateData = req.body; 

    const updatedAlert = await alertService.updateAlert(alertId, updateData);
    res.status(200).json({ success: true, data: updatedAlert });
  } catch (error) {
    next(error);
  }
};

// DELETE Alert
export const deleteAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alertId } = req.params;
    const deletedAlert = await alertService.deleteAlert(alertId);
    res.status(200).json({ success: true, message: 'Alert deleted successfully', data: deletedAlert });
  } catch (error) {
    next(error);
  }
};
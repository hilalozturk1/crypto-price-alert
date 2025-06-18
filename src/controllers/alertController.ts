import { Request, Response, NextFunction } from "express";
import * as alertService from "../services/alertService";

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

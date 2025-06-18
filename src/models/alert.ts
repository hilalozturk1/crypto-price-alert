import mongoose, { Schema, Document } from "mongoose";
import { IAlert, AlertType } from "../types";

/**
 * @swagger
 * components:
 *   schemas:
 *     Alert:
 *       type: object
 *       required:
 *         - userId
 *         - symbol
 *         - targetPrice
 *         - alertType
 *       properties:
 *         userId:
 *           type: string
 *         symbol:
 *           type: string
 *         targetPrice:
 *           type: number
 *         alertType:
 *           type: string
 *           enum: [above, below]
 *         isActive:
 *           type: boolean
 *         triggered:
 *           type: boolean
 *         triggeredAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export interface AlertDocument extends IAlert, Document {}

const AlertSchema: Schema = new Schema({
  userId: { type: String, required: true },
  symbol: { type: String, required: true, lowercase: true },
  targetPrice: { type: Number, required: true },
  alertType: { type: String, required: true, enum: Object.values(AlertType) },
  isActive: { type: Boolean, default: true },
  triggered: { type: Boolean, default: false },
  triggeredAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Alert = mongoose.model<AlertDocument>("Alert", AlertSchema);

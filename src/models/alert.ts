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
 *           example: "60c72b2f9b1e8d001c8e4f3a"
 *         symbol:
 *           type: string
 *           example: "bitcoin"
 *         targetPrice:
 *           type: number
 *           example: 50000
 *         alertType:
 *           type: string
 *           enum: [above, below]
 *         isActive:
 *           type: boolean
 *           example: true
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

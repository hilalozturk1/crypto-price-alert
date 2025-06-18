import { Router } from "express";
import {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
} from "../controllers/alertController";

/**
 * @swagger
 * tags:
 *   - name: Alerts
 *     description: API for managing cryptocurrency price alerts
 */

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create a new price alert
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       201:
 *         description: Alert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Similar active alert already exists
 */

/**
 * @swagger
 * /alerts/{alertId}:
 *   get:
 *     summary: Get all alerts for a user
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 *       404:
 *         description: Alerts not found
 */

/**
 * @swagger
 * /alerts/{alertId}:
 *   put:
 *     summary: Update an alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         schema:
 *           type: string
 *         required: true
 *         description: Alert ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       200:
 *         description: Alert updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Alert not found
 */

/**
 * @swagger
 * /alerts/{alertId}:
 *   delete:
 *     summary: Delete an alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         schema:
 *           type: string
 *         required: true
 *         description: Alert ID
 *     responses:
 *       200:
 *         description: Alert deleted successfully
 *       404:
 *         description: Alert not found
 */

const router = Router();

router.post("/", createAlert);
router.get("/:userId", getAlerts);
router.put("/:alertId", updateAlert);
router.delete("/:alertId", deleteAlert);

export default router;

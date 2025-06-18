import { Router } from "express";
import { createAlert, getAlerts, updateAlert, deleteAlert } from "../controllers/alertController";

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

const router = Router();

router.post("/", createAlert);
router.get('/:userId', getAlerts);
router.put('/:alertId', updateAlert);
router.delete('/:alertId', deleteAlert);

export default router;

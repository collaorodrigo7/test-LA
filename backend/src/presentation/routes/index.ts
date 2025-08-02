import { Router, Request, Response } from 'express';
import { createTradeOrderRoutes } from './tradeOrderRoutes';
import { TradeOrderController } from '../controllers';

/**
 * @swagger
 * tags:
 *   name: System
 *   description: System health and monitoring endpoints
 */

export const createRoutes = (
  tradeOrderController: TradeOrderController
): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/v1/health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [System]
   *     responses:
   *       200:
   *         description: Server is running
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Server is running!
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: 2025-08-01T10:00:00.000Z
   */
  // Health check endpoint
  router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is running!',
      timestamp: new Date().toISOString()
    });
  });

  // API routes
  router.use('/trade-orders', createTradeOrderRoutes(tradeOrderController));

  return router;
};

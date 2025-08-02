import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '../../infrastructure/middleware/validation';
import { 
  createTradeOrderSchema, 
  tradeOrderIdSchema,
  paginationSchema 
} from '../validation/tradeOrderValidation';
import { TradeOrderController } from '../controllers';

/**
 * @swagger
 * tags:
 *   name: Trade Orders
 *   description: Trade order management endpoints
 */

export const createTradeOrderRoutes = (tradeOrderController: TradeOrderController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/v1/trade-orders:
   *   get:
   *     summary: Get paginated trade orders
   *     tags: [Trade Orders]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: init
   *         schema:
   *           type: integer
   *           minimum: 0
   *         description: Offset for backward compatibility
   *     responses:
   *       200:
   *         description: Successful response with paginated trade orders
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/PaginatedResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         tradeOrders:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/TradeOrder'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   *   post:
   *     summary: Create a new trade order
   *     tags: [Trade Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTradeOrderRequest'
   *     responses:
   *       201:
   *         description: Trade order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         tradeOrder:
   *                           $ref: '#/components/schemas/TradeOrder'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router
    .route('/')
    .get(
      validateQuery(paginationSchema),
      tradeOrderController.getTradeOrders
    )
    .post(
      validateBody(createTradeOrderSchema),
      tradeOrderController.createTradeOrder
    );

  /**
   * @swagger
   * /api/v1/trade-orders/all:
   *   get:
   *     summary: Get all trade orders without pagination
   *     tags: [Trade Orders]
   *     responses:
   *       200:
   *         description: Successful response with all trade orders
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     results:
   *                       type: number
   *                       description: Total number of trade orders
   *                     data:
   *                       type: object
   *                       properties:
   *                         tradeOrders:
   *                           type: array
   *                           items:
   *                             $ref: '#/components/schemas/TradeOrder'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router
    .route('/all')
    .get(tradeOrderController.getAllTradeOrders);

  /**
   * @swagger
   * /api/v1/trade-orders/{id}:
   *   get:
   *     summary: Get a trade order by ID
   *     tags: [Trade Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Trade order ID
   *     responses:
   *       200:
   *         description: Successful response with trade order
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       type: object
   *                       properties:
   *                         tradeOrder:
   *                           $ref: '#/components/schemas/TradeOrder'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   *   delete:
   *     summary: Delete a trade order by ID
   *     tags: [Trade Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Trade order ID
   *     responses:
   *       204:
   *         description: Trade order deleted successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router
    .route('/:id')
    .get(
      validateParams(tradeOrderIdSchema), 
      tradeOrderController.getTradeOrderById
    )
    .delete(
      validateParams(tradeOrderIdSchema), 
      tradeOrderController.deleteTradeOrder
    );

  return router;
};

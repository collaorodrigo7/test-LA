import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../../infrastructure/middleware/errorHandler';
import { TradeOrderService } from '../../application/services';

export class TradeOrderController {
  constructor(private tradeOrderService: TradeOrderService) {}

  createTradeOrder = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tradeOrder = await this.tradeOrderService.createTradeOrder(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        tradeOrder
      }
    });
  });

  getTradeOrderById = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    
    const tradeOrder = await this.tradeOrderService.getTradeOrderById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tradeOrder
      }
    });
  });

  getTradeOrders = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, init } = req.query;
    
    // Se 'init' estiver presente, use o sistema antigo (backward compatibility)
    // Senão, use o novo sistema baseado em página
    let offset: number;
    let pageSize: number = Number(limit || 10);
    let currentPage: number;
    
    if (init !== undefined) {
      offset = Number(init);
      currentPage = Math.floor(offset / pageSize) + 1;
    } else {
      currentPage = Number(page || 1);
      offset = (currentPage - 1) * pageSize;
    }
    
    const tradeOrders = await this.tradeOrderService.getTradeOrders(offset, pageSize);
    const allOrders = await this.tradeOrderService.getAllTradeOrders();
    const totalCount = allOrders.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: 'success',
      results: tradeOrders.length,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
      },
      data: {
        tradeOrders
      }
    });
  });

  getAllTradeOrders = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tradeOrders = await this.tradeOrderService.getAllTradeOrders();

    res.status(200).json({
      status: 'success',
      results: tradeOrders.length,
      data: {
        tradeOrders
      }
    });
  });

  deleteTradeOrder = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    await this.tradeOrderService.deleteTradeOrder(id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

}

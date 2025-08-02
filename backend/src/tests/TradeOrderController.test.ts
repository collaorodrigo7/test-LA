import { TradeOrderController } from '../presentation/controllers/TradeOrderController';
import { TradeOrderService } from '../application/services/TradeOrderService';
import { TradeOrder } from '../domain/entities/TradeOrder';
import { Request, Response, NextFunction } from 'express';

// Mock the TradeOrderService
jest.mock('../application/services/TradeOrderService');

describe('TradeOrderController', () => {
  let controller: TradeOrderController;
  let mockTradeOrderService: jest.Mocked<TradeOrderService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Create mock service
    mockTradeOrderService = {
      createTradeOrder: jest.fn(),
      getTradeOrderById: jest.fn(),
      getAllTradeOrders: jest.fn(),
      getTradeOrders: jest.fn(),
      deleteTradeOrder: jest.fn(),
    } as any;

    controller = new TradeOrderController(mockTradeOrderService);

    // Create mock Express objects
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createTradeOrder', () => {
    it('should create trade order and return 201 status', async () => {
      const tradeOrderData = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const createdOrder: TradeOrder = {
        id: 'test-id',
        ...tradeOrderData,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TradeOrder;

      mockRequest.body = tradeOrderData;
      mockTradeOrderService.createTradeOrder.mockResolvedValue(createdOrder);

      await controller.createTradeOrder(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockTradeOrderService.createTradeOrder).toHaveBeenCalledWith(tradeOrderData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          tradeOrder: createdOrder
        }
      });
    });
  });

  describe('getTradeOrderById', () => {
    it('should get trade order by id and return 200 status', async () => {
      const tradeOrderId = 'test-id';
      const foundOrder: TradeOrder = {
        id: tradeOrderId,
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: tradeOrderId };
      mockTradeOrderService.getTradeOrderById.mockResolvedValue(foundOrder);

      await controller.getTradeOrderById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockTradeOrderService.getTradeOrderById).toHaveBeenCalledWith(tradeOrderId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          tradeOrder: foundOrder
        }
      });
    });
  });
});

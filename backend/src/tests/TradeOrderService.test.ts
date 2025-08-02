import { TradeOrderService } from '../application/services/TradeOrderService';
import { TradeOrderReporsitory } from '../domain/repositories/TradeOrderReporsitory';
import { TradeOrder } from '../domain/entities/TradeOrder';

// Mock the TradeOrderValidationService
jest.mock('../application/services/TradeOrderValidationService', () => ({
  TradeOrderValidationService: {
    validateTradeOrder: jest.fn()
  }
}));

import { TradeOrderValidationService } from '../application/services/TradeOrderValidationService';

describe('TradeOrderService', () => {
  let service: TradeOrderService;
  let mockRepository: jest.Mocked<TradeOrderReporsitory>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    };

    service = new TradeOrderService(mockRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createTradeOrder', () => {
    it('should create trade order when validation passes', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const expectedResult: TradeOrder = {
        id: 'test-id',
        ...tradeOrderData,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TradeOrder;

      // Mock validation to pass
      (TradeOrderValidationService.validateTradeOrder as jest.Mock).mockReturnValue([]);
      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.createTradeOrder(tradeOrderData);

      expect(TradeOrderValidationService.validateTradeOrder).toHaveBeenCalledWith(tradeOrderData);
      expect(mockRepository.create).toHaveBeenCalledWith(tradeOrderData);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error when validation fails', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: -100, // Invalid amount
        pair: 'BTCUSD'
      };

      const validationErrors = ['Amount must be greater than 0', 'Price is required'];
      (TradeOrderValidationService.validateTradeOrder as jest.Mock).mockReturnValue(validationErrors);

      await expect(service.createTradeOrder(tradeOrderData)).rejects.toThrow(
        'Validation failed: Amount must be greater than 0, Price is required'
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getTradeOrderById', () => {
    it('should return trade order when found', async () => {
      const expectedOrder: TradeOrder = {
        id: 'test-id',
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(expectedOrder);

      const result = await service.getTradeOrderById('test-id');

      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(expectedOrder);
    });

    it('should throw error when trade order not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getTradeOrderById('non-existent-id')).rejects.toThrow(
        'Trade order not found'
      );

      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('getAllTradeOrders', () => {
    it('should return all trade orders', async () => {
      const expectedOrders: TradeOrder[] = [
        {
          id: 'test-id-1',
          side: 'buy',
          type: 'limit',
          amount: 100.50,
          price: 100000.0,
          pair: 'BTCUSD',
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'test-id-2',
          side: 'sell',
          type: 'market',
          amount: 50.25,
          price: 0,
          pair: 'EURUSD',
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockRepository.findAll.mockResolvedValue(expectedOrders);

      const result = await service.getAllTradeOrders();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedOrders);
    });

    it('should return empty array when no orders exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllTradeOrders();

      expect(result).toEqual([]);
    });
  });

  describe('getTradeOrders', () => {
    it('should return paginated trade orders', async () => {
      const expectedOrders: TradeOrder[] = [
        {
          id: 'test-id-1',
          side: 'buy',
          type: 'limit',
          amount: 100.50,
          price: 100000.0,
          pair: 'BTCUSD',
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockRepository.find.mockResolvedValue(expectedOrders);

      const result = await service.getTradeOrders(0, 10);

      expect(mockRepository.find).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(expectedOrders);
    });
  });

  describe('deleteTradeOrder', () => {
    it('should delete trade order when it exists', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.deleteTradeOrder('test-id');

      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when trade order not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteTradeOrder('non-existent-id')).rejects.toThrow(
        'Trade order not found'
      );

      expect(mockRepository.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});

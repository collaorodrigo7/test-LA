import { InMemoryTradeOrderRepository } from '../infrastructure/repositories/InMemoryTradeOrderRepository';
import { TradeOrder } from '../domain/entities/TradeOrder';

describe('InMemoryTradeOrderRepository', () => {
  let repository: InMemoryTradeOrderRepository;

  beforeEach(() => {
    repository = new InMemoryTradeOrderRepository();
  });

  describe('create', () => {
    it('should create a new trade order with generated ID', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const result = await repository.create(tradeOrderData);

      expect(result).toHaveProperty('id');
      expect(result.side).toBe('buy');
      expect(result.type).toBe('limit');
      expect(result.amount).toBe(100.50);
      expect(result.price).toBe(100000.0);
      expect(result.pair).toBe('BTCUSD');
      expect(result.status).toBe('open');
      expect(result.isDeleted).toBe(false);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should use provided ID if given', async () => {
      const customId = 'custom-id-123';
      const tradeOrderData: Partial<TradeOrder> = {
        id: customId,
        side: 'sell',
        type: 'market',
        amount: 50.25,
        pair: 'EURUSD'
      };

      const result = await repository.create(tradeOrderData);

      expect(result.id).toBe(customId);
    });
  });

  describe('findById', () => {
    it('should find trade order by ID', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const created = await repository.create(tradeOrderData);
      const found = await repository.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should return null for non-existent ID', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });

    it('should not find deleted trade orders', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const created = await repository.create(tradeOrderData);
      await repository.delete(created.id);
      const found = await repository.findById(created.id);

      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no orders exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it('should return all non-deleted trade orders', async () => {
      const order1Data: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const order2Data: Partial<TradeOrder> = {
        side: 'sell',
        type: 'market',
        amount: 50.25,
        pair: 'EURUSD'
      };

      const created1 = await repository.create(order1Data);
      const created2 = await repository.create(order2Data);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(created1);
      expect(result).toContainEqual(created2);
    });

    it('should not return deleted trade orders', async () => {
      const orderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const created = await repository.create(orderData);
      await repository.delete(created.id);

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('find', () => {
    it('should return paginated results', async () => {
      // Create multiple orders
      for (let i = 0; i < 5; i++) {
        await repository.create({
          side: 'buy',
          type: 'limit',
          amount: 100 + i,
          price: 100000 + i,
          pair: 'BTCUSD'
        });
      }

      const firstPage = await repository.find(0, 2);
      const secondPage = await repository.find(2, 2);

      expect(firstPage).toHaveLength(2);
      expect(secondPage).toHaveLength(2);
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
    });

    it('should use default parameters when not provided', async () => {
      // Create 15 orders to test default limit
      for (let i = 0; i < 15; i++) {
        await repository.create({
          side: 'buy',
          type: 'limit',
          amount: 100 + i,
          price: 100000 + i,
          pair: 'BTCUSD'
        });
      }

      const result = await repository.find();

      expect(result).toHaveLength(10); // Default limit is 10
    });
  });

  describe('delete', () => {
    it('should soft delete trade order', async () => {
      const tradeOrderData: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const created = await repository.create(tradeOrderData);
      const deleteResult = await repository.delete(created.id);

      expect(deleteResult).toBe(true);

      // Verify it's not in the active list
      const found = await repository.findById(created.id);
      expect(found).toBeNull();

      // Verify it's still in the raw array but marked as deleted
      const deletedOrder = repository.tradeOrders.find(order => order.id === created.id);
      expect(deletedOrder?.isDeleted).toBe(true);
      expect(deletedOrder?.deletedAt).toBeInstanceOf(Date);
    });

    it('should return false for non-existent ID', async () => {
      const deleteResult = await repository.delete('non-existent-id');

      expect(deleteResult).toBe(false);
    });
  });
});

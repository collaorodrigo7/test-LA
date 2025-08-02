import { TradeOrderValidationService } from '../application/services/TradeOrderValidationService';
import { TradeOrder } from '../domain/entities/TradeOrder';

describe('TradeOrderValidationService', () => {
  describe('validateTradeOrder', () => {
    it('should return no errors for valid trade order data', () => {
      const validTradeOrder: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000.0,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(validTradeOrder);
      
      expect(errors).toEqual([]);
    });

    it('should return errors for missing required fields', () => {
      const invalidTradeOrder: Partial<TradeOrder> = {};

      const errors = TradeOrderValidationService.validateTradeOrder(invalidTradeOrder);
      
      expect(errors).toContain('Side is required');
      expect(errors).toContain('Type is required');
      expect(errors).toContain('Amount is required');
      expect(errors).toContain('Pair is required');
    });

    it('should validate side field correctly', () => {
      const invalidSide: Partial<TradeOrder> = {
        side: 'invalid' as any,
        type: 'limit',
        amount: 100,
        price: 100000,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(invalidSide);
      
      expect(errors).toContain('Side must be either "buy" or "sell"');
    });

    it('should validate type field correctly', () => {
      const invalidType: Partial<TradeOrder> = {
        side: 'buy',
        type: 'invalid' as any,
        amount: 100,
        price: 100000,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(invalidType);
      
      expect(errors).toContain('Type must be "limit", "market", or "stop"');
    });

    it('should validate amount field correctly', () => {
      const negativeAmount: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: -100,
        price: 100000,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(negativeAmount);
      
      expect(errors).toContain('Amount must be greater than 0');
    });

    it('should validate amount decimal places', () => {
      const tooManyDecimals: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.123, // More than 2 decimal places
        price: 100000,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(tooManyDecimals);
      
      expect(errors).toContain('Amount must have maximum 2 decimal places');
    });

    it('should validate trading pair', () => {
      const invalidPair: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100000,
        pair: 'INVALID'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(invalidPair);
      
      expect(errors).toContain('Invalid trading pair. Available pairs: BTCUSD, EURUSD, ETHUSD');
    });

    it('should require price for limit orders', () => {
      const limitOrderWithoutPrice: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(limitOrderWithoutPrice);
      
      expect(errors).toContain('Price is required for limit and stop orders');
    });

    it('should not require price for market orders', () => {
      const marketOrder: Partial<TradeOrder> = {
        side: 'buy',
        type: 'market',
        amount: 100.50,
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(marketOrder);
      
      expect(errors).not.toContain('Price is required for limit and stop orders');
    });

    it('should validate buy limit order price is below market price', () => {
      const buyLimitAboveMarket: Partial<TradeOrder> = {
        side: 'buy',
        type: 'limit',
        amount: 100.50,
        price: 100200.0, // Above market price of 100150.4
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(buyLimitAboveMarket);
      
      expect(errors).toContain('Buy limit order price (100200) must be lower than current market price (100150.4)');
    });

    it('should validate sell limit order price is above market price', () => {
      const sellLimitBelowMarket: Partial<TradeOrder> = {
        side: 'sell',
        type: 'limit',
        amount: 100.50,
        price: 100100.0, // Below market price of 100150.4
        pair: 'BTCUSD'
      };

      const errors = TradeOrderValidationService.validateTradeOrder(sellLimitBelowMarket);
      
      expect(errors).toContain('Sell limit order price (100100) must be higher than current market price (100150.4)');
    });
  });

  describe('getMarketPrices', () => {
    it('should return market prices', () => {
      const prices = TradeOrderValidationService.getMarketPrices();
      
      expect(prices).toHaveProperty('BTCUSD');
      expect(prices).toHaveProperty('EURUSD');
      expect(prices).toHaveProperty('ETHUSD');
      expect(typeof prices.BTCUSD).toBe('number');
    });
  });
});

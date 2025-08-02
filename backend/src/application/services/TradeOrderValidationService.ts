import { TradeOrder } from "../../domain/entities";

export interface MarketPrices {
  [pair: string]: number;
}

export class TradeOrderValidationService {
  private static readonly MARKET_PRICES: MarketPrices = {
    'BTCUSD': 100150.4,
    'EURUSD': 1.035,
    'ETHUSD': 3310
  };

  static validateTradeOrder(tradeOrderData: Partial<TradeOrder>): string[] {
    const errors: string[] = [];

    // Validate required fields
    if (!tradeOrderData.side) {
      errors.push('Side is required');
    } else if (!['buy', 'sell'].includes(tradeOrderData.side)) {
      errors.push('Side must be either "buy" or "sell"');
    }

    if (!tradeOrderData.type) {
      errors.push('Type is required');
    } else if (!['limit', 'market', 'stop'].includes(tradeOrderData.type)) {
      errors.push('Type must be "limit", "market", or "stop"');
    }

    if (!tradeOrderData.amount) {
      errors.push('Amount is required');
    } else if (tradeOrderData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (!this.isValidDecimalPlaces(tradeOrderData.amount, 2)) {
      errors.push('Amount must have maximum 2 decimal places');
    }

    if (!tradeOrderData.pair) {
      errors.push('Pair is required');
    } else if (!this.MARKET_PRICES[tradeOrderData.pair]) {
      errors.push(`Invalid trading pair. Available pairs: ${Object.keys(this.MARKET_PRICES).join(', ')}`);
    }

    // Price validation based on order type
    if (tradeOrderData.type && tradeOrderData.type !== 'market') {
      if (!tradeOrderData.price) {
        errors.push('Price is required for limit and stop orders');
      } else {
        if (tradeOrderData.price <= 0) {
          errors.push('Price must be greater than 0');
        } else if (!this.isValidDecimalPlaces(tradeOrderData.price, 5)) {
          errors.push('Price must have maximum 5 decimal places');
        } else if (tradeOrderData.pair && this.MARKET_PRICES[tradeOrderData.pair]) {
          const priceValidationError = this.validateOrderPrice(
            tradeOrderData.type,
            tradeOrderData.side!,
            tradeOrderData.price,
            tradeOrderData.pair
          );
          if (priceValidationError) {
            errors.push(priceValidationError);
          }
        }
      }
    }

    // Validate status if provided
    if (tradeOrderData.status && !['open', 'cancelled', 'executed'].includes(tradeOrderData.status)) {
      errors.push('Status must be "open", "cancelled", or "executed"');
    }

    return errors;
  }

  private static validateOrderPrice(
    type: string,
    side: string,
    price: number,
    pair: string
  ): string | null {
    const marketPrice = this.MARKET_PRICES[pair];

    switch (type) {
      case 'limit':
        if (side === 'buy' && price >= marketPrice) {
          return `Buy limit order price (${price}) must be lower than current market price (${marketPrice})`;
        }
        if (side === 'sell' && price <= marketPrice) {
          return `Sell limit order price (${price}) must be higher than current market price (${marketPrice})`;
        }
        break;

      case 'stop':
        if (side === 'buy' && price <= marketPrice) {
          return `Buy stop order price (${price}) must be higher than current market price (${marketPrice})`;
        }
        if (side === 'sell' && price >= marketPrice) {
          return `Sell stop order price (${price}) must be lower than current market price (${marketPrice})`;
        }
        break;

      case 'market':
        // No price validation for market orders
        break;
    }

    return null;
  }

  private static isValidDecimalPlaces(value: number, maxDecimals: number): boolean {
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    return decimalPlaces <= maxDecimals;
  }

  static getMarketPrices(): MarketPrices {
    return { ...this.MARKET_PRICES };
  }
}

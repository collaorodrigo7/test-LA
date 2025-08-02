import { TradeOrder } from "../../domain/entities";
import { TradeOrderReporsitory } from "../../domain/repositories";
import { TradeOrderValidationService } from "./TradeOrderValidationService";

export class TradeOrderService {
  constructor(private tradeOrderRepository: TradeOrderReporsitory) {}

  async createTradeOrder(tradeOrderData: Partial<TradeOrder>): Promise<TradeOrder> {
    // Validate the trade order data
    const validationErrors = TradeOrderValidationService.validateTradeOrder(tradeOrderData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    return await this.tradeOrderRepository.create(tradeOrderData);
  }

  async getTradeOrderById(id: string): Promise<TradeOrder> {
    const tradeOrder = await this.tradeOrderRepository.findById(id);
    if (!tradeOrder) {
      throw new Error('Trade order not found');
    }
    return tradeOrder;
  }

  async getAllTradeOrders(): Promise<TradeOrder[]> {
    return await this.tradeOrderRepository.findAll();
  }

  async getTradeOrders(init: number, limit: number): Promise<TradeOrder[]> {
    return await this.tradeOrderRepository.find(init, limit);
  }

  async deleteTradeOrder(id: string): Promise<void> {
    const deleted = await this.tradeOrderRepository.delete(id);
    if (!deleted) {
      throw new Error('Trade order not found');
    }
  }
}

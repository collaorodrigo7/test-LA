import { TradeOrder } from "../entities";

export interface TradeOrderReporsitory {
  findById(id: string): Promise<TradeOrder | null>;
  findAll(): Promise<TradeOrder[]>;
  find(init: number, limit: number): Promise<TradeOrder[]>;
  create(tradeOrderData: Partial<TradeOrder>): Promise<TradeOrder>;
  delete(id: string): Promise<boolean>;
}

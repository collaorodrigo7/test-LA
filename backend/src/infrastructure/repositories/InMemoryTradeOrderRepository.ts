import { TradeOrder } from "../../domain/entities";
import { TradeOrderReporsitory } from "../../domain/repositories";
import { v4 as uuidv4 } from 'uuid';


export class InMemoryTradeOrderRepository implements TradeOrderReporsitory {
    tradeOrders: TradeOrder[] = [];

    get tradeOrdersList(): TradeOrder[] {
        return this.tradeOrders.filter(order => !order.isDeleted);
    }

    async findById(id: string): Promise<TradeOrder | null> {
        const order = this.tradeOrdersList.find(order => order.id === id);
        return order || null;
    }

    async findAll(): Promise<TradeOrder[]> {
        return [...this.tradeOrdersList];
    }

    async find(init: number = 0, limit: number = 10): Promise<TradeOrder[]> {
        return this.tradeOrdersList.slice(init, init + limit);
    }

    async create(tradeOrderData: Partial<TradeOrder>): Promise<TradeOrder> {
        const newOrder: TradeOrder = {
            status: "open",
            ...tradeOrderData,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
            deletedAt: undefined,
            id: tradeOrderData.id || uuidv4(),
        } as TradeOrder;
        return newOrder;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.tradeOrders.findIndex(order => order.id === id);
        if (index === -1) return false;
        this.tradeOrders[index] = {
            ...this.tradeOrders[index],
            isDeleted: true,
            deletedAt: new Date(),
        } as TradeOrder;
        return true;
    }
}
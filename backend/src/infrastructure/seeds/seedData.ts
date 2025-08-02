import { TradeOrder } from "../../domain/entities";
import { InMemoryTradeOrderRepository } from "../repositories/InMemoryTradeOrderRepository";

const tradingPairs = [
  'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 
  'AUDUSD', 'USDCAD', 'EURGBP', 'EURJPY', 'GBPJPY'
];

const sides: ('buy' | 'sell')[] = ['buy', 'sell'];
const types: ('limit' | 'market' | 'stop')[] = ['limit', 'market', 'stop'];
const statuses: ('open' | 'cancelled' | 'executed')[] = ['open', 'cancelled', 'executed'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomPrice(pair: string): number {
  // Different price ranges for different pairs
  switch (pair) {
    case 'BTCUSD':
      return getRandomNumber(40000, 70000);
    case 'ETHUSD':
      return getRandomNumber(2000, 4000);
    case 'EURUSD':
    case 'GBPUSD':
    case 'AUDUSD':
      return getRandomNumber(0.95, 1.35);
    case 'USDJPY':
      return getRandomNumber(140, 160);
    case 'USDCAD':
      return getRandomNumber(1.25, 1.40);
    case 'EURGBP':
      return getRandomNumber(0.82, 0.92);
    case 'EURJPY':
      return getRandomNumber(150, 170);
    case 'GBPJPY':
      return getRandomNumber(175, 195);
    default:
      return getRandomNumber(1, 100);
  }
}

function generateRandomAmount(): number {
  return Math.round(getRandomNumber(0.1, 10) * 100) / 100;
}

export async function seedTradeOrders(repository: InMemoryTradeOrderRepository, count: number = 25): Promise<void> {
  console.log(`🌱 Seeding ${count} random trade orders...`);
  
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    const pair = getRandomElement(tradingPairs);
    const side = getRandomElement(sides);
    const type = getRandomElement(types);
    const status = getRandomElement(statuses);
    const createdAt = getRandomDate(oneWeekAgo, now);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * (now.getTime() - createdAt.getTime()));
    
    const tradeOrder: Partial<TradeOrder> = {
      side,
      type,
      pair,
      amount: generateRandomAmount(),
      price: Math.round(generateRandomPrice(pair) * 100000) / 100000, // 5 decimal places
      status,
      createdAt,
      updatedAt,
      isDeleted: false
    };
    
    await repository.create(tradeOrder);
  }
  
  console.log(`✅ Successfully seeded ${count} trade orders`);
  console.log(`📊 Repository now contains ${repository.tradeOrdersList.length} orders`);
}

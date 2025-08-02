// Dependency Injection Container
import { TradeOrderController } from './presentation/controllers';
import { TradeOrderService } from './application/services';
import { InMemoryTradeOrderRepository } from './infrastructure/repositories';

export class Container {
  private static instance: Container;

  private tradeOrderRepository: InMemoryTradeOrderRepository;
  private tradeOrderService: TradeOrderService;
  private tradeOrderController: TradeOrderController;

  private constructor() {
    // Initialize repositories
    this.tradeOrderRepository = new InMemoryTradeOrderRepository();
    
    // Initialize services
    this.tradeOrderService = new TradeOrderService(this.tradeOrderRepository);
    
    // Initialize controllers
    this.tradeOrderController = new TradeOrderController(this.tradeOrderService);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getTradeOrderController(): TradeOrderController {
    return this.tradeOrderController;
  }

  public getTradeOrderRepository(): InMemoryTradeOrderRepository {
    return this.tradeOrderRepository;
  }
}

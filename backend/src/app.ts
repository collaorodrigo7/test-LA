import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './infrastructure/middleware/errorHandler';
import { AppError } from './infrastructure/middleware/AppError';
import { createRoutes } from './presentation/routes';
import { TradeOrderController } from './presentation/controllers';
import { setupSwagger } from './infrastructure/swagger';

export const createApp = (
    tradeOrderController: TradeOrderController
): Application => {
  const app = express();
  
  // CORS middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
  }));
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Setup Swagger documentation
  setupSwagger(app);

  // Root endpoint - redirect to API documentation
  app.get('/', (req: Request, res: Response) => {
    res.redirect('/api/docs');
  });

  // Routes
  app.use('/api/v1', createRoutes(tradeOrderController));

  // Handle unhandled routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global error handling middleware
  app.use(globalErrorHandler);

  return app;
};

import dotenv from 'dotenv';
import { createApp } from './app';
import { Container } from './container';
import { seedTradeOrders } from './infrastructure/seeds/seedData';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize dependency injection container
const container = Container.getInstance();

// Create Express application
const app = createApp(
  container.getTradeOrderController()
);

// Seed random data on server start
async function initializeServer() {
  try {
    // Seed 25 random trade orders
    await seedTradeOrders(container.getTradeOrderRepository(), 8);
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💀 Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('💀 Process terminated');
      });
    });

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Initialize server with seeded data
initializeServer();

export default app;

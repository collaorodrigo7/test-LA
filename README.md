# Trading Order Management System

A full-stack trading order management system built with Node.js (Express) backend and Angular frontend, implementing Clean Architecture principles.

## 📋 Project Overview

This project is a RESTful API and web application for managing trading orders with the following features:

- **Trading Order Management**: Create, read, update, and delete trading orders
- **Order Types**: Support for Market, Limit, and Stop orders
- **Price Validation**: Real-time validation against current market prices
- **Trading Pairs**: Support for BTCUSD, EURUSD, and ETHUSD pairs
- **Order Status**: Track orders as open, cancelled, or executed
- **API Documentation**: Swagger/OpenAPI documentation
- **Unit Testing**: Comprehensive test coverage
- **Clean Architecture**: Modular, maintainable code structure

### Trading Order Model

The `trade_order` entity includes:

- `id`: Unique UUID identifier
- `side`: "buy" or "sell"
- `type`: "limit", "market", or "stop"
- `amount`: Decimal number (max 2 decimal places)
- `price`: Decimal number (max 5 decimal places)
- `status`: "open", "cancelled", or "executed" (default: "open")
- `pair`: Trading pair (e.g., "BTCUSD")
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🏗️ Architecture

### Backend (Node.js + Express)

```text
src/
├── application/        # Business logic and services
├── domain/            # Entities and repository interfaces
├── infrastructure/    # External concerns (middleware, repositories)
├── presentation/      # Controllers, routes, and validation
└── tests/            # Unit tests
```

### Frontend (Angular)

```text
src/app/
├── trade-orders/      # Trading order components and modules
├── api.service.ts     # HTTP client service
└── app.config.ts      # Application configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3000`

4. **API Documentation:**
   Visit `http://localhost:3000/api/docs` for Swagger documentation

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:4200`

### Production Build

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
```

## 🧪 Testing

### Backend Unit Tests

Run all tests:

```bash
cd backend
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

View coverage report at `backend/coverage/lcov-report/index.html`

### Test Coverage

The project includes comprehensive unit tests for:

- **TradeOrderService**: Business logic and validation
- **TradeOrderValidationService**: Price and order validation
- **TradeOrderController**: API endpoints and error handling
- **InMemoryTradeOrderRepository**: Data persistence layer

### Frontend Tests

```bash
cd frontend
npm test
```

## 📚 API Documentation

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs` | Swagger API documentation |
| POST | `/trade_orders` | Create a new trading order |
| GET | `/trade_orders` | Retrieve all trading orders |
| GET | `/trade_orders/:id` | Retrieve a specific order |
| PUT | `/trade_orders/:id` | Update an existing order |
| DELETE | `/trade_orders/:id` | Delete an order (soft delete) |

### Request/Response Examples

#### Create Order

```bash
POST /trade_orders
Content-Type: application/json

{
  "side": "buy",
  "type": "limit",
  "amount": 0.1,
  "price": 100000.0,
  "pair": "BTCUSD"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "side": "buy",
    "type": "limit",
    "amount": 0.1,
    "price": 100000.0,
    "pair": "BTCUSD",
    "status": "open",
    "createdAt": "2025-08-01T10:00:00.000Z",
    "updatedAt": "2025-08-01T10:00:00.000Z"
  }
}
```

### Price Validation Rules

Current market prices:

- **BTCUSD**: 100,150.4
- **EURUSD**: 1.035
- **ETHUSD**: 3,310

**Limit Orders:**

- Buy limit: Price must be lower than market price
- Sell limit: Price must be higher than market price

**Stop Orders:**

- Buy stop: Price must be higher than market price
- Sell stop: Price must be lower than market price

**Market Orders:**

- No price validation required

## 🛠️ Development

### Code Quality

Backend linting:

```bash
cd backend
npm run lint
npm run lint:fix
```

### Project Structure

The project follows Clean Architecture principles:

- **Domain Layer**: Core business entities and repository interfaces
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External dependencies and implementations
- **Presentation Layer**: API controllers and routes

### Environment Variables

Create `.env` file in backend directory:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

## 🌟 Features Implemented

### Core Features

- ✅ RESTful API for trading orders
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Order price validation based on market prices
- ✅ Support for all order types (Market, Limit, Stop)
- ✅ Angular frontend with material design
- ✅ API documentation with Swagger

### Advanced Features

- ✅ Unit tests with high coverage
- ✅ Soft delete functionality
- ✅ Error handling and validation
- ✅ CORS configuration
- ✅ TypeScript throughout
- ✅ Clean Architecture implementation
- ✅ In-memory data persistence
- ✅ Pagination support

### Frontend Features

- ✅ Trading orders list view (`/trades`)
- ✅ Create new order form (`/trades/new`)
- ✅ Responsive design with Angular Material
- ✅ Form validation and error handling
- ✅ HTTP client service for API communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in environment variables
2. **CORS errors**: Ensure frontend URL is configured in backend
3. **Test failures**: Run `npm install` and ensure all dependencies are installed

### Support

For issues and questions, please check the API documentation at `/api/docs` when running the backend server.
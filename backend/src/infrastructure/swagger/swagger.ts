import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FX Replay API',
      version: '1.0.0',
      description: 'Microservice backend API for FX Replay application using Clean Architecture',
      contact: {
        name: 'API Support',
        email: 'support@fxreplay.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        TradeOrder: {
          type: 'object',
          required: ['side', 'type', 'amount', 'pair'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the trade order',
              example: 'uuid-123-456-789',
            },
            side: {
              type: 'string',
              enum: ['buy', 'sell'],
              description: 'Trade order side',
              example: 'buy',
            },
            type: {
              type: 'string',
              enum: ['limit', 'market', 'stop'],
              description: 'Trade order type',
              example: 'limit',
            },
            amount: {
              type: 'number',
              description: 'Trade order amount',
              example: 100.50,
              minimum: 0,
            },
            price: {
              type: 'number',
              description: 'Trade order price (required for limit and stop orders)',
              example: 100000.0,
              minimum: 0,
            },
            status: {
              type: 'string',
              enum: ['open', 'cancelled', 'executed'],
              description: 'Trade order status',
              example: 'open',
            },
            pair: {
              type: 'string',
              description: 'Trading pair',
              example: 'BTCUSD',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2025-08-01T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2025-08-01T10:00:00.000Z',
            },
          },
        },
        CreateTradeOrderRequest: {
          type: 'object',
          required: ['side', 'type', 'amount', 'pair'],
          properties: {
            side: {
              type: 'string',
              enum: ['buy', 'sell'],
              description: 'Trade order side',
              example: 'buy',
            },
            type: {
              type: 'string',
              enum: ['limit', 'market', 'stop'],
              description: 'Trade order type',
              example: 'limit',
            },
            amount: {
              type: 'number',
              description: 'Trade order amount',
              example: 100.50,
              minimum: 0,
            },
            price: {
              type: 'number',
              description: 'Trade order price (required for limit and stop orders)',
              example: 100000.0,
              minimum: 0,
            },
            pair: {
              type: 'string',
              description: 'Trading pair',
              example: 'BTCUSD',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            data: {
              type: 'object',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            results: {
              type: 'number',
              description: 'Number of results in current page',
              example: 10,
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'number',
                  example: 1,
                },
                totalPages: {
                  type: 'number',
                  example: 5,
                },
                totalCount: {
                  type: 'number',
                  example: 50,
                },
                pageSize: {
                  type: 'number',
                  example: 10,
                },
                hasNextPage: {
                  type: 'boolean',
                  example: true,
                },
                hasPreviousPage: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            data: {
              type: 'object',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Something went wrong',
            },
            statusCode: {
              type: 'number',
              example: 400,
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Validation failed',
                statusCode: 400,
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Resource not found',
                statusCode: 404,
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                status: 'error',
                message: 'Internal server error',
                statusCode: 500,
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts', './src/presentation/controllers/*.ts'],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FX Replay API Documentation',
  }));
  
  // Serve swagger.json
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export { specs as swaggerSpecs };

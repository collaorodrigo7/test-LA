import Joi from 'joi';

export const createTradeOrderSchema = Joi.object({
  side: Joi.string().valid('buy', 'sell').required().messages({
    'any.required': 'Side is required',
    'any.only': 'Side must be either "buy" or "sell"'
  }),
  type: Joi.string().valid('limit', 'market', 'stop').required().messages({
    'any.required': 'Type is required',
    'any.only': 'Type must be "limit", "market", or "stop"'
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'any.required': 'Amount is required',
    'number.positive': 'Amount must be greater than 0',
    'number.precision': 'Amount must have maximum 2 decimal places'
  }),
  price: Joi.when('type', {
    is: Joi.string().valid('limit', 'stop'),
    then: Joi.number().positive().precision(5).required().messages({
      'any.required': 'Price is required for limit and stop orders',
      'number.positive': 'Price must be greater than 0',
      'number.precision': 'Price must have maximum 5 decimal places'
    }),
    otherwise: Joi.number().positive().precision(5).optional()
  }),
  status: Joi.string().valid('open', 'cancelled', 'executed').optional(),
  pair: Joi.string().valid('BTCUSD', 'EURUSD', 'ETHUSD').required().messages({
    'any.required': 'Pair is required',
    'any.only': 'Invalid trading pair. Available pairs: BTCUSD, EURUSD, ETHUSD'
  })
});

export const tradeOrderIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Trade order ID is required',
    'string.empty': 'Trade order ID cannot be empty'
  })
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  }),
  // Mantendo init para backward compatibility
  init: Joi.number().integer().min(0).optional()
});

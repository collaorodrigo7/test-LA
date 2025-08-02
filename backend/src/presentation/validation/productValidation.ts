import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name must not exceed 100 characters',
    'any.required': 'Product name is required'
  }),
  description: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description must not exceed 500 characters',
    'any.required': 'Description is required'
  }),
  price: Joi.number().positive().required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required'
  }),
  category: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Category must be at least 2 characters long',
    'string.max': 'Category must not exceed 50 characters',
    'any.required': 'Category is required'
  }),
  inStock: Joi.boolean().default(true)
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name must not exceed 100 characters'
  }),
  description: Joi.string().min(10).max(500).messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description must not exceed 500 characters'
  }),
  price: Joi.number().positive().messages({
    'number.positive': 'Price must be a positive number'
  }),
  category: Joi.string().min(2).max(50).messages({
    'string.min': 'Category must be at least 2 characters long',
    'string.max': 'Category must not exceed 50 characters'
  }),
  inStock: Joi.boolean()
}).min(1);

export const productIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Please provide a valid product ID',
    'any.required': 'Product ID is required'
  })
});

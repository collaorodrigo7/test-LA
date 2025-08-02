import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 50 characters',
    'any.required': 'Name is required'
  })
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address'
  }),
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 50 characters'
  })
}).min(1);

export const userIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Please provide a valid user ID',
    'any.required': 'User ID is required'
  })
});

import Joi from 'joi';
import { emailRegexp } from '../constants/index.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[0-9]{10,15}$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'PhoneNumber should start with "+"',
      'string.min': 'PhoneNumber should have at least 3 characters',
      'string.max': 'PhoneNumber should have at most 20 characters',
      'any.required': 'PhoneNumber is required',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .pattern(emailRegexp)
    .messages({
      'string.base': 'Input correct email, for example: example@domain.com',
    }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Field must be true or false',
  }),
  contactType: Joi.string()
    .valid('personal', 'home', 'work')
    .required()
    .messages({
      'any.only': 'Field should have one of this values: personal, home, work',
      'any.required': 'Field is required',
    }),
  photo: Joi.string().uri().optional().messages({
    'string.uri': 'Photo must be a valid URL',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[0-9]{10,15}$/)
    .min(3)
    .max(20)
    .messages({
      'string.base': 'PhoneNumber should start with "+"',
      'string.min': 'Name should have at least 3 characters',
      'string.max': 'Name should have at most 20 characters',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .pattern(emailRegexp)
    .messages({
      'string.base': 'Input correct email, for example: example@domain.com',
    }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Field must be true or false',
  }),
  contactType: Joi.string().valid('personal', 'home', 'work').messages({
    'any.only': 'Field should have one of this values: personal, home, work.',
  }),
});

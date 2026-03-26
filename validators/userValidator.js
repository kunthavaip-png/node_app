const Joi = require("joi");

const createSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "string.empty": "User name is required.",
    "any.required": "User name is required.",
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
    "string.min": "Password must be at least 4 characters"
  }),
  email: Joi.string().email().trim().required().messages({
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
    "string.email": "Please enter a valid email address"
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
    "string.empty": "Phone is required.",
    "any.required": "Phone is required.",
    'string.pattern.base': 'Phone number must be 10 digits'
  }),
  
  role_ids: Joi.array().items(Joi.string()).min(1).required().messages({
    "any.required": "Roles are required.",
    'array.base': 'Roles must be provided as an array',
    'array.min': 'At least one role must be assigned',
  }),
  
  
});

const updateSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    "string.empty": "User name is required.",
    "any.required": "User name is required.",
  }),
  email: Joi.string().email().trim().allow('', null).optional().messages({
    'string.email': 'Please enter a valid email address',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
    "string.empty": "Phone is required.",
    "any.required": "Phone is required.",
    'string.pattern.base': 'Phone number must be 10 digits'
  }),
  
  role_ids: Joi.array().items(Joi.string()).min(1).required().messages({
    "any.required": "Roles are required.",
    'array.base': 'Roles must be provided as an array',
    'array.min': 'At least one role must be assigned',
  }),
  
});



module.exports = {
  createSchema,
  updateSchema
  
};

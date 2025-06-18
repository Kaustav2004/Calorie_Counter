const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Validation rules for food analysis
exports.validateCalorieInput = [
  // Validate either text input or image is provided
  body().custom((value, { req }) => {
    if (!req.body.foodName && !req.body.image) {
      throw new Error('Either food name or image must be provided');
    }
    return true;
  }),
  
  // If foodName is provided, validate it
  body('foodName').if(body('foodName').exists()).trim().notEmpty().withMessage('Food name is required'),
  
  // If quantity is provided, validate it
  body('quantity').if(body('quantity').exists()).trim().notEmpty().withMessage('Quantity is required'),
  
  // If image is provided, validate it's base64
  body('image').if(body('image').exists()).isString().withMessage('Image must be a base64 string'),
  
  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ApiError(errorMessages.join(', '), 400));
    }
    next();
  }
];
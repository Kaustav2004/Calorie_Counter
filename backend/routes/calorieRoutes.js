const express = require('express');
const router = express.Router();
const calorieController = require('../controllers/calorieController');
const { validateCalorieInput } = require('../middleware/validation');

router.post('/analyze', validateCalorieInput, calorieController.analyzeFood);

module.exports = router;
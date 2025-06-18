const { analyzeWithGemini } = require('../services/geminiService');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { saveAnalysis } = require('../services/dbService');
const ApiError = require('../utils/ApiError');

exports.analyzeFood = async (req, res, next) => {
  console.log("hit");
  console.log("Request body:", req.body);
  try {
    const { foodName, quantity, image } = req.body;
    console.log("Request body:", req.body);

    const geminiResponse = await analyzeWithGemini({
      foodName,
      quantity,
      imageUrl:image
    });


    res.json({
      success: true,
      data: geminiResponse
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};
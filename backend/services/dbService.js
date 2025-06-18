// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// // Analysis model schema
// const analysisSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   foodName: String,
//   quantity: String,
//   imageUrl: String,
//   analysis: Object,
//   createdAt: { type: Date, default: Date.now }
// });

// const Analysis = mongoose.model('Analysis', analysisSchema);

// // Save analysis to database
// const saveAnalysis = async (data) => {
//   try {
//     const analysis = new Analysis(data);
//     await analysis.save();
//     return analysis;
//   } catch (error) {
//     console.error('Error saving analysis:', error);
//     throw error;
//   }
// };

// // Get user's analysis history
// const getAnalysisHistory = async (userId) => {
//   try {
//     return await Analysis.find({ userId }).sort({ createdAt: -1 });
//   } catch (error) {
//     console.error('Error fetching analysis history:', error);
//     throw error;
//   }
// };

// module.exports = {
//   connectDB,
//   saveAnalysis,
//   getAnalysisHistory
// };
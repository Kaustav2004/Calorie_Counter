const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const defaultStructure = {
  calories: null,
  protein: null,
  carbohydrates: null,
  fat: null,
  fiber: null,
  sugar: null,
  serving_size: null,
  additional_notes: []
};

// async function analyzeWithGemini({ foodName, quantity, imageUrl }) {
//   console.log("Analyzing with Gemini:", { foodName, quantity, imageUrl });
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash",
//       generationConfig: {
//         temperature: 0.4,
//         responseMimeType: "application/json"  // Request JSON response explicitly
//       }
//     });

//     let prompt = `You are a nutritionist. Analyze the following food item and return ONLY a JSON object with these exact properties:
// {
//   "calories": { "per_100g": number with unit, "total": number with unit},
//   "protein": { "per_100g": number with unit, "total": number with unit},
//   "carbohydrates": { "per_100g": number with unit, "total": number with unit},
//   "fat": { "per_100g": number with unit, "total": number with unit},
//   "fiber": { "per_100g": number with unit, "total": number with unit},
//   "sugar": { "per_100g": number with unit, "total": number with unit},
//   "serving_size": string,
//   "additional_notes": string[]
// }

// Food Name: ${foodName || "N/A"}
// Quantity: ${quantity || "N/A"}
// ${imageUrl ? "An image is also provided." : ""}

// Return ONLY the JSON object with no additional text or markdown formatting.`;

//     let result;
//     if (imageUrl) {
//       const imagePart = {
//         inlineData: {
//           data: await fetchImageAsBase64(imageUrl),
//           mimeType: "image/jpeg",
//         },
//       };
//       result = await model.generateContent([prompt, imagePart]);
//     } else {
//       result = await model.generateContent(prompt);
//     }

//     const response = await result.response;
//     let text = response.text().trim();

//     // Clean the response if it contains markdown code blocks
//     if (text.startsWith('```json')) {
//       text = text.replace(/^```json|```$/g, '').trim();
//     } else if (text.startsWith('```')) {
//       text = text.replace(/^```|```$/g, '').trim();
//     }

//     // Parse the cleaned JSON
//     const parsed = JSON.parse(text);

//     // Normalize the structure
//     console.log("Parsed response:", parsed);
//     return {
//       foodName: foodName || "N/A",
//       quantity: quantity || "N/A",
//       calories: parsed.calories || defaultStructure.calories,
//       protein: parsed.protein || defaultStructure.protein,
//       carbohydrates: parsed.carbohydrates || defaultStructure.carbohydrates,
//       fat: parsed.fat || defaultStructure.fat,
//       fiber: parsed.fiber || defaultStructure.fiber,
//       sugar: parsed.sugar || defaultStructure.sugar,
//       serving_size: parsed.serving_size || defaultStructure.serving_size,
//       additional_notes: Array.isArray(parsed.additional_notes)
//         ? parsed.additional_notes
//         : typeof parsed.additional_notes === "string"
//         ? [parsed.additional_notes]
//         : defaultStructure.additional_notes
//     };
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     return defaultStructure;
//   }
// }
async function analyzeWithGemini({ foodName, quantity, imageUrl }) {
  console.log("Analyzing with Gemini:", { foodName, quantity, imageUrl });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const isImageMode = !!imageUrl && (!foodName || !quantity);

    let prompt;

    if (isImageMode) {
      prompt = `You are a nutritionist. Analyze the food item in the provided image and return ONLY a JSON object with these properties:
{
  "food_name": string (estimated name of the food item),
  "quantity": string (estimated quantity or serving size),
  "calories": { "per_100g": string with unit with space, "total": string with unit with space},
  "protein": { "per_100g": string with unit with space, "total": string with unit with space},
  "carbohydrates": { "per_100g": string with unit with space, "total": string with unit with space},
  "fat": { "per_100g": string with unit with space, "total": string with unit with space},
  "fiber": { "per_100g": string with unit with space, "total": string with unit with space},
  "sugar": { "per_100g": string with unit with space, "total": string with unit with space},
  "serving_size": string,
  "additional_notes": string[]
}

Use your best guess to determine the food name and quantity from the image. Return ONLY the JSON object with no additional explanation or formatting.`;
    } else {
      prompt = `You are a nutritionist. Analyze the following food item and return ONLY a JSON object with these properties:
{
  "food_name": string,
  "quantity": string,
  "calories": { "per_100g": string with unit with space, "total": string with unit with space},
  "protein": { "per_100g": string with unit with space, "total": string with unit with space},
  "carbohydrates": { "per_100g": string with unit with space, "total": string with unit with space},
  "fat": { "per_100g": string with unit with space, "total": string with unit with space},
  "fiber": { "per_100g": string with unit with space, "total": string with unit with space},
  "sugar": { "per_100g": string with unit with space, "total": string with unit with space},
  "serving_size": string,
  "additional_notes": string[]
}

Food Name: ${foodName}
Quantity: ${quantity}

Return ONLY the JSON object with no additional explanation or formatting.`;
    }

    let result;
    if (isImageMode) {
      const imagePart = {
        inlineData: {
          data: await fetchImageAsBase64(imageUrl),
          mimeType: "image/jpeg",
        },
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    let text = response.text().trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json|```$/g, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```|```$/g, "").trim();
    }

    const parsed = JSON.parse(text);
    console.log("Parsed response:", parsed);

    return {
      foodName: parsed.food_name || foodName || "N/A",
      quantity: parsed.quantity || quantity || "N/A",
      calories: parsed.calories || defaultStructure.calories,
      protein: parsed.protein || defaultStructure.protein,
      carbohydrates: parsed.carbohydrates || defaultStructure.carbohydrates,
      fat: parsed.fat || defaultStructure.fat,
      fiber: parsed.fiber || defaultStructure.fiber,
      sugar: parsed.sugar || defaultStructure.sugar,
      serving_size: parsed.serving_size || defaultStructure.serving_size,
      additional_notes: Array.isArray(parsed.additional_notes)
        ? parsed.additional_notes
        : typeof parsed.additional_notes === "string"
        ? [parsed.additional_notes]
        : defaultStructure.additional_notes,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return defaultStructure;
  }
}


async function fetchImageAsBase64(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

module.exports = { analyzeWithGemini };
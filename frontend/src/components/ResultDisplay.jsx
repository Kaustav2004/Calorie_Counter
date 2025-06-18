import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import NutritionChart from './NutritionChart';

const ResultDisplay = ({ result, foodName, quantity }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success('Copied to clipboard!');
  };

  const formatNutrient = (nutrient) => {
    if (!nutrient) return 'N/A';
    return `Total: ${nutrient.total ?? 'N/A'} (${nutrient.per_100g ?? 'N/A'}/100g)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Analysis Results
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <FiCopy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Nutritional Information
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Food Name</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {foodName || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Quantity</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {quantity || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Serving Size</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {result.serving_size || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Calories</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.calories)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Protein</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.protein)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Carbohydrates</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.carbohydrates)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Fat</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.fat)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Fiber</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.fiber)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Sugar</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatNutrient(result.sugar)}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Nutrition Chart (per 100g)
            </h3>
            <div className="h-64">
              <NutritionChart data={result} />
            </div>
          </div>
        </div>

        {Array.isArray(result.additional_notes) && result.additional_notes.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Additional Notes
            </h3>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
              {result.additional_notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;

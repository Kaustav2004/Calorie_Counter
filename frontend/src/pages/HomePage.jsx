import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import FoodForm from '../components/FoodForm';
import ResultDisplay from '../components/ResultDisplay';
import { analyzeFood } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('text');
  const [formKey, setFormKey] = useState(0); // Used to reset form
  const navigate = useNavigate();

  // Reset result when method changes
  useEffect(() => {
    setResult(null);
  }, [method]);

const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    setResult(null); // Clear previous results
    // console.log("Submitting form data:", formData);
    const response = await analyzeFood(formData);

    if (!response.data) {
      throw new Error('No analysis found');
    }

    // Extract and clean the JSON from the Markdown code block
    const rawAnalysis = response.data;
    // console.log("Raw Analysis:", rawAnalysis);
    // Remove triple backticks and optional "json" label
    const jsonString = rawAnalysis;

    // Parse the JSON string into an object
    // const parsedResult = JSON.parse(jsonString);

    // console.log("Parsed Result:", parsedResult);
    setResult(jsonString);
    toast.success('Analysis complete!');
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error(error.response?.data?.message || error.message || 'Failed to analyze food');
  } finally {
    setLoading(false);
  }
};


  const handleMethodChange = (newMethod) => {
    if (loading) return; // Prevent changing method during analysis
    setMethod(newMethod);
  };

  return (
    <div className="relative min-h-screen ">
      <AnimatedBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Calorie<span className="text-blue-500">Counter</span>
            </h1>
            
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => handleMethodChange('text')}
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                    method === 'text' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Text Input
                </button>
                <button
                  onClick={() => handleMethodChange('image')}
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                    method === 'image' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Image Upload
                </button>
              </div>
            </div>

            <div className="mb-8">
              <FoodForm 
                key={formKey} // Reset form when changed
                method={method} 
                onSubmit={handleSubmit} 
                isLoading={loading}
              />
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center my-8 space-y-2">
                <LoadingSpinner />
                <p className="text-gray-600 dark:text-gray-400">
                  Analyzing your {method === 'text' ? 'food details' : 'image'}...
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-8 animate-fade-in">
                <ResultDisplay 
                  result={result} 
                  foodName={result.foodName || 'Unknown Food'}
                  quantity={result.quantity || 'Unknown Quantity'}
                  onNewAnalysis={() => {
                    setResult(null);
                    setFormKey(prev => prev + 1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
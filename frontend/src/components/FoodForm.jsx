import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import axios from 'axios';

const FoodForm = ({ method, onSubmit, isLoading }) => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [imgUploading, setImgUploading] = useState(false);  

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) {
    setError('No file selected');
    return;
  }

  if (!file.type.startsWith('image/')) {
    setError('Please upload a valid image');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError('File must be less than 5MB');
    return;
  }

  setError('');
  setImage(file);

  // Preview image
  const reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result);
  reader.readAsDataURL(file);

  // ✅ Upload to Cloudinary
  try {
    const url = await uploadToCloudinary(file);
    // console.log('Uploaded image URL:', url);
    setImage(url); // Save Cloudinary URL for form submit
  } catch (err) {
    console.error('Cloudinary upload failed', err);
    setError('Image upload failed');
  }
};


  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const uploadToCloudinary = async (file) => {
    setImgUploading(true);
    // Validate input
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Get environment variables
    const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    // Validate environment variables
    if (!CLOUDINARY_UPLOAD_URL || !UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Optional: Add timeout
        timeout: 30000 // 30 seconds
      });

      if (!response.data.secure_url) {
        throw new Error('No secure_url returned from Cloudinary');
      }
      setImgUploading(false);
      return response.data.secure_url;
    } catch (err) {
      setImgUploading(false);
      console.error('Cloudinary Upload Error:', {
        error: err.response?.data || err.message,
        config: {
          url: CLOUDINARY_UPLOAD_URL,
          preset: UPLOAD_PRESET,
          file: { name: file.name, type: file.type, size: file.size }
        }
      });
      throw new Error(`Failed to upload image: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();

    if (method === 'text') {
      if (!foodName.trim()) {
        setError('Food name is required');
        return;
      }
      if (!quantity.trim()) {
        setError('Quantity is required');
        return;
      }
      formData.append('foodName', foodName.trim());
      formData.append('quantity', quantity.trim());
    } else {
      if (!image) {
        setError('Please upload an image');
        return;
      }
      formData.append('image', image);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}>
            <FiX size={18} />
          </button>
        </div>
      )}

      {method === 'text' ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food Name *
            </label>
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Grilled Chicken Breast"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity *
            </label>
            <input
              type="text"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 200g or 1 cup"
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 relative ${
                preview
                  ? 'border-transparent'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <FiUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG (MAX. 5MB)
                  </p> */}
                </div>
              )}
              <input
                id="dropzone-file"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                />
                {imgUploading && 
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg'>
                <div className='text-white'>Uploading...</div>
                </div>
                }
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
            isLoading
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Food'}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
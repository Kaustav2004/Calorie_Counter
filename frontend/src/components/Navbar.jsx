import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiHome } from 'react-icons/fi';

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Calorie<span className="text-gray-800 dark:text-white">Counter</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </Link> */}
            {/* <Link
              to="/history"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiHistory className="w-5 h-5" />
              <span>History</span>
            </Link> */}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center space-x-8 mt-4 pb-2">
          {/* <Link
            to="/"
            className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link> */}
          {/* <Link
            to="/history"
            className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FiHistory className="w-6 h-6" />
            <span className="text-xs mt-1">History</span>
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
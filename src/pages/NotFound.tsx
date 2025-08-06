import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-900">404</h1>
        <p className="text-base sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block text-blue-500 hover:text-blue-700 underline text-sm sm:text-base lg:text-lg transition-colors duration-200 px-2 py-1"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

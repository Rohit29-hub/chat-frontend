import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      {/* Header Section */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-opensans">Welcome to rowChat</h1>
        <p className="text-lg md:text-xl mb-8">
          Stay connected with your loved ones anytime, anywhere. Experience seamless and secure communication at your fingertips.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
        <Link
          to="/login"
          className="w-full sm:w-auto px-6 py-3 text-center rounded-full bg-white text-blue-500 font-semibold hover:bg-blue-100 shadow-md transition duration-300"
        >
          Login
        </Link>
        <span className="text-xl font-semibold hidden sm:block">OR</span>
        <Link
          to="/register"
          className="w-full sm:w-auto px-6 py-3 text-center rounded-full bg-white text-purple-600 font-semibold hover:bg-purple-100 shadow-md transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;

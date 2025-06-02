import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const First = () => {
  const navigate = useNavigate();

  const navigateToSignup = () => navigate('/signup');
  const navigateToLogin = () => navigate('/login');
  const navigateToDevInfo = () => navigate('/devinfo');

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-center items-center relative overflow-hidden dark:bg-gray-900 dark:text-white">
      
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/bus5.png"
          alt="Bus"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Developer Info */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-6 right-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={navigateToDevInfo}
          className="px-5 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Dev Info
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="text-center px-6 z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Welcome to
          </span>
          <br />
          <span className="text-gray-900 dark:text-white tracking-tight">
            UniBuss
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl mt-4 mb-12 font-light text-gray-600 dark:text-gray-300"
        >
          Your university’s smart and simple way to book campus buses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToLogin}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition duration-300 shadow-md"
          >
            Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToSignup}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-300 shadow-md"
          >
            Sign Up
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10"
      >
        <p className="text-sm text-gray-400 font-light">
          © 2025 UniBuss. All Rights Reserved.
        </p>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/80 dark:from-gray-900/50 dark:to-gray-900/90 z-0" />
    </div>
  );
};

export default First;

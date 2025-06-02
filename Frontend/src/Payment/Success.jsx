import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Success() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative">
        {/* Background Image with overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/bus3.png"
            alt="Bus Success Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-950/90" />
        </motion.div>

        {/* Success Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-extrabold text-green-400 mb-4">
            Seat Booking Confirmed!
          </h1>
          <p className="text-white/90 text-lg font-light mb-6">
            Your seat has been successfully booked. Check your dashboard for more details.
          </p>
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-lg"
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default Success;

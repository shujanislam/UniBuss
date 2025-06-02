import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Map from '../components/Map.jsx';

// Set default axios configuration
axios.defaults.withCredentials = true;

function Home() {
  const [destination, setDestination] = useState("");
  const [searchedDestination, setSearchedDestination] = useState("");  // For updating map route after search
  const [buses, setBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toast) {
      const { type, message } = location.state.toast;
      if (type === "success") {
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = useCallback(async () => {
    try {
      const profileResponse = await axios.get("/api/v1/users/profile");
      if (!profileResponse.data?.user) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }
      const user = profileResponse.data.user;
      setUserProfile(user);
      setIsAdmin(user.role?.toLowerCase() === "admin");

      const busesResponse = await axios.get("/api/v1/bus/getbus");
      if (busesResponse.data.success) {
        setAllBuses(busesResponse.data.buses);
        setBuses(busesResponse.data.buses);
      } else {
        toast.error("Failed to fetch buses");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please login with valid credentials.");
        navigate("/login");
      } else {
        toast.error("Error loading data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error("Please enter a destination to search.");
      return;
    }
    const filteredBuses = allBuses.filter((bus) =>
      bus.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setBuses(filteredBuses);
    if (filteredBuses.length === 0) {
      toast.error(`No buses found for destination: ${destination}`);
    }
    setSearchedDestination(destination);  // Update searchedDestination on search submit
  };

  const handleAddBus = () => {
    if (!isAdmin) {
      toast.error("Access denied. Admin only.");
      return;
    }
    navigate("/addbus", {
      state: { user: userProfile },
      replace: true,
    });
  };

  const handleBusClick = (bus) => {
    if (!userProfile) {
      toast.error("Please login to book seats");
      navigate("/login");
      return;
    }
    const totalSeats = 40;
    const availableSeats = totalSeats - (bus.bookedSeats?.length || 0);
    if (availableSeats <= 0) {
      toast.error("No seats available for this bus.");
      return;
    }
    navigate("/bookseat", {
      state: {
        busId: bus._id,
        seatNumber: availableSeats,
        userId: userProfile._id,
        pickupLocation: userProfile.address || "",
      },
      replace: true,
    });
  };

  const handleProfileClick = () => {
    if (!userProfile) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }
    navigate("/profile", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative overflow-hidden">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <img
          src="/bus1.jpg"
          alt="Bus"
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-0"></div>

      {/* Main container with 95% width */}
      <div className="w-[95vw] max-w-[1400px] flex flex-row gap-8 p-6 z-10 relative">
        {/* Left side: Search + buses */}
        <div className="flex flex-col w-2/5 space-y-8">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Search for Buses
            </h2>
            <form
              onSubmit={handleSearch}
              className="flex flex-col w-full max-w-md mx-auto space-y-4"
            >
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </motion.button>
            </form>
          </motion.div>

          {/* Buses list */}
          {buses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-4 max-h-[70vh] overflow-auto"
            >
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                Available Buses
              </h3>
              <div className="flex flex-col space-y-4">
                {buses.map((bus) => (
                  <motion.div
                    key={bus._id}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBusClick(bus)}
                    className="cursor-pointer bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 hover:bg-white/20 transition duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white mb-2">
                      Bus Number: {bus.busnum}
                    </h4>
                    <div className="space-y-2 text-white/80">
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Seats Available:</span>
                        <span className="ml-2">{40 - (bus.bookedSeats?.length || 0)}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Origin:</span>
                        <span className="ml-2">{bus.origin}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Destination:</span>
                        <span className="ml-2">{bus.destination}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Date:</span>
                        <span className="ml-2">{new Date(bus.date).toLocaleDateString()}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Time:</span>
                        <span className="ml-2">{bus.time}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-24 font-medium">Bus Type:</span>
                        <span className="ml-2">{bus.bustype}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add bus button for admin */}
          {isAdmin && (
            <button
              onClick={handleAddBus}
              className="mt-6 w-full max-w-md mx-auto px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-lg transition duration-300"
            >
              Add New Bus
            </button>
          )}

          {/* Profile button */}
          <button
            onClick={handleProfileClick}
            className="mt-6 w-full max-w-md mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-lg transition duration-300"
          >
            Profile
          </button>
        </div>

        {/* Right side: Map */}
        <div
          className="w-3/5 rounded-xl shadow-xl border border-white/20 overflow-hidden"
          style={{ height: '80vh' }}  // Increased height
        >
          <Map destination={searchedDestination} />
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Home;

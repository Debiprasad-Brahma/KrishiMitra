import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  CloudRain,
  Cloud,
  AlertTriangle,
  CloudSun,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";
import { pestRules } from "../utils/pestRules";
// Replace with your Tomorrow.io API key
const API_KEY = "9GXYmkUlnUvaPYpMfqawJwvQc01JoqWV";

// Dummy queries (can be dynamic later)
const queryHistory = [
  { crop: "Tomato", pestConcern: "Aphids" },
  { crop: "Rice", pestConcern: "Stem Borer" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const alertVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

export default function Weather() {
  const [alerts, setAlerts] = useState([]);
  const [todayWeather, setTodayWeather] = useState(null);
  const [location, setLocation] = useState("Fetching...");

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);

        // Fetch Tomorrow.io weather
        try {
          const res = await fetch(
            `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${API_KEY}`
          );
          const data = await res.json();

          if (data?.data) {
            const values = data.data.values;
            const conditionCode = values.weatherCode;
            const temperature = Math.round(values.temperature);
            const humidity = values.humidity;
            const wind = values.windSpeed;

            // Map weather condition to icon + text
            let condition = "Clear";
            let icon = <Sun size={32} className="text-yellow-400" />;
            if ([1001].includes(conditionCode)) {
              condition = "Cloudy";
              icon = <Cloud size={32} className="text-gray-500" />;
            } else if ([4000, 4201].includes(conditionCode)) {
              condition = "Rainy";
              icon = <CloudRain size={32} className="text-blue-500" />;
            } else if ([1100, 1101].includes(conditionCode)) {
              condition = "Partly Cloudy";
              icon = <CloudSun size={32} className="text-orange-400" />;
            }

            const currentWeather = {
              temp: `${temperature}°C`,
              condition,
              icon,
              humidity,
              wind,
            };

            setTodayWeather(currentWeather);

            // Generate pest alerts
            const generatedAlerts = queryHistory.map((q) => {
              let severity = "Low";
              let weatherIcon = icon;

              if (q.pestConcern === "Aphids" && condition === "Rainy") {
                severity = "High";
              } else if (q.pestConcern === "Stem Borer" && temperature > 28) {
                severity = "Medium";
              }

              let precaution = "";
              if (q.pestConcern === "Aphids")
                precaution = "Use neem spray and remove affected leaves.";
              if (q.pestConcern === "Stem Borer")
                precaution = "Apply biopesticides and maintain water levels.";

              return {
                pest: q.pestConcern,
                crop: q.crop,
                severity,
                precaution,
                weatherIcon,
                weather: condition,
              };
            });

            setAlerts(generatedAlerts);
          }
        } catch (err) {
          console.error("Weather API error:", err);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocation("Location not available");
      }
    );
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "from-red-400 to-red-600";
      case "Medium":
        return "from-orange-400 to-orange-600";
      default:
        return "from-green-400 to-green-600";
    }
  };

  const getSeverityBorder = (severity) => {
    switch (severity) {
      case "High":
        return "border-red-300";
      case "Medium":
        return "border-orange-300";
      default:
        return "border-green-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <motion.div className="max-w-6xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            🌦 Weather & Pest Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Real-time weather insights and intelligent pest alerts for your farm</p>
        </motion.div>

        {/* Today's Weather Card */}
        {todayWeather && (
          <motion.div className="mb-12" variants={cardVariants}>
            <motion.div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-200 overflow-hidden" whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/30 to-transparent rounded-full -ml-12 -mb-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-blue-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">Today's Weather</h2>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{location}</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <motion.div className="flex justify-center" animate={floatingAnimation}>
                    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">{todayWeather.icon}</div>
                  </motion.div>

                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <Thermometer className="text-red-500" size={20} />
                      <span className="text-4xl font-bold text-gray-800">{todayWeather.temp}</span>
                    </div>
                    <p className="text-xl text-gray-600 capitalize">{todayWeather.condition}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Droplets size={16} />
                      <span className="text-sm">Humidity: {todayWeather.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Wind size={16} />
                      <span className="text-sm">Wind: {todayWeather.wind} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Pest Alerts Section */}
        <motion.div variants={cardVariants}>
          <motion.div className="flex items-center space-x-3 mb-8" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <AlertTriangle size={32} className="text-red-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">Pest Alerts</h2>
          </motion.div>

          <AnimatePresence>
            <div className="grid md:grid-cols-2 gap-6">
              {alerts.map((alert, idx) => (
                <motion.div key={idx} variants={alertVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 + idx * 0.1 }} whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }} className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 ${getSeverityBorder(alert.severity)} overflow-hidden group`}>
                  {/* Severity indicator */}
                  <motion.div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${getSeverityColor(alert.severity)}`} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8 + idx * 0.1, duration: 0.8 }} />

                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${getSeverityColor(alert.severity)} opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{alert.pest}</h3>
                        <p className="text-sm text-gray-600">
                          Crop: <span className="font-semibold text-green-600">{alert.crop}</span>
                        </p>
                      </div>

                      <motion.div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getSeverityColor(alert.severity)}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + idx * 0.1, type: "spring", stiffness: 500 }}>
                        {alert.severity}
                      </motion.div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-gray-600 text-sm">Weather Impact:</span>
                      {alert.weatherIcon}
                      <span className="text-sm text-gray-700">({alert.weather})</span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Recommended Action</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{alert.precaution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

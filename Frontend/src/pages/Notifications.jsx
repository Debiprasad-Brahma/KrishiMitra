import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const API_KEY = "9GXYmkUlnUvaPYpMfqawJwvQc01JoqWV";
  useEffect(() => {
    const fetchFutureWeather = async () => {
      try {
        // 1. Get current location
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = pos.coords;

        // 2. Tomorrow.io Timelines API (next 3 days)
        const res = await fetch(
          `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,precipitationProbability,weatherCode&timesteps=1d&units=metric&apikey=${API_KEY}`
        );
        const data = await res.json();

        // 3. Parse forecast into notifications
        const forecast =
          data?.data?.timelines[0]?.intervals?.map((interval) => {
            const date = new Date(interval.startTime).toDateString();
            const temp = interval.values.temperature;
            const rainProb = interval.values.precipitationProbability;

            let msg = `Expected ${temp}°C with ${rainProb}% rain chance.`;
            if (rainProb > 70) msg = `⚠️ Heavy rain expected. ${msg}`;
            else if (temp > 35) msg = `🔥 Heat alert! ${msg}`;
            else if (temp < 10) msg = `❄️ Cold wave possible. ${msg}`;

            return {
              title: `Forecast for ${date}`,
              msg,
            };
          }) || [];

        setNotifications(forecast);
      } catch (err) {
        console.error("Failed to fetch forecast:", err);
      }
    };

    fetchFutureWeather();
  }, []);

  return (
    <div className="feature-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Weather Notifications</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notifications.length > 0 ? (
          notifications.map((n, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer border-l-4 border-blue-500"
            >
              <h3 className="text-lg font-semibold text-blue-600">{n.title}</h3>
              <p className="text-gray-700 mt-2">{n.msg}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">Loading future weather...</p>
        )}
      </div>
    </div>
  );
}

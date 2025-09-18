import { useState } from "react";
import { motion } from "framer-motion";

// Replace with your API key & base URL
const AGRIO_BASE = "https://api.agrio.app";  // example; verify
const AGRIO_KEY = "YOUR_AGRIO_API_KEY";

async function fetchAlertsFromAgrio(crop) {
  // Example endpoint: pest/disease predictions for crop + maybe location
  // This is hypothetical; check documentation for actual path + parameters
  const resp = await fetch(
    `${AGRIO_BASE}/v1/pest-alerts?crop=${encodeURIComponent(crop)}`,
    {
      headers: {
        "Authorization": `Bearer ${AGRIO_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`API error: ${resp.status} - ${msg}`);
  }
  const data = await resp.json();
  // Let’s assume it returns something like:
  // { alerts: [ { pest: string, severity: string, description: string } ] }
  return data.alerts;
}

export default function PestAlertsWithAPI() {
  const [crop, setCrop] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const severityColors = {
    High: "bg-red-500 text-white",
    Medium: "bg-yellow-400 text-black",
    Low: "bg-green-500 text-white",
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!crop) {
      setError("Please enter a crop name");
      return;
    }
    setLoading(true);
    setError("");
    setAlerts([]);

    try {
      const result = await fetchAlertsFromAgrio(crop);
      if (!result || result.length === 0) {
        setError("No alerts found for this crop");
      } else {
        setAlerts(result);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching alerts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 p-6">
      <motion.h2
        className="text-3xl font-bold text-green-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🌿 Crop Pest & Disease Alerts
      </motion.h2>

      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center gap-3 mb-8 max-w-xl mx-auto"
      >
        <input
          type="text"
          placeholder="Enter crop (e.g. Tomato, Rice)"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Get Alerts
        </button>
      </form>

      {loading && (
        <div className="text-center text-green-700 font-medium">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {alerts.map((a, idx) => (
          <motion.div
            key={idx}
            className="rounded-2xl shadow-lg bg-white p-6 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🐛 {a.pest}</h3>
            <p className="text-gray-600 mb-2">
              Severity:{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColors[a.severity]}`}
              >
                {a.severity}
              </span>
            </p>
            {a.description && (
              <p className="text-gray-600">{a.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

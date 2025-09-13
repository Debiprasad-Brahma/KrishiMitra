import "./Weather.css";
import { Sun, CloudRain, Cloud, AlertTriangle } from "lucide-react";

export default function Weather() {
  const dummyWeather = [
    { day: "Monday", temp: "32°C", condition: "Sunny", icon: <Sun size={32} color="#facc15" /> },
    { day: "Tuesday", temp: "30°C", condition: "Cloudy", icon: <Cloud size={32} color="#6b7280" /> },
    { day: "Wednesday", temp: "31°C", condition: "Rainy", icon: <CloudRain size={32} color="#3b82f6" /> },
  ];

  const alerts = [
    { type: "Rainfall Alert", message: "Heavy rain expected on Wednesday. Cover stored grains." },
    { type: "Pest Alert", message: "Locust activity detected in nearby regions. Monitor your crops." },
  ];

  return (
    <div className="feature-screen">
      <h2>🌦 Weather & Alerts</h2>
      
      <div className="cards-container">
        {dummyWeather.map((w) => (
          <div key={w.day} className="weather-card">
            <div className="weather-icon">{w.icon}</div>
            <h3>{w.day}</h3>
            <p className="temp">{w.temp}</p>
            <p className="condition">{w.condition}</p>
          </div>
        ))}
      </div>

      <div className="alerts-section">
        <h3><AlertTriangle size={20} color="#dc2626" /> Alerts</h3>
        <ul>
          {alerts.map((a, i) => (
            <li key={i} className="alert-item">
              <strong>{a.type}:</strong> {a.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

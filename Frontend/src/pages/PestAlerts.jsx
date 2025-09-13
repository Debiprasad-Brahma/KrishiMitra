import "./PestAlerts.css";

export default function PestAlerts() {
  const alerts = [
    { pest: "Aphids", crop: "Tomato", severity: "High" },
    { pest: "Stem Borer", crop: "Rice", severity: "Medium" },
  ];

  return (
    <div className="feature-screen">
      <h2>Pest Alerts</h2>
      <div className="cards-container">
        {alerts.map((a, idx) => (
          <div key={idx} className="pest-card">
            <h3>{a.pest}</h3>
            <p>Crop: {a.crop}</p>
            <p>Severity: {a.severity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

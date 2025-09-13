import "./Notifications.css";

export default function Notifications() {
  const notifications = [
    { title: "Subsidy Update", msg: "Apply for crop subsidy before 30th Sep" },
    { title: "Weather Alert", msg: "Heavy rains expected tomorrow" },
  ];

  return (
    <div className="feature-screen">
      <h2>Notifications</h2>
      <div className="cards-container">
        {notifications.map((n, idx) => (
          <div key={idx} className="notification-card">
            <h3>{n.title}</h3>
            <p>{n.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

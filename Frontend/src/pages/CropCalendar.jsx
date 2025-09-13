import "./CropCalendar.css";

export default function CropCalendar() {
  const crops = [
    { name: "Rice", season: "June - September" },
    { name: "Wheat", season: "November - March" },
    { name: "Tomato", season: "September - December" },
  ];

  return (
    <div className="feature-screen">
      <h2>Crop Calendar</h2>
      <div className="cards-container">
        {crops.map((crop) => (
          <div key={crop.name} className="calendar-card">
            <h3>{crop.name}</h3>
            <p>{crop.season}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

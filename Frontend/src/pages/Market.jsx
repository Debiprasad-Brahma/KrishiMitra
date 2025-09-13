import "./Market.css";

export default function Market() {
  const dummyMarket = [
    { crop: "Tomato", price: "₹25/kg" },
    { crop: "Potato", price: "₹20/kg" },
    { crop: "Rice", price: "₹50/kg" },
  ];

  return (
    <div className="feature-screen">
      <h2>Market Prices</h2>
      <div className="cards-container">
        {dummyMarket.map((item) => (
          <div key={item.crop} className="market-card">
            <h3>{item.crop}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

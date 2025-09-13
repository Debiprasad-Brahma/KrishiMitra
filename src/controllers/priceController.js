export const getPrices = async (req, res) => {
  res.json([
    { crop: "Rice", price: 25 },
    { crop: "Wheat", price: 30 },
    { crop: "Potato", price: 15 },
  ]);
};

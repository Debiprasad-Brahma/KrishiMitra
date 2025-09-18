export const getWeather = async (req, res) => {
  res.json({
    location: "Odisha",
    temperature: "32°C",
    condition: "Sunny",
    humidity: "60%",
  });
};

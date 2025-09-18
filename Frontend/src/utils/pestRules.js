// Mapping weather codes (Tomorrow.io) to human-friendly conditions
// Ref: https://docs.tomorrow.io/reference/data-layers-weather-codes
const weatherMap = {
  1000: "Clear",
  1001: "Cloudy",
  1100: "Mostly Clear",
  1101: "Partly Cloudy",
  1102: "Mostly Cloudy",
  2000: "Fog",
  2100: "Light Fog",
  4000: "Drizzle",
  4001: "Rain",
  4200: "Light Rain",
  4201: "Heavy Rain",
  5000: "Snow",
  5100: "Light Snow",
  6000: "Freezing Drizzle",
  6001: "Freezing Rain",
  6200: "Light Freezing Rain",
  6201: "Heavy Freezing Rain",
};

// Pest rules
export const pestRules = [
  {
    crop: "Tomato",
    pest: "Aphids",
    condition: (weather, temp, humidity) =>
      (weather === "Rain" || weather === "Cloudy") && humidity > 70,
    severity: "High",
    precaution: "Use neem spray, remove affected leaves, and avoid excess nitrogen fertilizer."
  },
  {
    crop: "Tomato",
    pest: "Whiteflies",
    condition: (weather, temp) => temp > 25 && weather === "Clear",
    severity: "Medium",
    precaution: "Introduce natural predators (ladybugs), use sticky traps, and mulch soil."
  },
  {
    crop: "Rice",
    pest: "Stem Borer",
    condition: (weather, temp) => temp > 28 && weather === "Clear",
    severity: "Medium",
    precaution: "Maintain water levels, apply biopesticides, and encourage natural predators."
  },
  {
    crop: "Rice",
    pest: "Leaf Folder",
    condition: (weather, humidity) => humidity > 75 && weather === "Cloudy",
    severity: "High",
    precaution: "Apply neem oil or Bt sprays; avoid excessive urea application."
  },
  {
    crop: "Wheat",
    pest: "Rust Fungus",
    condition: (weather, temp, humidity) =>
      weather === "Rain" && temp < 20 && humidity > 80,
    severity: "High",
    precaution: "Use resistant varieties, spray fungicides if outbreak occurs."
  },
];

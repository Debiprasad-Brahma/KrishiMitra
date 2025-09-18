// src/components/CropCalendar.jsx
import React, { useState } from "react";
import { cropCalendar } from "../hooks/cropCalendarData.js";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, ChevronUp, Leaf, Sun, Droplet, Layers } from "lucide-react";

export default function CropCalendar() {
  const defaultState = "Odisha";

  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [language, setLanguage] = useState(
    cropCalendar[defaultState]?.language === "Odia" ? "or" : "ml"
  );
  const [expandedIndex, setExpandedIndex] = useState(null); // Only one card at a time

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedSeason("");
    setLanguage(cropCalendar[state]?.language === "Odia" ? "or" : "ml");
    setExpandedIndex(null); // collapse any open card
  };

const toggleExpand = (index) => {
  setExpandedIndex(expandedIndex === index ? null : index);
};

  const seasons = ["Kharif", "Rabi", "Zaid"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-900 mb-8 text-center drop-shadow-lg">
          🌱 Smart Crop Calendar
        </h1>

        {/* State Selector */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-green-800">
            Select State:
          </label>
          <select
            className="w-full p-3 rounded-xl border border-green-300 shadow focus:ring-2 focus:ring-green-400 transition"
            value={selectedState}
            onChange={handleStateChange}
          >
            {Object.keys(cropCalendar).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Season Selector */}
        {selectedState && (
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-2 text-green-800">
              Select Season:
            </label>
            <div className="flex flex-wrap gap-4">
              {seasons.map((season) => (
                <button
                  key={season}
                  className={`px-5 py-2 rounded-2xl font-semibold border transition-all duration-300 shadow-sm ${
                    selectedSeason === season
                      ? "bg-green-500 text-white border-green-500 shadow-lg"
                      : "bg-white text-green-700 border-green-300 hover:bg-green-100 hover:scale-105"
                  }`}
                  onClick={() => setSelectedSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Crop Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {selectedState &&
              selectedSeason &&
              cropCalendar[selectedState][selectedSeason]?.map((crop, idx) => (
                <motion.div
                  key={`${crop.name.en}-${idx}`} // unique key
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden cursor-pointer hover:scale-105 transform transition-all"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-200 to-yellow-200"
                    onClick={() => toggleExpand(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <Leaf className="w-6 h-6 text-green-700" />
                      <h2 className="text-xl font-bold text-green-800">
                        {crop.name[language]} ({crop.name.en})
                      </h2>
                    </div>
                    {expandedIndex === idx ? (
                      <ChevronUp className="w-5 h-5 text-green-700" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-green-700" />
                    )}
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence initial={false}>
  {expandedIndex === idx && (
    <motion.div
      key={`${crop.name.en}-${idx}`}

      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="p-4 bg-green-50 space-y-2"
    >
      <p className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold">Sowing:</span> {crop.sowing[language]}
      </p>
      <p className="flex items-center gap-2">
        <Droplet className="w-4 h-4 text-blue-400" />
        <span className="font-semibold">Harvesting:</span> {crop.harvesting[language]}
      </p>
      <p className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-green-500" />
        <span className="font-semibold">Climate:</span> {crop.climate[language]}
      </p>
      <p className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-yellow-700" />
        <span className="font-semibold">Soil:</span> {crop.soil[language]}
      </p>
      <p className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-700" />
        <span className="font-semibold">Uses:</span> {crop.uses[language]}
      </p>
    </motion.div>
  )}
</AnimatePresence>

                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

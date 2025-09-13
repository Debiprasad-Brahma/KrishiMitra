import { useState } from "react";
import { AlertTriangle, Loader, Send } from "lucide-react";

export default function Escalation() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    crop: "",
    issue: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-yellow-100 p-6">
      <div className="max-w-2xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-green-800 flex items-center justify-center gap-2">
            <AlertTriangle className="text-yellow-600" />
            Escalate Query
          </h1>
          <p className="text-gray-600 mt-2">
            If the AI response was unclear, escalate to your local agriculture officer.
          </p>
        </div>

        {/* Escalation Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 shadow-lg rounded-2xl p-6 border border-green-200 space-y-4 animate-slideUp"
          >
            <div>
              <label className="block font-medium text-green-800 mb-1">
                Farmer Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg border-2 border-green-200 focus:border-green-600 outline-none bg-yellow-50"
              />
            </div>

            <div>
              <label className="block font-medium text-green-800 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Village / District"
                className="w-full p-3 rounded-lg border-2 border-green-200 focus:border-green-600 outline-none bg-yellow-50"
              />
            </div>

            <div>
              <label className="block font-medium text-green-800 mb-1">
                Crop Concerned
              </label>
              <input
                type="text"
                name="crop"
                value={form.crop}
                onChange={handleChange}
                required
                placeholder="Eg: Paddy, Banana, Coconut"
                className="w-full p-3 rounded-lg border-2 border-green-200 focus:border-green-600 outline-none bg-yellow-50"
              />
            </div>

            <div>
              <label className="block font-medium text-green-800 mb-1">
                Issue Description
              </label>
              <textarea
                name="issue"
                value={form.issue}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your farming issue..."
                className="w-full p-3 rounded-lg border-2 border-green-200 focus:border-green-600 outline-none bg-yellow-50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} /> Sending...
                </>
              ) : (
                <>
                  <Send size={20} /> Submit to Officer
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center animate-fadeInSlow shadow-inner">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              ✅ Escalation Submitted
            </h2>
            <p className="text-gray-700">
              Your issue has been forwarded to the nearest Krishi Bhavan officer.
              You will receive a response soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

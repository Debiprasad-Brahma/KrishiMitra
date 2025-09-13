import Splash from "./pages/Splash";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Language from "./pages/Language";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuerySubmission from "./components/QuerySubmission/QuerySubmission";
import Results from "./pages/Results";
import Weather from "./pages/Weather";
import Market from "./pages/Market";
import CropCalendar from "./pages/CropCalendar";
import PestAlerts from "./pages/PestAlerts";
import Notifications from "./pages/Notifications";
import Escalation from "./pages/Escalation";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/language" element={<Language />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/query" element={<QuerySubmission />} />
        <Route path="/results" element={<Results />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<Market />} />
        <Route path="/calendar" element={<CropCalendar />} />
        <Route path="/pest" element={<PestAlerts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/escalation" element={<Escalation />} />
      </Routes>
    </BrowserRouter>
  );
}
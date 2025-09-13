import { useNavigate } from "react-router-dom";
import "./Language.css";

export default function LanguageSelection() {
  const navigate = useNavigate();

  const selectLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    navigate("/dashboard");
  };

  return (
    <div className="lang-screen">
      <h2>Select Language</h2>
      <div className="lang-buttons">
        <button className="lang-btn" onClick={() => selectLanguage("ml")}>
          മലയാളം
        </button>
        <button className="lang-btn" onClick={() => selectLanguage("en")}>
          English
        </button>
        <button className="lang-btn" onClick={() => selectLanguage("hi")}>
          हिंदी
        </button>
        <button className="lang-btn" onClick={() => selectLanguage("or")}>
          ଓଡ଼ିଆ
        </button>
      </div>
    </div>
  );
}

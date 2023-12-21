import { useModal } from "../../context/Modal";
import { useState, useEffect } from "react";
import { IoColorWandOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { PiSunBold, PiMoonBold } from "react-icons/pi";
import "./PreferenceFormModal.css";

export default function PreferenceFormModal() {
  const { closeModal } = useModal();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Restore user's previous theme selection, if it exists
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  return (
    <>
      <div className="preference-modal">
        <div className="preference-container">
          <h2>Preference</h2>
          <button onClick={closeModal}>
            <VscChromeClose />
          </button>
        </div>
        <div className="preference-container">
          <div className="preference-left">
            <p>
              <IoColorWandOutline />
              &nbsp;Themes
            </p>
          </div>
          <div className="preference-right">
            <p style={{ fontWeight: "bold" }}>Color Mode</p>
            <p>
              Choose if PixcelChat&rsquo;s appearance should be light or dark,
              or follow your computer&rsquo;s settings.
            </p>
            <div className="theme-option">
              <button
                className={`theme-light ${theme === "light" ? "selected" : ""}`}
                onClick={() => handleThemeChange("light")}
              >
                <PiSunBold />
                &nbsp;&nbsp;&nbsp;Light
              </button>
              <button
                className={`theme-dark ${theme === "dark" ? "selected" : ""}`}
                onClick={() => handleThemeChange("dark")}
              >
                <PiMoonBold />
                &nbsp;&nbsp;&nbsp;Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

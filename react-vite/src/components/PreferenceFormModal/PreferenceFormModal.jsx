import { useModal } from "../../context/Modal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { IoColorWandOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { PiSunBold, PiMoonBold } from "react-icons/pi";
import { setTheme } from "../../redux/session";
import "./PreferenceFormModal.css";

export default function PreferenceFormModal() {
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const { closeModal } = useModal();
  // const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      dispatch(setTheme(storedTheme))
    }
  }, []);


  const handleThemeChange = (selectedTheme) => {
    dispatch(setTheme(selectedTheme));
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.className = `theme-${selectedTheme}`;
  };

  return (
    <>
      <div className="preference-modal">
        <div className="preference-container-top">
          <h2>Preferences</h2>
          <button onClick={closeModal}>
            <VscChromeClose />
          </button>
        </div>
        <div className="preference-container-bottom">
          <div className="preference-left">
            <p>
              <IoColorWandOutline />
              &nbsp;Themes
            </p>
          </div>
          <div className="preference-right">
            <p style={{ fontWeight: "bold" }}>Color Mode</p>
            <p>
              Set PixelChat&rsquo;s appearance to light or dark mode.
            </p>
            <div className="theme-option">
              <button onClick={() => handleThemeChange("light")}
              >
                <PiSunBold />
                &nbsp;&nbsp;&nbsp;Light
              </button>
              <button
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

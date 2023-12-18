import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <NavLink to="/">
      <img
        src="https://svgshare.com/i/10wP.svg"
        alt="Logo"
        style={{ width: "100px" }}
      />
    </NavLink>
  );
}

export default Navigation;

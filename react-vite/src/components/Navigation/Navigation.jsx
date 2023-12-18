import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    // <ul>
    //   <li>
        <NavLink exact to="/">
          <img
            src="https://svgshare.com/i/10wP.svg"
            alt="Logo"
            style={{ width: "100px" }}
          />
        </NavLink>
    //   </li>

    //   <li>
    //     <ProfileButton />
    //   </li>
    // </ul>
  );
}

export default Navigation;

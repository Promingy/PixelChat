import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../redux/session";
import { NavLink } from "react-router-dom";
import ProfileModal from "../ProfileModal";
import PreferenceFormModal from "../PreferenceFormModal/preferenceFormModal";
import "./OuterNavbar.css";

export default function OuterNavbar() {
  const sessionUser = useSelector((state) => state.session.user);
  // const server = useSelector((state) => state.server)

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="outer-navbar-wrapper">
      <div className="outer-navbar-top">
        {Object.values(sessionUser.servers).map((server) => (
          <Link to={`/main/servers/${server.id}`} key={server.id}>
            <div className="server-img-wrapper">
              <img src={server.image_url} />
            </div>
          </Link>
        ))}
      </div>
      <div className="outer-navbar-bottom">
        <Link to="/new-server">
          <div className="create-new-server">
            <i className="fa-solid fa-plus"></i>
          </div>
        </Link>
        <div className="open-profile-wrapper">
          {/* <OpenModalButton buttonText={<img src={sessionUser.image_url} />} modalComponent={<ProfileModal />} /> */}
          <button className="icon-button" onClick={toggleMenu}>
            <img src={sessionUser.image_url} />
          </button>
        </div>
        <div className={ulClassName} ref={ulRef}>
          <OpenModalButton
            buttonText="Profile"
            onItemClick={closeMenu}
            modalComponent={<ProfileModal />}
          />
          <OpenModalButton
            buttonText="Preference"
            onItemClick={closeMenu}
            modalComponent={<PreferenceFormModal />}
          />
           <button onClick={logout} >
                <NavLink to="/" style={{ textDecoration: "none" }}>
                  Log out
                </NavLink>
              </button>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../redux/session";
import { NavLink } from "react-router-dom";
import PreferenceFormModal from "../PreferenceFormModal/PreferenceFormModal";
import ChannelCreationForm from "../ChannelCreationForm";
import "./OuterNavbar.css";
import { loadServer } from "../../redux/server";

export default function OuterNavbar({ socket, showNavBar, openUserModal }) {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { serverId } = useParams()
  const [showMenu1, setShowMenu1] = useState(false);
  const [showMenu2, setShowMenu2] = useState(false);
  const ulClassName1 = showMenu1 ? "" : " hidden";
  const ulClassName2 = showMenu2 ? "" : " hidden";
  const ulRef = useRef();

  document.documentElement.className = `theme-${localStorage.getItem("theme") || "light"
    }`;

  const toggleMenu1 = (e) => {
    e.stopPropagation();
    setShowMenu1(!showMenu1);
    setShowMenu2(false);
  };

  useEffect(() => {
    if (!showMenu1) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu1(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu1]);

  const closeMenu1 = () => setShowMenu1(false);

  const toggleMenu2 = (e) => {
    e.stopPropagation();
    setShowMenu2(!showMenu1);
    setShowMenu1(false);
  };

  useEffect(() => {
    if (!showMenu2) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu2(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu2]);

  const closeMenu2 = () => setShowMenu2(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    navigate("/");
  };

  const navigateToServer = async (serverId) => {
    const server = await dispatch(loadServer(serverId, sessionUser.id));
    const channelId = Object.values(server.channels)[0].id;
    return navigate(`/main/servers/${serverId}/channels/${channelId}`);
  };

  return (
    <div className={`outer-navbar-wrapper${showNavBar ? ' do-show' : ''}`}>
      <div className="outer-navbar-top">
        {Object.values(sessionUser.servers).map((server) => (
          <div onClick={() => navigateToServer(server.id)} key={server.id}>
            <div className={`server-img-wrapper${server.id == serverId ? ' selected-server' : ''}`}>
              <img src={server.image_url} title={server?.name} />
            </div>
          </div>
        ))}
        <Link to="/landing" className="home-link-wrapper">
          <div className="home-icon-wrapper">
            <i className="fa-solid fa-house"></i>
          </div>
          Home
        </Link>
      </div>
      <div className="outer-navbar-bottom">
        <div className="new-button-wrapper">
          <button onClick={toggleMenu1}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <div className={`server-dropdown ${ulClassName1}`} ref={ulRef}>
            <NavLink to="/join-server">Join a Server</NavLink>
            <NavLink to="/new-server">Create a Server</NavLink>
            <div className="outer-navbar-popup-divider" />
            <OpenModalButton
              buttonText="Create a Channel"
              onItemClick={closeMenu1}
              modalComponent={<ChannelCreationForm socket={socket} />}
            />
          </div>
        </div>
        <div className="open-profile-wrapper">
          <button className="icon-button" onClick={toggleMenu2}>
            <img className="profile-button-img" src={sessionUser.image_url} />
          </button>
        </div>
        <div className={`profile-dropdown ${ulClassName2} `} ref={ulRef}>
          <button
            onClick={() => {
              openUserModal(sessionUser.id)
            }}
          >
            Profile
          </button>

          <OpenModalButton
            buttonText="Preferences"
            onItemClick={closeMenu2}
            modalComponent={<PreferenceFormModal />}
          />
          <div className="outer-navbar-popup-divider" />

          <button className="outer-navbar-logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

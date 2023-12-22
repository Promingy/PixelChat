import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../redux/session";
import { NavLink } from "react-router-dom";
import ProfileModal from "../ProfileModal";
import PreferenceFormModal from "../PreferenceFormModal/PreferenceFormModal";
import ChannelCreationForm from "../ChannelCreationForm";
import "./OuterNavbar.css";
import { loadServer } from "../../redux/server";

export default function OuterNavbar() {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [showMenu1, setShowMenu1] = useState(false);
  const [showMenu2, setShowMenu2] = useState(false);
  const ulClassName1 = showMenu1 ? "" : " hidden";
  const ulClassName2 = showMenu2 ? "" : " hidden";
  const ulRef = useRef();

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
  };

  const navigateToServer = async (serverId) => {
    console.log(serverId);
    const preloadServer = async (servId) => {
      const serv = await dispatch(loadServer(servId));
      return serv;
    };
    const server = await preloadServer(serverId);
    const channelId = Object.values(server.channels)[0].id;
    return navigate(`/main/servers/${server.id}/channels/${channelId}`);
  };

  return (
    <div className="outer-navbar-wrapper">
      <div className="outer-navbar-top">
        {Object.values(sessionUser.servers).map((server) => (
          <div onClick={() => navigateToServer(server.id)} key={server.id}>
            <div className="server-img-wrapper">
              <img src={server.image_url} title={server.name} />
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
        <div className="create-new-server">
          <button onClick={toggleMenu1}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <div className={`server-dropdown ${ulClassName1}`} ref={ulRef}>
            <button>
              <NavLink
                to="/join-server"
                style={{ textDecoration: "none", color: "black" }}
              >
                Join a Server
              </NavLink>
            </button>
            <button>
              <NavLink
                to="/new-server"
                style={{ textDecoration: "none", color: "black" }}
              >
                Create a Server
              </NavLink>
            </button>
            <OpenModalButton
              buttonText="Create a Channel"
              onItemClick={closeMenu1}
              modalComponent={<ChannelCreationForm />}
            />
          </div>
        </div>
        <div className="open-profile-wrapper">
          <button className="icon-button" onClick={toggleMenu2}>
            <img className="profile-button-img" src={sessionUser.image_url} />
          </button>
        </div>
        <div className={`profile-dropdown ${ulClassName2}`} ref={ulRef}>
          <OpenModalButton
            buttonText="Profile"
            onItemClick={closeMenu2}
            modalComponent={<ProfileModal />}
          />
          <OpenModalButton
            buttonText="Preference"
            onItemClick={closeMenu2}
            modalComponent={<PreferenceFormModal />}
          />
          <button onClick={logout}>
            <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
              Log out
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}

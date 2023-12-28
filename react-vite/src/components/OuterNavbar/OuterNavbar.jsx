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
  const [profileModal, setProfileModal] = useState(false)
  const [profileModal2, setProfileModal2] = useState(false)
  const ulClassName1 = showMenu1 ? "" : " hidden";
  const ulClassName2 = showMenu2 ? "" : " hidden";
  const [theme, setTheme] = useState("light");
  const ulRef = useRef();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  document.documentElement.className = `theme-${theme}`;

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
    navigate('/')
  };

  const navigateToServer = async (serverId) => {
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
        <div className="new-button-wrapper">
          <button onClick={toggleMenu1}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <div className={`server-dropdown ${ulClassName1}`} ref={ulRef}>
            <NavLink to="/join-server">
              Join a Server
            </NavLink>
            <NavLink
              to="/new-server"
            >
              Create a Server
            </NavLink>
            <div className="outer-navbar-popup-divider" />
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
        {profileModal && <ProfileModal animation={false} />}
        {profileModal2 && <ProfileModal animation={true} />}
        <div className={`profile-dropdown ${ulClassName2}`} ref={ulRef}>


          <button onClick={() => {
            setProfileModal(true)
            closeMenu2()

            function handleMouseClick(e) {
              e.preventDefault()
              const profile = document.getElementsByClassName('profile-modal')
              const xBtn = document.getElementsByClassName('close-profile')
              let node = e.target

              for (let i = 0; i <= 6; i++) {
                if (node === profile[0]) return

                else if (node === xBtn[0]) break

                else node = node.parentNode
              }
              setProfileModal2(true)
              setProfileModal(false)
              setTimeout(() => setProfileModal2(false), 350)
              window.removeEventListener('mousedown', handleMouseClick)
            }
            window.addEventListener('mousedown', handleMouseClick)
          }}>Profile</button>

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

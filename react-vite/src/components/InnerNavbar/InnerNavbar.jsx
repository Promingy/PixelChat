import { Link, useParams } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useDispatch, useSelector } from 'react-redux'
import { unboldChannel } from "../../redux/server"
import { useState, useEffect, useRef } from "react";
import ChannelCreationForm from '../ChannelCreationForm'
import ServerPopupModal from "../ServerPopupModal/ServerPopupModal"
import "./InnerNavbar.css"

export default function InnerNavbar({ socket, boldObj, setBoldObj }) {
    const { channelId } = useParams()
    const dispatch = useDispatch()
    const server = useSelector((state) => state.server)
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const ulClassName = "channel-dropdown" + (showMenu ? "" : " hidden");
    const [theme, setTheme] = useState("light");

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

    const unboldChannelStorage = (channelId) => {
        const newObj = { ...boldObj }
        newObj[channelId] = 0
        setBoldObj(newObj)
        const newJSON = JSON.stringify(newObj)
        localStorage.setItem("boldValues", newJSON)
    }

    const closeMenu = () => setShowMenu(false);


    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    const handleChannelUnbold = (channelId) => {
        dispatch(unboldChannel(channelId))
        const storedBoldValues = localStorage.getItem("boldValues")
        const storedBoldValuesObj = JSON.parse(storedBoldValues)
        storedBoldValuesObj[channelId] = 0
        const storedBoldValuesJSON = JSON.stringify(storedBoldValuesObj)
        localStorage.setItem("boldValues", storedBoldValuesJSON)
    }

    document.documentElement.className = `theme-${theme}`;

    if (!server.channels) return null
    return (

        <div className="inner-navbar-wrapper">
            <div className="inner-navbar-header">
                <OpenModalButton modalComponent={<ServerPopupModal socket={socket} />} buttonText={<p>{server.name} <i className="fa-solid fa-chevron-down"></i></p>} />
            </div>
            <ul className="inner-navbar-content">
                <div className="creat-channel-container">
                    <button onClick={toggleMenu}> <i className={showMenu ? `fa-solid fa-caret-down` : `fa-solid fa-caret-right`}></i>&nbsp;&nbsp;&nbsp;&nbsp;Channels</button>
                </div>
                <div className={ulClassName} ref={ulRef}>
                    <OpenModalButton
                        buttonText="Create"
                        onItemClick={closeMenu}
                        modalComponent={<ChannelCreationForm />}
                    />
                </div>
                {Object.values(server.channels).map((channel) => (
                    <li id={`channel${channel.id}`} key={channel.id} onClick={() => handleChannelUnbold(channel.id)} className={`${channel.id == channelId ? ' selected-channel' : 'not-selected-channel'}${channel?.bold ? " bold-channel" : ""}`}>
                        <Link to={`/main/servers/${server.id}/channels/${channel.id}`} className="inner-navbar-link">
                            <div className="navbar-content">
                                <div className="navbar-content-left">
                                    <i className="fa-solid fa-hashtag"></i>{channel.name}
                                </div>
                                {channel?.bold ? <div className="unread-message-count">{channel?.bold}</div> : ""}
                            </div>
                        </Link>
                    </li>
                ))}

            </ul>
        </div>
    )
}

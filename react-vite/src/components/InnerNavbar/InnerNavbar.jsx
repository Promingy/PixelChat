import { Link, useParams, useNavigate  } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useDispatch, useSelector } from 'react-redux'
import { unboldChannel, unboldDirectRoom } from "../../redux/server"
import { useState, useEffect, useRef } from "react";
import ChannelCreationForm from '../ChannelCreationForm'
import ServerPopupModal from "../ServerPopupModal/ServerPopupModal"
import "./InnerNavbar.css"

export default function InnerNavbar({ socket, showNavBar, type }) {
    const { channelId } = useParams()
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const server = useSelector((state) => state.server)
    const users = server?.users
    const [showMenu, setShowMenu] = useState(true);
    const [showMenu2, setShowMenu2] = useState(true);
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const ulRef = useRef();
    const ulClassName = "channel-dropdown" + (showPlusMenu ? "" : " hidden");
    const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark')
    const navigate = useNavigate()

    useEffect(() => {
        setTheme(localStorage.getItem('theme') === 'dark')
    }, [setTheme])

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    const toggleMenu2 = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu2(!showMenu2);
    };

    const togglePlusMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu

        setShowPlusMenu(!showPlusMenu);
    };

    useEffect(() => {
        if (!showPlusMenu) return;

        const closePlusMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowPlusMenu(false);
            }
        };

        document.addEventListener("click", closePlusMenu);

        return () => document.removeEventListener("click", closePlusMenu);
    }, [showMenu, showPlusMenu]);


    const closePlusMenu = () => setShowPlusMenu(false);

    const handleChannelUnbold = (channelId) => {
        dispatch(unboldChannel(channelId))
        const storedBoldValues = localStorage.getItem("boldValues")
        let storedBoldValuesObj
        if (storedBoldValues) {
            storedBoldValuesObj = JSON.parse(storedBoldValues)
        } else {
            storedBoldValuesObj = {}
        }
        storedBoldValuesObj[channelId] = 0
        const storedBoldValuesJSON = JSON.stringify(storedBoldValuesObj)
        localStorage.setItem("boldValues", storedBoldValuesJSON)
    }

    const handleRoomUnbold = (channelId) => {
        dispatch(unboldDirectRoom(channelId))
        const storedBoldValues = localStorage.getItem("boldRoomValues")
        let storedBoldValuesObj
        if (storedBoldValues) {
            storedBoldValuesObj = JSON.parse(storedBoldValues)
        } else {
            storedBoldValuesObj = {}
        }
        storedBoldValuesObj[channelId] = 0
        const storedBoldValuesJSON = JSON.stringify(storedBoldValuesObj)
        localStorage.setItem("boldRoomValues", storedBoldValuesJSON)
    }

    document.documentElement.className = `theme-${localStorage.getItem('theme') || 'light'}`;

    if (!server.channels) return null
    return (
        <>
            <div className={`inner-navbar-wrapper${showNavBar ? " do-show" : ""}`}>
                <div className={`inner-navbar-header`}>
                    <OpenModalButton
                        modalComponent={<ServerPopupModal socket={socket} />}
                        buttonText={
                            <p>
                                {server.name} <i className="fa-solid fa-chevron-down"></i>
                            </p>
                        }
                    />
                </div>

                <ul className="inner-navbar-content">
                    <div className={`create-channel-container`}>
                        <button onClick={toggleMenu}> <i className={`${showMenu ? `fa-solid fa-caret-down` : `fa-solid fa-caret-right nav-arrow-container`} ${theme ? showMenu ? 'fa-solid fa-cared-down' : 'fa-solid fa-caret-right nav-arrow-container' : ''}`} />&nbsp;&nbsp;&nbsp;&nbsp;Channels</button>
                        <button className="create-channel-button" onClick={togglePlusMenu}><i className="fa-solid fa-plus"></i></button>
                    </div>
                    <div className={ulClassName} ref={ulRef}>
                        <OpenModalButton
                            buttonText="Create a Channel"
                            onItemClick={closePlusMenu}
                            modalComponent={<ChannelCreationForm socket={socket} />}
                        />
                    </div>
                    {showMenu && Object.values(server.channels).map((channel) => (
                        <li id={`channel${channel.id}`} key={channel.id} onClick={() => handleChannelUnbold(channel.id)} className={`${type === 'channel' && channel.id == channelId ? ' selected-channel' : 'not-selected-channel'}${channel?.bold ? " bold-channel" : ""}`}>
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
                <ul className="inner-navbar-content">
                    <div className={`create-channel-container`}>
                        <button onClick={toggleMenu2}> <i className={`${showMenu2 ? `fa-solid fa-caret-down` : `fa-solid fa-caret-right nav-arrow-container`} ${theme ? showMenu2 ? 'fa-solid fa-cared-down' : 'fa-solid fa-caret-right nav-arrow-container' : ''}`} />&nbsp;&nbsp;&nbsp;&nbsp;Direct Messages</button>
                        <button className="create-channel-button" onClick={() => navigate(`/main/servers/${server.id}/direct-messages/new`)}><i className="fa-solid fa-plus"></i></button>
                    </div>
                    {/* Create Direct Message Popup Modal */}
                    {showMenu2 && Object.values(server.direct_rooms).map((direct_room) => (
                        <li id={`room${sessionUser.id === direct_room.owner_1_id ? direct_room.owner_2_id : direct_room.owner_1_id}`} key={direct_room.id} onClick={() => handleRoomUnbold(sessionUser.id === direct_room.owner_1_id ? direct_room.owner_2_id : direct_room.owner_1_id)} className={`${type === 'message' && (direct_room.owner_1_id == channelId || direct_room.owner_2_id == channelId) ? ' selected-channel' : 'not-selected-channel'}${direct_room?.bold ? " bold-channel" : ""}`}>
                            <Link to={`/main/servers/${server.id}/direct-messages/${sessionUser.id === direct_room.owner_1_id ? direct_room.owner_2_id : direct_room.owner_1_id}`} className="inner-navbar-link">
                                <div className="navbar-content">
                                    <div className="navbar-content-left">
                                        {/* <i className="fa-solid fa-hashtag"></i>{direct_room ? direct_room?.owner_1_id === sessionUser?.id ? `${users[direct_room?.owner_2_id]?.first_name} ${users[direct_room?.owner_2_id]?.last_name}` : `${users[direct_room?.owner_1_id]?.first_name} ${users[direct_room?.owner_1_id]?.last_name}` : "Undefined"} */}
                                        {direct_room ? (sessionUser.id === direct_room.owner_1_id ? (
                                            <>
                                                <img className="inner-profile-pic" src={users[direct_room.owner_2_id].image_url} alt="User Icon"></img>
                                                {users[direct_room.owner_2_id].first_name}{" "}{users[direct_room.owner_2_id].last_name}
                                            </>) : (
                                            <>
                                                <img className="inner-profile-pic" src={users[direct_room.owner_1_id].image_url} alt="User Icon"></img>
                                                {users[direct_room.owner_1_id].first_name}{" "}{users[direct_room.owner_1_id].last_name}
                                            </>)) : ("Undefined")}
                                    </div>
                                    {direct_room?.bold ? <div className="unread-message-count">{direct_room?.bold}</div> : ""}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

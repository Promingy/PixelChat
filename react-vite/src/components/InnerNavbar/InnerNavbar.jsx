import { Link, useParams } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useDispatch, useSelector } from 'react-redux'
import { unboldChannel } from "../../redux/server"
import { useState, useEffect } from "react";
import "./InnerNavbar.css"

export default function InnerNavbar() {
    const { channelId } = useParams()
    const dispatch = useDispatch()
    // const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
          setTheme(storedTheme);
        }
      }, []);

    document.documentElement.className = `theme-${theme}`;


    if (!server.channels) return null
    return (

        <div className="inner-navbar-wrapper">
            <div className="inner-navbar-header">
                <OpenModalButton buttonText={<p>{server.name} <i className="fa-solid fa-chevron-down"></i></p>} />
            </div>
            <ul className="inner-navbar-content">

                {Object.values(server.channels).map((channel) => (
                    <li id={`channel${channel.id}`} key={channel.id} onClick={() => dispatch(unboldChannel(channel.id))} className={`${channel.id == channelId ? ' selected-channel' : 'not-selected-channel'}${channel.bold ? " bold-channel" : ""}`}>
                        <Link to={`/main/servers/${server.id}/channels/${channel.id}`}>
                            <div className="navbar-content"><i className="fa-solid fa-hashtag"></i>{channel.name}</div>
                        </Link>
                    </li>
                ))}

            </ul>
        </div>
    )
}

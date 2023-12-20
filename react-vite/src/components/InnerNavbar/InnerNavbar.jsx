import { Link, useParams } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useSelector } from 'react-redux'
import { unboldChannel } from "../../redux/server"
import "./InnerNavbar.css"

export default function InnerNavbar() {
    const { channelId } = useParams()
    // const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)


    if (!server.channels) return null
    return (

        <div className="inner-navbar-wrapper">
            <div className="inner-navbar-header">
                <OpenModalButton buttonText={<p>{server.name} <i className="fa-solid fa-chevron-down"></i></p>} />
            </div>
            <ul className="inner-navbar-content">

                {Object.values(server.channels).map((channel) => (
                    <li id={`channel${channel.id}`} key={channel.id} onClick={() => unboldChannel(channel.id)} className={`${channel.id == channelId ? ' selected-channel' : 'not-selected-channel'}${channel.bold ? " bold-channel" : ""}`}>
                        <Link to={`/main/servers/${server.id}/channels/${channel.id}`}>
                            <div className="navbar-content"><i className="fa-solid fa-hashtag"></i>{channel.name}</div>
                        </Link>
                    </li>
                ))}

            </ul>
        </div>
    )
}

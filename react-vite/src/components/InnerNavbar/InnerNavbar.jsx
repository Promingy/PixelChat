import { Link, useParams } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useSelector } from 'react-redux'
import "./InnerNavbar.css"

export default function InnerNavbar() {
    const { channelId } = useParams()
    // const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)
    if (!server.channels) return null
    console.log(server)
    return (

        <div className="inner-navbar-wrapper">
            <div className="inner-navbar-header">
                <OpenModalButton buttonText={<p>{server.name} <i className="fa-solid fa-chevron-down"></i></p>} />
            </div>
            <ul className="inner-navbar-content">

                {Object.values(server.channels).map((channel) => (
                    <li key={server.id} className={`${channel.id == channelId ? ' selected-channel' : 'not-selected-channel'}`}>
                        <Link to={`/main/servers/${server.id}/channels/${channel.id}`} className={`navbar-channel`}>
                            <p><i className="fa-solid fa-hashtag"></i></p>{channel.name}
                        </Link>
                    </li>
                ))}

            </ul>

        </div>
    )
}

import { Link } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useSelector } from 'react-redux'

export default function InnerNavbar() {

    const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)

    return (

        <div className="inner-navbar-wrapper">
            <div className="inner-navbar-header">
                <OpenModalButton buttonText={`${server.name}<i class="fa-solid fa-chevron-down"></i>`}></OpenModalButton>
            </div>
            <div className="inner-navbar-content">

                {server.channels.map((channel) => (<Link to={`home/servers/${server.id}/channels/${channel.id}`} className='navbar-channel'><p>#</p>{channel.name}</Link>))}

            </div>

        </div>
    )
}
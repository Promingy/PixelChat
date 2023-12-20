import { Link } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useSelector } from 'react-redux'
import './OuterNavbar.css'
import Profile from '../Profile'

export default function OuterNavbar() {

    const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)

    return (

        <div className="outer-navbar-wrapper">
            <div className="outer-navbar-top">

                {Object.values(sessionUser.servers).map((server) => (
                    <Link to={`/main/servers/${server.id}`} key={server.id}>
                        <div className="server-img-wrapper"><img src={server.image_url} /></div>
                    </Link>

                ))}

            </div>
            <div className="outer-navbar-bottom">

                <Link to='/new-server'>
                    <div className="create-new-server">
                        <i className="fa-solid fa-plus"></i>
                    </div>
                </Link>
                <div className="open-profile-wrapper">
                    <OpenModalButton buttonText={<img src={sessionUser.image_url} modalComponent={<Profile />} />
                    } />
                </div>
            </div>

        </div>
    )
}
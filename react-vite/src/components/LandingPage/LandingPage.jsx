import { Link } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { loadAllServers } from "../../redux/all_servers"
import './LandingPage.css'
import { loadServer } from "../../redux/server";

export default function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
    };

    useEffect(() => {
        if (!sessionUser) { navigate("/") }
    }, [sessionUser, navigate]);

    const navigateToServer = async (serverId) => {
        const server = await dispatch(loadServer(serverId, sessionUser.id))
        const channelId = Object.values(server.channels)[0].id
        return navigate(`/main/servers/${server.id}/channels/${channelId}`)
    }

    if (!sessionUser) {
        return null
    }

    return (
        <>
            {!sessionUser && (
                <Navigate to="/" replace={true} />
            )}
            <div className="landing-top-half-background">
                <div className="landing-top-half">
                    <Link to='/' className="home-link"><img className="home-logo" src='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png' /></Link>
                    <div className="landing-header">
                        <div className="login-confirm">Confirmed as{" "}<b>{sessionUser?.email}</b>
                            <button onClick={logout} className="logout-button">Change</button>
                        </div>
                    </div>
                    <h1>Create a new PixelChat server</h1>
                    <h2>PixelChat gives your team a home — a place where they
                        can talk and work together. To create a new
                        server or join a server, click the buttons below.</h2>
                    <Link to='/new-server' className='landing-create-new-server'>
                        <button className="large-purple-button">Create a Server</button>
                    </Link>
                    <Link to='/join-server' className='landing-join-server'>
                        <button className="large-white-button">Join a Server</button>
                    </Link>
                </div>
            </div>
            <div className="home-or landing-or">OR</div>
            <div className="landing-bottom-half">
                <h3>Open a server</h3>
                <div className="available-servers-wrapper">
                    <div className="available-servers-header">Servers for <b>{sessionUser?.email}</b></div>
                    {Object.values(sessionUser.servers).map((server) => (
                        <div className='landing-server-link' onClick={(() => navigateToServer(server.id))} key={server.id}>
                            <div className="available-server-lhs">
                                <div className="landing-server-image"><img src={server.image_url} /></div>
                                <div className="landing-server-name">{server.name}</div>
                            </div>
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>

                    ))}
                </div>
                <div className="landing-change-email">
                    <p><i className="fa-solid fa-magnifying-glass"></i> Not seeing your server?</p>
                    <Link to='/login'><button className="try-different-email">Try a Different Email</button></Link>
                </div>
            </div>
        </>
    )
}

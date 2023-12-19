import { Link } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadAllServers } from "../../redux/all_servers"
import './LandingPage.css'

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

    return (
        <>
            <div className="landing-top-half">
                <img className="home-logo" src='https://svgshare.com/i/10wP.svg' />
                <div className="landing-header">
                    <div className="login-confirm">Confirmed as{" "}<b>{sessionUser?.email}</b>
                        <button onClick={logout} className="logout-button">Change</button>
                    </div>
                </div>
                <h1>Create a new PixelChat server</h1>
                <h2>PixelChat gives your team a home — a place where they
                    can talk and work together. To create a new
                    server, click the button below.</h2>
                <Link to='/new-server' >
                    <button className="large-purple-button">Create a Server</button>
                </Link>
            </div>
            <div className="home-or">OR</div>
            <div className="divider" />
            <div className="landing-bottom-half">
                <h3>Open a server</h3>
                <div className="available-servers-wrapper">
                    <div className="available-servers-header">Servers for {sessionUser?.email}</div>
                    Placeholder for servers
                </div>
                <div className="change-email">
                    <p><i className="fa-solid fa-magnifying-glass"></i>Not seeing your server?</p>
                    <Link to='/login' className="try-different-email">Try a Different Email</Link>
                </div>
            </div>
        </>
    )
}

import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <>
            <div className="landing-top-half-">
                <div className="landing-header">
                    <img />
                    <div className="login-confirm">Confirmed as <b>_______</b></div>
                </div>
                <h1>Create a new PixelChat server</h1>
                <h2>PixelChat gives your team a home — a place where they
                    can talk and work together. To create a new
                    server, click the button below.</h2>
                <Link to='/servers/new' className='create-new-server'>Create a Server</Link>
            </div>
            <div className="or">OR</div>
            <div className="landing-bottom-half">
                <h3>Open a server</h3>
                <div className="available-servers-wrapper">
                    <div className="available-servers-header">Servers for _________</div>
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

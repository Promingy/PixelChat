import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Home.css";

export default function HomePage() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionUser) {
      navigate("/landing");
    }
  }, [sessionUser, navigate]);

  return (
    <>
      <div className="home-header">
        <img className="home-logo" src='https://svgshare.com/i/10wP.svg' />
        <div className="signin-header">
          <h1>Sign in to PixelChat</h1>
        </div>
        <div className="home-body">
          <Link to="/signup">
            <button className="large-white-button">Create An Account</button>
          </Link>
          <div className="home-or">OR</div>
          <div className="divider" />
          <Link to="/login">
            <button className="large-purple-button">Sign In With Email</button>
          </Link>
        </div>
      </div>
    </>
  );
}

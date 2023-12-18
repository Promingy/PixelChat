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
        <div className="signin-header">
          <h1>Sign in to PixelChat</h1>
          <p>We suggest using the email address you use at work.</p>
        </div>
        <div className="home-body">
          <Link to="/signup" className="home-botton">
            Create An Account
          </Link>
          <div className="or">OR</div>
          <Link to="/login" className="home-botton">
            Log In
          </Link>
        </div>
      </div>
    </>
  );
}

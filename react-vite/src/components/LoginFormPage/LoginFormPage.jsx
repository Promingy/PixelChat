import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import "./LoginFormPage.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const validateEmail = (email) => {
    const atPos = email.indexOf("@");
    const dotPos = email.lastIndexOf(".");
    return atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
  };

  const demoUserLogin = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email: "mario@aa.io",
        password: "password",
      })
    );

    if (!serverResponse) {
      navigate("/landing");
    }
  };

  const demoUser2Login = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email: "pikachu@aa.io",
        password: "password",
      })
    );

    if (!serverResponse) {
      navigate("/landing");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return setErrors({
        email: "Invalid Email Address",
      });
    }
    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/landing");
    }
  };

  return (
    <>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit} className="login-form">
        <Link to='/' className="home-link"><img className="home-logo" src='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png' /></Link>
        <h1>Sign in to PixelChat</h1>

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@work-email.com"
            required
          />
        </label>
        {errors.email && <span>{errors.email}</span>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <span>{errors.password}</span>}

        <button type="submit" className="large-purple-button">
          Log In
        </button>
        <div className="demo-user-wrapper">
          <button onClick={demoUserLogin} className="large-white-button">
            {" "}
            Log in as Demo User{" "}
          </button>
        </div>
        <div className="demo-user-wrapper-end">
          <button className="large-white-button" onClick={demoUser2Login}>
            Log in as Demo User 2
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginFormPage;

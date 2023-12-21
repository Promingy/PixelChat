import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./LoginFormPage.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const autoFillCredentials = () => {
    setEmail("demo@aa.io");
    setPassword("password");
  };

  const autoFillCredentials2 = () => {
    setEmail("zelda@aa.io");
    setPassword("password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <img className="home-logo" src='https://svgshare.com/i/10wP.svg' />
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
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}

        <button type="submit" className="large-purple-button">Log In</button>
        <div id="auto-login">
          <button onClick={autoFillCredentials} className="large-white-button"> Log in as Demo User </button>
        </div>
        <div>
          <button className="large-white-button" onClick={autoFillCredentials2}>Log in as Demo User 2</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormPage;

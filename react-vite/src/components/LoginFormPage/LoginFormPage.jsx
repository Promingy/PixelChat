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
  const validateEmail = (email) => {
    const atPos = email.indexOf("@");
    const dotPos = email.lastIndexOf(".");
    return atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
  };

  const demoUserLogin = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: "password",
      })
    );

    if (serverResponse) {
    } else {
      navigate("/landing");
    }
  };

  const demoUser2Login = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email: "zelda@aa.io",
        password: "password",
      })
    );

    if (serverResponse) {
    } else {
      navigate("/landing");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("error");
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
        <img className="home-logo" src="https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMSJHMEUCIQDPdS%2BefXZdp9FbxUNHyICmyFP9y1NNZI9befAVOFfAnwIgQFjgaE2rn07B1DdxctJ8S8%2BhuB91Cd64JK7y%2FuXwsJwq5AIIMRAAGgwwNTU4Njg2NTI4NTQiDGV9jbQG6qizrU3ZxSrBAvsaXviSSClP8Iz2XE9Ygb3cTuC3M0hI7%2BcUJBNusK38sWRCDTury0Ft2kKucoJXVbBPRZXISXxj0zHd0EB2%2FFk7Iwr27%2FHmIM1E1YuMmPgFi%2BT5wjyLKEc%2Bw2pUcs6v%2BZrj%2BAKgn5GFCJI4BkhtR6d0W%2Bx8ldeXnR8bDjwz72UdZF9aoUFN7r4PT3wrzztinQ6obV%2BLzCYDuCoyz%2FsbRe9aW3kI92%2BMxX2KftVK9KT3X4BuUd9VfdapA%2BTt0CopaEaD2ibHboJFtOwX8nLaFu0o7xw2Qz%2BSfa0fQ7i2Wj2j4EIcjTjirsKj5Fnh0cryc3go1N9efodOCeOZdrGyjU8EVcrgro3%2BJCbXDfXoGSJdPEjobYWxlK7hgGtwQYb%2FbfF%2Bk2FRk68tpcEwVHbvOJDk%2FX8L6V1fBgOCrT6a7ZahvzDo5ZasBjqzAk3J6mEXXJkZ46XR70Mt%2BjlD%2FjPJPUqUEU%2BcvqWDVFLdWD%2BcfAT00m%2BMwsPZYIl4yVnLD0obq%2BeS7eHxse1Hloua0iJx3AWuoK%2BwLn%2FM2lPZuS2%2Fx2g7ab8E6JLJQSKTwxDfeewJnr6cyDzDaFVht6bp5DmC8GoHvfjasRjTwEsqtMKZ53LkXd54V4JS2VSv4eprh9OPr3ttm%2BXyoVPBhr5Rr8eefCWkE73hwRXC5zJyku5fB%2F5LQWGA5HOUS2Csn1YJRjHW1VoY8318VviOpJwmgru63EftWigEqkGmBamo04z81laAd8HniHlLL9ONoMl4obgWLs4vzRUc%2B8wXXQo55DHV0ikzBWV%2FcZ%2Bt9PkfbVzRMRuZR4By1hrcVbwbGOWdYHhvvork9xPyV0yq7EG4crA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231222T192635Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ2AQH7U3EIWHM4OZ%2F20231222%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=8f076a980e1f6e1c7a5af5aa99854b5c41432138c97973d1ed4770290e5361f7" />
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
        {errors.email && <p className="error-message">{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-message">{errors.password}</p>}

        <button type="submit" className="large-purple-button">
          Log In
        </button>
        <div id="auto-login">
          <button onClick={demoUserLogin} className="large-white-button">
            {" "}
            Log in as Demo User{" "}
          </button>
        </div>
        <div>
          <button className="large-white-button" onClick={demoUser2Login}>
            Log in as Demo User 2
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginFormPage;

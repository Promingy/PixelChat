import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import "./Home.css";

export default function HomePage() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (sessionUser) {
      navigate("/landing");
    }
  }, [sessionUser, navigate]);

  const demoUserLogin = async () => {
    const serverResponse = await dispatch(
      thunkLogin({
        email: 'mario@aa.io',
        password: 'password',
      })
    );

    if (serverResponse) {
      // setErrors(serverResponse);
    } else {
      navigate("/landing");
    }


  }

  const demoUser2Login = async () => {
    const serverResponse = await dispatch(
      thunkLogin({
        email: 'pikachu@aa.io',
        password: 'password',
      })
    );

    if (serverResponse) {
      // setErrors(serverResponse);
    } else {
      navigate("/landing");
    }


  }


  return (
    <>
      <div className="home-header">
        <img className="home-logo" src='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png' />
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
          <a href={`/api/auth/oauth_login`} className="demo-user-wrapper">
            <button className="large-white-button">
              <img className="google-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" />
              <p>Continue with Google</p>
            </button>
          </a>
          <div className="demo-user-wrapper">
            <button className="large-white-button" onClick={demoUserLogin}>Sign In As Demo User</button>
          </div>
          <div className="demo-user-wrapper">
            <button className="large-white-button" onClick={demoUser2Login}>Sign In As Demo User 2</button>
          </div>
        </div>
      </div>
      <div className='footer'>
        <p>Nick Brooks<a target='_blank' rel='noreferrer' href="https://github.com/NickBrooks188"><i className="fa-brands fa-github"></i></a>
          <a target='_blank' rel='noreferrer' href='https://www.linkedin.com/in/nick-brooks-531661153/'><i className="fa-brands fa-linkedin"></i></a></p>  •
        <p>Corbin Ainsworth<a target='_blank' rel='noreferrer' href="https://github.com/Promingy"><i className="fa-brands fa-github"></i></a>
          <a target='_blank' rel='noreferrer' href='https://www.linkedin.com/in/corbin-ainsworth-18a885232/'><i className="fa-brands fa-linkedin"></i></a></p>  •
        <p>Reginald Desrosiers<a target="_blank" rel='noreferrer' href="https://github.com/regdes721"><i className="fa-brands fa-github"></i></a>
          <a target='_blank' rel='noreferrer' href='https://www.linkedin.com/in/reginalddesrosiers/'><i className="fa-brands fa-linkedin"></i></a></p>  •
        <p>Esther Zhang<a target="_blank" rel='noreferrer' href="https://github.com/lovelyyun024"><i className="fa-brands fa-github"></i></a>
          <a target='_blank' rel='noreferrer' href='https://www.linkedin.com/in/estherzhangg/'><i className="fa-brands fa-linkedin"></i></a></p>
      </div>
    </>
  );
}

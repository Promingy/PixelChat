import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import { uploadImage } from "../../redux/server";
import "./SignupFormPage.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [theme, setTheme] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setErrors({
        password: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const formData = new FormData();
    formData.append("image", image);
    // aws uploads can be a bit slow—displaying
    // some sort of loading message is a good idea
    const returnImage = await dispatch(uploadImage(formData));

    const userData = {
      first_name,
      last_name,
      username,
      email,
      password,
      bio,
      location
    };

    if (theme !== "") {
      userData.theme = theme;
    }

    if (image !== "") {
      userData.image_url = returnImage.url;
    }

    const serverResponse = await dispatch(thunkSignup(userData));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/landing");
    }
  };

  return (
    <>
      {errors.server && <p>{errors.server}</p>}
      <form
        onSubmit={handleSubmit}
        className="signup-form"
        encType="multipart/form-data"
      >
        <img className="home-logo" src="https://svgshare.com/i/10wP.svg" />
        <h1>Sign Up</h1>
        <p>
          We suggest using the email address you <b>use at work</b>.
        </p>
        <label>
          Email*
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
          Username*
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}

        <label>
          First Name*
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            required
          />
        </label>
        {errors.first_name && <p>{errors.first_name}</p>}

        <label>
          Last Name*
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            required
          />
        </label>
        {errors.last_name && <p>{errors.last_name}</p>}

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        {errors.location && <p>{errors.location}</p>}

        <label>
          Bio
          <textarea
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        {errors.bio && <p>{errors.bio}</p>}

        <div className="signup-file-upload">
          <p>Profile Photo </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {errors.image && <p>{errors.image}</p>}

        <label>
          Theme
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        {errors.theme && <p>{errors.theme}</p>}
        <label>
          Password*
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password*
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button type="submit" className="large-purple-button">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormPage;

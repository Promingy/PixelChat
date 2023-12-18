import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [image_url, setImage_url] = useState("");
  const [theme, setTheme] = useState("");

  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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

    const userData = {
      first_name,
      last_name,
      username,
      email,
      password,
      bio,
      location,
    };

    if (theme !== "") {
      userData.theme = theme;
    }

    if (image_url !== "") {
      userData.image_url = image_url;
    }

    const serverResponse = await dispatch(thunkSignup(userData));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
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
          Email*
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
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
          Bio
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        {errors.bio && <p>{errors.bio}</p>}

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
          Image Url
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImage_url(e.target.value)}
          />
        </label>
        {errors.image_url && <p>{errors.image_url}</p>}

        <label>
          Theme
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        {errors.theme && <p>{errors.theme}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;

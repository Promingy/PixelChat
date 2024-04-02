import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import { uploadImage } from "../../redux/server";
import TextareaAutosize from "react-textarea-autosize";
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
  const [errors, setErrors] = useState({});

  // const scrollToTopBtn = document.getElementsByClassName("large-purple-button")
  const rootElement = document.documentElement
  // function scrollToTop() {
  //   // Scroll to top logic
  //   rootElement.scrollTo({
  //     top: 0,
  //     behavior: "smooth"
  //   })
  // }
  // scrollToTopBtn[0]?.addEventListener("click", scrollToTop)

  useEffect(() => {
    if ((errors.email || errors.username)) {
      rootElement.scrollTo({
        top: 200,
        behavior: "smooth"
      })
    } else if ((errors.first_name || errors.last_name)) {
      rootElement.scrollTo({
        top: 450,
        behavior: "smooth"
      })
    } else if ((errors.password || errors.confirmPassword)) {
      rootElement.scrollTo({
        top: 700,
        behavior: "smooth"
      })
    }

  }, [errors, rootElement])


  const validateEmail = (email) => {
    const atPos = email.indexOf("@");
    const dotPos = email.lastIndexOf(".");
    return atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorsTemp = {}
    setErrors({})
    if (password.length < 6) {
      errorsTemp = {
        ...errorsTemp,
        password: "Password must be at least 6 characters",
      };
    }

    if (password !== confirmPassword) {
      errorsTemp = {
        ...errorsTemp,
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      };
    }

    if (!validateEmail(email)) {
      errorsTemp = {
        ...errorsTemp,
        email:
          "Invalid Email Address"
      };
    }

    if (/\d/.test(first_name) === true) {
      errorsTemp = {
        ...errorsTemp,
        first_name:
          "First name must not include digits (0-9)"
      };
    }

    if (/\d/.test(last_name) === true) {
      errorsTemp = {
        ...errorsTemp,
        last_name:
          "Last name must not include digits (0-9)"
      };
    }
    setErrors(errorsTemp)
    if (Object.keys(errorsTemp).length) return

    let returnImage
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      // aws uploads can be a bit slow—displaying
      // some sort of loading message is a good idea
      returnImage = await dispatch(uploadImage(formData));
    }

    const userData = {
      first_name,
      last_name,
      username,
      email,
      password,
      bio,
      location
    };
    if (returnImage) userData.image_url = returnImage.url
    const serverResponse = await dispatch(thunkSignup(userData));
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/landing");
    }
  };

  return (
    <>
      {errors.server && <span>{errors.server}</span>}
      <form
        onSubmit={handleSubmit}
        className="signup-form"
        encType="multipart/form-data"
      >
        <img className="home-logo" src="https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png" href='/' />
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
        {errors.email && <span>{errors.email}</span>}
        <label>
          Username*
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <span>{errors.username}</span>}

        <label>
          First Name*
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            required
          />
        </label>
        {errors.first_name && <span>{errors.first_name}</span>}

        <label>
          Last Name*
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            required
          />
        </label>
        {errors.last_name && <span>{errors.last_name}</span>}

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        {errors.location && <span>{errors.location}</span>}

        <label>
          Bio
          <TextareaAutosize
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        {errors.bio && <span>{errors.bio}</span>}

        <label>
          Profile Photo
          <div className="signup-file-upload-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

          </div>
        </label>
        {errors.image && <span>{errors.image}</span>}
        <label>
          Password*
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <span>{errors.password}</span>}
        <label>
          Confirm Password*
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

        <button type="submit" className="large-purple-button">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormPage;

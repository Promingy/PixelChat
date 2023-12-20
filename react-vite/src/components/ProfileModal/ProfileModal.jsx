import { useModal } from "../../context/Modal"
import { useSelector } from 'react-redux'
import { VscChromeClose } from "react-icons/vsc";
import { TfiEmail } from "react-icons/tfi";
import { BsFillPinMapFill } from "react-icons/bs";

import "./ProfileModal.css"

export default function Profile() {
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  if (!sessionUser) return null
  return (
    <div className="profile-modal">
      <div className="profile-top">
        <h3>Profile</h3>
        <button type="button" onClick={closeModal}><VscChromeClose /></button>
      </div>
      <div className="profile-header">
        <div style={{ textAlign: "center" }}>
          <img
            src={sessionUser.image_url}
            alt="Profile Image"
            style={{ width: "250px", height: "250px" }}
          ></img>
        </div>
        <h2>
          {sessionUser.first_name}&nbsp;{sessionUser.last_name}
        </h2>

        <p><BsFillPinMapFill />&nbsp;&nbsp;&nbsp;&nbsp;{sessionUser.location}</p>
        <p></p>
      </div>
      <div className="profile-middle">
        <h4>Contact Information</h4>
        <div className="flex-container">
          <div className="flex-item">
            <p><TfiEmail />&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
          <div className="flex-item">
            <p>Email Address</p>
            <p>{sessionUser.email}</p>
          </div>
        </div>
      </div>
      <div className="profile-bottom">
        <h4>About me</h4>
        <p>{sessionUser.bio}</p>
      </div>
    </div>
  );
}

import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TfiEmail } from "react-icons/tfi";
import { BsFillPinMapFill } from "react-icons/bs";
import { LuMessageCircle } from "react-icons/lu";
import { initializeDirectRoom } from '../../redux/server';
import "./ProfileModal.css"

export default function Profile({ animation, userId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { serverId } = useParams()
  const direct_rooms = useSelector((state) => state.server.direct_rooms)
  const sessionUser = useSelector((state) => state.session.user);
  const users = useSelector(state => state.server.users)
  const user = users[userId]
  const [errors, setErrors] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()
    setErrors({})

    if (direct_rooms[userId]) return navigate(`/main/servers/${serverId}/direct-messages/${userId}`)

    const form = {
      owner_2_id: userId
    }

    const handleDirectRoomCreation = async (room) => {

      const roomData = await dispatch(initializeDirectRoom(serverId, room, userId))
      if (!roomData.errors) {
        return navigate(`/main/servers/${serverId}/direct-messages/${userId}`)
      } else {
        setErrors(roomData.errors)
      }
    }

    handleDirectRoomCreation(form)
  }


  if (!sessionUser) return null

  return (
    <div className={animation ? 'profile-modal2' : "profile-modal"} id='profile-modal'>
      <div className="profile-top">
        <h3>Profile</h3>
        <i className="close-profile fa-solid fa-xmark fa-xl" id='close-profile' />
      </div>
      <div className="profile-header">
        <div style={{ textAlign: "center" }}>
          <img
            src={user?.image_url || sessionUser.image_url}
            alt="Profile Image"
            style={{ width: "250px", height: "250px", borderRadius: "10px", objectFit: "cover" }}
          ></img>
        </div>
        <h2>
          {user?.first_name || sessionUser.first_name}&nbsp;{user?.last_name || sessionUser.last_name}
        </h2>

        <p><BsFillPinMapFill />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user?.location || sessionUser.location}</p>
        <div className='profile-popup-buttons'>
          <button onClick={sendMessage}><LuMessageCircle />Message</button>
        </div>
      </div>
      <div className="profile-middle">
        <h4>Contact Information</h4>
        <div className="flex-container">
          <div className="flex-item">
            <p><TfiEmail />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
          <div className="flex-item">
            <p>Email Address</p>
            <p>{user?.email || sessionUser.email}</p>
          </div>
        </div>
      </div>
      <div className="profile-bottom">
        <h4>About Me</h4>
        <p>{user?.bio || sessionUser.bio}</p>
      </div>
    </div>
  );
}

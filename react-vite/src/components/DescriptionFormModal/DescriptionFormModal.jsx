import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { editChannel } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

function DescriptionFormModal({ socket }) {
  const { serverId, channelId } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const server = useSelector(state => state.server)
  const channel = server?.channels?.[+channelId]
  const sessionUser = useSelector(state => state.session.user)
  const [description, setDescription] = useState(channel.description);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(
      editChannel({
        name: channel.name,
        topic: channel.topic,
        description
      }, +channelId)
    ).then((data) => socket.emit("server", {
      userId: sessionUser.id,
      type: "channel",
      method: "PUT",
      room: server.id,
      channel: data
    })).then(() => {
      navigate(`/main/servers/${serverId}/channels/${channelId}`)
    }).then(closeModal()).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors)
      }
    })
  };

  return (
    <div className="topic-popup-form-wrapper">
      <h1>Edit description</h1>
      <form onSubmit={handleSubmit} className="topic-popup-form">
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description"
          required
        />
        <p>{`Let people know what this channel is for.`}</p>
        {errors.description && <p>{errors.description}</p>}
        <div className="topic-popup-form-button-wrapper">
          <button onClick={() => closeModal()} className="topic-popup-form-button topic-popup-form-cancel">Cancel</button>
          <button type="submit" className="topic-popup-form-button topic-popup-form-submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default DescriptionFormModal

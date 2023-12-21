import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { editChannel } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

function TopicFormModal({ socket }) {
  const { serverId, channelId } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const server = useSelector(state => state.server)
  const channel = server?.channels?.[+channelId]
  const sessionUser = useSelector(state => state.session.user)
  const [topic, setTopic] = useState(channel.topic);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await dispatch(
      editChannel({
        name: channel.name,
        topic,
        description: channel.description
      }, +channelId)
    )
    if (!data.errors) {
      socket.emit("server", {
        userId: sessionUser.id,
        type: "channel",
        method: "PUT",
        room: server.id,
        channel: data
      })
      navigate(`/main/servers/${serverId}/channels/${channelId}`)
      closeModal()
    }
    else {
      setErrors(data.errors)
    }
  };

  return (
    <>
      <h1>Edit Topic</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Add a topic"
          required
        />
        <p>{`Let people know what your channel is focused on right now (ex. a project milestone). Topics are always visible in the header.`}</p>
        {errors.topic && <p>{errors.topic}</p>}
        <button onClick={() => closeModal()}>Cancel</button>
        <button type="submit">Save</button>
      </form>
    </>
  );
}

export default TopicFormModal

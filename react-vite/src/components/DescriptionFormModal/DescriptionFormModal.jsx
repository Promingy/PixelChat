import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { editChannel } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

function DescriptionFormModal() {
  const { serverId, channelId } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useSelector(state => state.server)
  const channel = store?.channels?.[+channelId]
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
      room: store.id,
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
    <>
      <h1>Edit description</h1>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
            required
          />
        <p>{`Let people know what this channel is for.`}</p>
        {errors.description && <p>{errors.description}</p>}
        <button onClick={() => closeModal()}>Cancel</button>
        <button type="submit">Save</button>
      </form>
    </>
  );
}

export default DescriptionFormModal

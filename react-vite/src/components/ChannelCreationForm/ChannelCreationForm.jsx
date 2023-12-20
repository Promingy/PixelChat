import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { initializeChannel } from "../../redux/server";
import { VscChromeClose } from "react-icons/vsc";
import "./ChannelCreationForm.css";

export default function ChannelCreationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);
  const serverId = useSelector((state) => state.server.id);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleChannelCreation = async (e) => {
    e.preventDefault();

    const channel = {
      name,
      topic,
      description,
    };

    const channelData = await dispatch(initializeChannel(serverId, channel));
    if (!channelData.errors) {
      socket.emit("server", {
        userId: sessionUser.id,
        type: "channel",
        method: "POST",
        room: serverId,
        channel: channelData
      });
      return navigate(`main/servers/${serverId}/channels/${channelData.id}`);
    }
  };

  return (
    <>
      <div>
        <h1>Create a channel</h1>
        <button type="button" onClick={closeModal}>
          <VscChromeClose />
        </button>
      </div>
      <form onSubmit={handleChannelCreation} className="channel-creation-form">
        <label>
          Name*
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g.plan-budget"
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        {errors.description && <p>{errors.description}</p>}

        <label>
          Topic
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
        {errors.topic && <p>{errors.topic}</p>}
        <button type="submit" className="create-button">
          Create
        </button>
      </form>
    </>
  );
}

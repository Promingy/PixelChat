import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { editChannel } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./TopicForm.css"
import TextareaAutoSize from 'react-textarea-autosize'

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
      closeModal()
    }
    else {
      setErrors(data.errors)
    }
  };

  return (
    <div className="topic-popup-form-wrapper">
      <h1>Edit Topic</h1>
      <form onSubmit={handleSubmit} className="topic-popup-form">
        <TextareaAutoSize
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Add a topic"
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              return handleSubmit(e)
            }
          }}
          required
        />
        <p>{`Let people know what your channel is focused on right now (ex. a project milestone). Topics are always visible in the header.`}</p>
        {errors.topic && <p>{errors.topic}</p>}
        <div className="topic-popup-form-button-wrapper">
          <button onClick={() => closeModal()} className="topic-popup-form-button topic-popup-form-cancel">Cancel</button>
          <button type="submit" className="topic-popup-form-button topic-popup-form-submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default TopicFormModal

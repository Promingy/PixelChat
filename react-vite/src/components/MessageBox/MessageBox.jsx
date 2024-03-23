// import TextareaAutoSize from 'react-textarea-autosize'
import "./MessageBox.css";
import { useState } from "react";
import { initializeMessage, initializeDirectMessage } from '../../redux/server'
import { useDispatch, useSelector } from 'react-redux'
import ReactQuill from "react-quill";
import Picker from "emoji-picker-react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./quill.snow.css";

export default function MessageBox({ socket, channelId, serverId, type, otherUserId }) {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const theme = useSelector((state) => state.session.user.theme);
  const sessionUser = useSelector((state) => state.session.user);
  const [setShowPicker] = useState(false);
  const closeMenu = () => setShowPicker(false);

  const server = useSelector(state => state.server)


  const removeTags = function (str) {
    if (str === null || str === "") return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, "");
  };

  const onEmojiClick = (event) => {
    setMessage((prevMessage) => {
      return prevMessage ? ((prevMessage + "@#$`" + event.emoji)) : event.emoji;
    });
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "strike"],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code-block"],
      ],
    },
  };

  const addClassByClassName = (className, newClass) => {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.toggle(newClass);
    }
  };

  const addClassByClassNameOnClick = (className, newClass) => () => {
    addClassByClassName(className, newClass);
  };

  document.documentElement.className = `theme-${localStorage.getItem("theme") || "light"
    }`;

  const sendSocket = (message) => {
    socket.emit("server", message);
  };

  function handleSubmit(e) {
    e.preventDefault();

    let roomId
    if (type === 'message') {
      roomId = server.direct_rooms[channelId].id
    }

    const newMessage = {
      body: message.replace("</p><p>@#$`", ""),
      pinned: false,
      roomId: roomId
    };

    setMessage("");

    if (type === "channel") dispatch(initializeMessage(channelId, newMessage))
      .then(res => {
        const messageToEmit = {
          userId: res.user_id,
          type: 'message',
          method: "POST",
          room: +serverId,
          channelId,
          message: res
        }

        sendSocket(messageToEmit);

        const element = document.querySelector('.all-messages-container')
        element.scrollTo(0, element.scrollHeight)
      })

    if (type === "message") dispatch(initializeDirectMessage(channelId, newMessage, otherUserId))
      .then(res => {
        const joinPayload = {
          room: `user-${otherUserId}`,
          user: sessionUser,
          serverId: serverId
        }

        socket.emit("join", { room: `user-${otherUserId}`, user: joinPayload })

        const messagePayload = {
          type: 'message',
          method: 'POST',
          user: sessionUser.id,
          room: `user-${otherUserId}`,
          message: res
        }

        socket.emit("server", messagePayload)

        socket.emit("leave", { room: `user-${otherUserId}` })
      }

      )




  }

  return (
    <>
      <div className="send-message-form">
        <ReactQuill
          theme="snow"
          onChange={(value) => setMessage(value)}
          modules={modules}
          value={message.replace("</p><p>@#$`", "")}
          // Have to set placeholer to plain text because the Quill API does not allow to change this value dynamically
          placeholder="Type your message..."
          className="message-box"
          onKeyUp={(e) => {
            if (
              e.key === "Enter" &&
              !!message.match(/[A-Za-z0-9!@?#$&()\\-`.+,/\\]/g) &&
              message.length <= 2001
            ) {
              return handleSubmit(e);
            }
          }}
        />

        <div className="message-wrapper-bottom">
          <div className="bottom-toolbar-wrapper">
            <button
              onClick={addClassByClassNameOnClick(
                "ql-toolbar ql-snow",
                "hidden"
              )}
            >
              <i className="fas fa-remove-format"></i>
            </button>
            <OpenModalButton
              buttonText={<i className="far fa-grin-alt"></i>}
              onItemClick={closeMenu}
              modalComponent={<Picker onEmojiClick={onEmojiClick} theme={theme} />}
            />
          </div>
          <div className="char-count-and-submit">
            <span
              className={
                removeTags(message).length >= 1800
                  ? removeTags(message) >= 2000
                    ? "over-message-limit"
                    : "nearing-message-limit"
                  : `clear-message-limit`
              }
            >
              {message.length != 0 ? removeTags(message).length : 0}/2000
            </span>
            <button
              disabled={
                !message.match(/[A-Za-z0-9!@?#$&()\\-`.+,/\\]/g) ||
                removeTags(message).length > 2000
              }
              onClick={handleSubmit}
              className={`fa-regular fa-paper-plane fa-lg send-message`}
              style={{ margin: "3px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

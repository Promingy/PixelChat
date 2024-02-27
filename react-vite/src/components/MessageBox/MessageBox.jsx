import TextareaAutoSize from 'react-textarea-autosize'
import './MessageBox.css'
import { useState } from "react";
import { initializeMessage } from '../../redux/server'
import { useDispatch } from 'react-redux'
import React, { useMemo, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export default function MessageBox({ socket, channelName, channelId, serverId }) {
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    // const renderCustomToolBar = () =>{
    //     return(
    //     <>
    //         <span className='ql-formats'>
    //             <button className="ql-bold" aria-label='Bold'> </button>
    //             <button className="ql-italic" aria-label='Italic'> </button>
    //             <button className="ql-strike" aria-label='Strike'> </button>
    //         </span>
    //         <span className='ql-formats'>
    //             <button className="ql-link" aria-label='Link'> </button>
    //         </span>
    //         <span className='ql-formats'>
    //             <button className="ql-link" aria-label='Link'> </button>
    //         </span>
    //     </>
    //     )
    // }

    // const header = renderCustomToolBar()
 
    const removeTags = function (str) {
      if (str === null || str === "") return false;
      else str = str.toString();
      return str.replace(/(<([^>]+)>)/gi, "");
    };

    // console.log("===", message);
    // console.log("~~~", message.length);
    // console.log("~~~", removeTags(message));
    // console.log("~~~", removeTags(message).length);

    const modules = useMemo(
        () => ({
          toolbar: {
            container: [
              ["bold", "italic", "strike"],
              ["link"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["code-block"],
            ],
          },
        }),
        []
      );

    document.documentElement.className = `theme-${localStorage.getItem('theme') || 'light'}`;

    const sendSocket = (message) => {
        socket.emit("server", message)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newMessage = {
            body: message,
            pinned: false
        }
        setMessage('')

        dispatch(initializeMessage(channelId, newMessage))
            .then(res => {
                const messageToEmit = {
                    userId: res.user_id,
                    type: 'message',
                    method: "POST",
                    room: +serverId,
                    channelId,
                    message: res
                }

                sendSocket(messageToEmit)

                const element = document.querySelector('.all-messages-container')
                element.scrollTo(0, element.scrollHeight)
            })


    }

    return (
      <>
        <div className="send-message-form">
          <ReactQuill
            theme="snow"
            onChange={(value) => setMessage(value)}
            modules={modules}
            value={message}
            className="message-box"
            placeholder={`Message #${channelName}`}
            style={{ border: "none" }}
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
          {/* <Editor
          onTextChange={(e) => setMessage(e.htmlValue)}
         headerTemplate={header}
          value={message}
          className="message-box"
          placeholder={`Message #${channelName}`}
        /> */}

          {/* <div className="message-wrapper-top">
            <TextareaAutoSize
              className="message-box"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channelName}`}
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
          </div> */}
          <div className="message-wrapper-bottom">
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
                {removeTags(message).length}/2000
              </span>
              <button
                disabled={
                  !message.match(/[A-Za-z0-9!@?#$&()\\-`.+,/\\]/g) ||
                  removeTags(message).length > 2000
                }
                onClick={handleSubmit}
                className={`fa-regular fa-paper-plane fa-lg send-message`}
              />
            </div>
          </div>
        </div>
      </>
    );
}

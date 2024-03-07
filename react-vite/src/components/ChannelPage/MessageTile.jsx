import { useState } from 'react'
import './ChannelPage.css'
import ReactionTile from './ReactionTile'
import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction, removeMessage } from '../../redux/server';
import { thunkPinMessage } from '../../redux/server';
import EmojiPicker from 'emoji-picker-react';
import parse from "html-react-parser";


export default function MessageTile({ message, user, channelId, socket, openUserModal }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const server = useSelector(state => state.server)
    const [reactBar, setReactBar] = useState(false)
    const [confirmMsgDel, setConfirmMsgDel] = useState(false)
    const [emojiBox, setEmojiBox] = useState(false)
    const [emojiBoxHeight, setEmojiBoxHeight] = useState(0)
    
    //helper function to parse html
    const replaceClass = function (htmlString) {
      const updatedHtml = htmlString.replace(/class=/g, "className=");
      return updatedHtml;
    };

    // format date
    const date = new Date(message.created_at)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const amPm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 ? hours % 12 : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes

    function handleEmojiBox(e) {
        let emojiHeight = e.clientY - 30
        const messageContainer = document.getElementById('all-messages-container')
        if (window.innerHeight - emojiHeight < 500) {
            emojiHeight = window.innerHeight - 500
        }
        setEmojiBox(true)
        messageContainer.classList.toggle('no-scroll')
        setEmojiBoxHeight(emojiHeight)
        let counter = 0
        const handleEmojiClick = (e) => {
            counter++
            try {
                if (!document.getElementById('emojiBox').contains(e.target) && counter > 1) {
                    window.removeEventListener("click", handleEmojiClick)
                    setEmojiBox(false)
                    messageContainer.classList.toggle('no-scroll')
                    counter = 0
                }
            } catch {
                window.removeEventListener("click", handleEmojiClick)
                messageContainer.classList.toggle('no-scroll')
                counter = 0
            }
        }
        window.removeEventListener("click", handleEmojiClick)
        window.addEventListener("click", handleEmojiClick)
    }

    // set object with a count of each emoji
    const reactions = {}
    // iterate over every reaction and add them to the reactions counter / increment
    for (let reaction of Object.values(message.reactions)) {
        reactions[reaction.emoji] = reactions[reaction.emoji] ? reactions[reaction.emoji] + 1 : 1
    }

    return (
        <>
            {emojiBox &&
                <div className={'emoji-box'} id="emojiBox" style={{ 'top': `${emojiBoxHeight}px` }}>
                    <EmojiPicker
                        theme={localStorage.getItem('theme') || 'light'}

                        // if an emoji is selected through the picker, add it to the database!
                        onEmojiClick={(e) => {
                            // remove the reaction if user has already used it
                            setEmojiBox(false)
                            for (let reaction of Object.values(message.reactions)) {
                                if (reaction.user_id == sessionUser.id && reaction.emoji == e.emoji) {
                                    return dispatch(removeReaction(channelId, message.id, reaction.id)).then(() => {
                                        const payload = {
                                            type: 'reaction',
                                            method: 'DELETE',
                                            room: +server?.id,
                                            channelId,
                                            messageId: message.id,
                                            reactionId: reaction.id
                                        }

                                        socket.emit("server", payload)
                                    })
                                }
                            }
                            // if user hasn't used this reaction already, add reaction
                            return dispatch(initializeReaction(channelId, message.id, { emoji: e.emoji })).then(res => {
                                const payload = {
                                    type: 'reaction',
                                    method: 'POST',
                                    room: +server?.id,
                                    channelId,
                                    reaction: res
                                }
                                socket.emit("server", payload)
                            })
                        }} />
                </div>}

            <div className={message.pinned ? 'user-message-container pinned ' : `user-message-container`} onMouseOver={() => setReactBar(true)} onMouseLeave={() => {
                setReactBar(false)
                setConfirmMsgDel(false)
            }}>

                <div className='message-body-reactions-container'>
                    {message.pinned &&
                        <i className='fa-sharp fa-solid fa-thumbtack fa-xs pin-message pinned-icon-on-message' />
                    }
                    <div className="message-body-header-container">
                        <img
                            className='message-profile-pic'
                            src={user?.image_url}
                            id={message.id}
                            onClick={() => {
                                openUserModal(message.user_id)
                            }}
                        />

                        <div className="message-owner-date-container">
                            <div
                                className='date-name-container'
                                onClick={() => {
                                    openUserModal(message.user_id)
                                }}>
                                <p className="message-owner" id={message.id}>{user?.username}</p>
                                <p className="message-post-time" id={message.id}>{hours}:{minutes}</p>
                                <p className="message-post-time" id={message.id}>{amPm}</p>
                            </div>
                            <p className="message-body">{parse(replaceClass(message.body))}</p>
                        </div>

                    </div>

                    <div className='message-reactions-container'>
                        {Object.keys(reactions).map(key => {
                            return <ReactionTile key={key} socket={socket} serverId={server?.id} allReactions={message.reactions} channelId={channelId} reaction={key} count={reactions[key]} messageId={message.id} />
                        })}
                    </div>

                </div >

                {<div className={`react-bar${reactBar ? "" : ' react-bar-hidden'} ${localStorage.getItem('theme') === 'dark' ? 'react-bar-dark' : ''}`}>

                    <i className='fa-solid fa-face-laugh-wink fa-lg reaction-icon'
                        onClick={(e) => handleEmojiBox(e)} />

                    {server.owner_id === sessionUser.id &&
                        <i
                            className='fa-sharp fa-solid fa-thumbtack pin-message'
                            onClick={() => {
                                const updatedMessage = { ...message }
                                updatedMessage.pinned = !updatedMessage.pinned
                                dispatch(thunkPinMessage(updatedMessage)).then(res => {
                                    const payload = {
                                        type: 'message',
                                        method: 'PUT',
                                        room: +server?.id,
                                        channelId,
                                        message: res
                                    }
                                    socket.emit("server", payload)
                                })
                            }} />
                    }


                    {sessionUser.id === message.user_id && <div>
                        <i className='fa-regular fa-trash-can remove-message' onClick={() => setConfirmMsgDel(!confirmMsgDel)} />
                        {confirmMsgDel && <div
                            className='confirm-message-delete'
                            onMouseLeave={() => setConfirmMsgDel(false)}
                            onClick={() => {
                                setConfirmMsgDel(false)
                                dispatch(removeMessage(channelId, message.id)).then(() => {
                                    const payload = {
                                        userId: sessionUser.id,
                                        type: 'message',
                                        method: 'DELETE',
                                        room: +server?.id,
                                        channelId,
                                        messageId: message.id
                                    }


                                    socket.emit("server", payload)
                                })
                            }}
                        >Confirm Delete</div>}
                    </div>}
                </div>}

            </div>

        </>

    )

}

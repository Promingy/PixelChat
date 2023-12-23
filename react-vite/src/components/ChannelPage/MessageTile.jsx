import { useState } from 'react'
import './ChannelPage.css'
import ReactionTile from './ReactionTile'
import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction, removeMessage } from '../../redux/server'

export default function MessageTile({ message, user, channelId, socket, bottom, center, emojiBox, setEmojiBox, handleEmojiBox, messagesContainer }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const server = useSelector(state => state.server)
    const [reactBar, setReactBar] = useState(false)
    // const [emojiBox, setEmojiBox] = useState(false)
    const [confirmMsgDel, setConfirmMsgDel] = useState(false)

    // format date
    const date = new Date(message.created_at)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const amPm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 ? hours % 12 : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes

    // set object with a count of each emoji
    const reactions = {}
    // iterate over every reaction and add them to the reactions counter / increment
    for (let reaction of Object.values(message.reactions)) {
        reactions[reaction.emoji] = reactions[reaction.emoji] ? reactions[reaction.emoji] + 1 : 1
    }

    return (
        <>

            <div className={message.pinned ? 'user-message-container pinned ' : `user-message-container`} onMouseOver={() => setReactBar(true)} onMouseLeave={() => {
                setReactBar(false)
                setConfirmMsgDel(false)
            }}>

                <div className='message-body-reactions-container'>
                    {message.pinned &&
                        <i className='fa-sharp fa-solid fa-thumbtack fa-xs pin-message pinned-icon-on-message' />
                    }
                    <div className="message-body-header-container">
                        <img className='message-profile-pic' src={user.image_url} />

                        <div className="message-owner-date-container">

                            <div className='date-name-container'>
                                <p className="message-owner">{user.username}</p>
                                <p className="message-post-time">{hours}:{minutes} {amPm}</p>
                            </div>
                            <p className="message-body">{message.body}</p>
                        </div>

                    </div>

                    <div className='message-reactions-container'>
                        {Object.keys(reactions).map(key => {
                            return <ReactionTile key={key} socket={socket} serverId={server?.id} allReactions={message.reactions} channelId={channelId} reaction={key} count={reactions[key]} messageId={message.id} />
                        })}
                    </div>

                </div >

                {reactBar && <div className={reactBar ? 'react-bar' : 'hidden'}>
                    {/* {<div className={reactBar ? 'react-bar' : 'react-bar'}> */}

                    <i className='fa-solid fa-face-laugh-wink fa-lg reaction-icon'
                        onClick={(e) => {
                            setEmojiBox(!emojiBox)
                            window.addEventListener("mousedown", (e) => handleEmojiBox(e))
                            messagesContainer.addEventListener('scroll', handleEmojiBox)
                        }} />

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

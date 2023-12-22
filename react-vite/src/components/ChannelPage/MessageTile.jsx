import { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import './ChannelPage.css'
import ReactionTile from './ReactionTile'
import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction, removeMessage } from '../../redux/server'
import { thunkPinMessage } from '../../redux/server'

export default function MessageTile({ message, user, channelId, socket, server, bottom, center }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [reactBar, setReactBar] = useState(false)
    const [emojiBox, setEmojiBox ] = useState(false)
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
            <div className={ message.pinned ? 'user-message-container pinned ' : `user-message-container`} onMouseOver={() => setReactBar(true)} onMouseLeave={() => {
                setReactBar(false)
                setConfirmMsgDel(false)
            }}>

                <div className='message-body-reactions-container'>
                    {message.pinned &&
                        <i className='fa-sharp fa-solid fa-thumbtack fa-xs pin-message pinned-icon-on-message'/>
                    }
                    <div className="message-body-header-container">
                        <img className='message-profile-pic' src={user.image_url} />

                        <div className="message-owner-date-container">
                            <div className='date-name-container'>
                                <span className="message-owner">{user.username}</span>
                                <span className="message-post-time">{hours}:{minutes} {amPm}</span>
                            </div>
                            <p className="message-body">{message.body}</p>
                        </div>

                    </div>

                    <div className='message-reactions-container'>
                        {Object.keys(reactions).map(key => {
                            return <ReactionTile key={key} socket={socket} serverId={server?.id} allReactions={message.reactions} channelId={channelId} reaction={key} count={reactions[key]} messageId={message.id} />
                        })}
                    </div>

                </div>


                {reactBar && <div className={reactBar ? 'react-bar' : 'hidden'}>
                {/* {<div className={reactBar ? 'react-bar' : 'react-bar'}> */}

                        <i className='fa-solid fa-face-laugh-wink fa-lg reaction-icon'
                            onClick={() => {
                                setEmojiBox(!emojiBox)
                        }}/>
                    {emojiBox && <div className={bottom ? 'bottom-emoji' : center ? 'center-emoji ':'emoji-box'} onMouseLeave={() => setEmojiBox(!emojiBox)}>
                                <EmojiPicker

                                    //if an emoji is selected through the picker, add it to the database!
                                    onEmojiClick={(e) => {
                                        //remove the reaction if user has already used it
                                        setEmojiBox(!emojiBox)
                                        for (let reaction of Object.values(message.reactions)){
                                            if (reaction.user_id == sessionUser.id && reaction.emoji == e.emoji) {
                                                return dispatch(removeReaction(channelId, message.id, reaction.id)).then(() => {
                                                    const payload = {
                                                        method:'DELETE',
                                                        room: +serverId,
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
                                            return dispatch(removeReaction(channelId, message.id, reaction.id)).then(() => {
                                                const payload = {
                                                    type: 'reaction',
                                                    method:'DELETE',
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

                        {server.owner_id === sessionUser.id &&
                            <i
                                className='fa-sharp fa-solid fa-thumbtack pin-message'
                                onClick={() => {
                                    const updatedMessage = {...message}
                                    updatedMessage.pinned = !updatedMessage.pinned
                                    dispatch(thunkPinMessage(updatedMessage)).then(res => {
                                        const payload = {
                                            type: 'message',
                                            method: 'PUT',
                                            room: +server?.id,
                                            channelId,
                                            message: res
                                        }
                                        console.log('~~~~~~payload', payload)
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
                        })}}
                            >Confirm Delete</div>}
                    </div>}
                </div>}

            </div>

        </>

    )

}

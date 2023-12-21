import { useState } from 'react'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import EmojiPicker from 'emoji-picker-react'
import './ChannelPage.css'
import ReactionTile from './ReactionTile'
import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction, removeMessage } from '../../redux/server'

export default function MessageTile({ message, user, channelId, socket, serverId }) {
    const dispatch = useDispatch()
    const [reactBar, setReactBar] = useState(false)
    const sessionUser = useSelector(state => state.session.user)

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
            <div className="user-message-container" onMouseOver={() => setReactBar(true)} onMouseLeave={() => setReactBar(false)}>

                <div className='message-body-reactions-container'>
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
                            return <ReactionTile key={key} socket={socket} serverId={serverId} allReactions={message.reactions} channelId={channelId} reaction={key} count={reactions[key]} messageId={message.id} />
                        })}
                    </div>

                </div>


                {reactBar && <div className={reactBar ? 'react-bar' : 'hidden'}>
                    {/* {<div className={reactBar ? 'react-bar' : 'react-bar'}> */}
                    <div className='reaction-button-container'>
                        <OpenModalButton
                            buttonText={''}
                            modalComponent={<EmojiPicker
                                //if an emoji is selected through the picker, add it to the database!
                                onEmojiClick={(e) => {
                                    //remove the reaction if user has already used it
                                    for (let reaction of Object.values(message.reactions)) {
                                        if (reaction.user_id == sessionUser.id && reaction.emoji == e.emoji) {
                                            return dispatch(removeReaction(channelId, message.id, reaction.id)).then(() => {
                                                const payload = {
                                                    type: 'reaction',
                                                    method: 'DELETE',
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
                                        const payload = {
                                            type: 'reaction',
                                            method: 'POST',
                                            room: +serverId,
                                            channelId,
                                            reaction: res
                                        }
                                        socket.emit("server", payload)
                                    })
                                }}
                            />
                            } />
                    </div>
                    {sessionUser.id === message.user_id && <div>
                        <i className='fa-regular fa-trash-can remove-message' onClick={() => {
                            dispatch(removeMessage(channelId, message.id)).then(() => {
                                const payload = {
                                    userId: sessionUser.id,
                                    type: 'message',
                                    method: 'DELETE',
                                    room: +serverId,
                                    channelId,
                                    messageId: message.id
                                }

                                socket.emit("server", payload)
                            })
                        }} />
                    </div>}
                </div>}

            </div>

        </>

    )

}

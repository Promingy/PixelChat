import { useState } from 'react'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import EmojiPicker from 'emoji-picker-react'
import './ChannelPage.css'


export default function MessageTile({ message, user }) {
    const [ reactBar, setReactBar ] = useState(false)

    // format date
    const date = new Date(message.created_at)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const amPm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 ? hours % 12 : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes

    return (
        <div className="user-message-container" onMouseOver={() => setReactBar(true)} onMouseLeave={() => setReactBar(false)}>

            <div className="message-body-header-container">
                <img className='message-profile-pic' src={user.image_url}/>

                <div className="message-owner-date-container">

                    <div className='date-name-container'>
                        <span className="message-owner">{user.username}</span>
                        <span className="message-post-time">{ hours }:{ minutes } { amPm }</span>
                    </div>
                    <p className="message-body">{message.body}</p>
                </div>
            </div>

           { reactBar && <div className={reactBar ? '' : 'hidden'}>
                <OpenModalButton
                    buttonText={'react'}
                    modalComponent={<EmojiPicker />}
                />
            </div>}

        </div>
    )

}

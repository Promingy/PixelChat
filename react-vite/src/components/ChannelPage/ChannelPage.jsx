import { useParams } from "react-router-dom"
import EmojiPicker from 'emoji-picker-react';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './ChannelPage.css'

export default function ChannelPage() {
    const { channelId } = useParams()
    const [ test, setTest ] = useState()
    const store = useSelector(state => state.server)
    const channel = store?.channels?.[+channelId]
    const messages = store?.channels?.[+channelId]?.messages
    const users = store?.users

    const [message, setMessage] = useState();
    const [react, setReact] = useState(false)

    function generate_message_layout(){
        const result = []
        for (let index in messages){
            const message = messages[index]
            const user = users[message.user_id]

            // format date
            const date = new Date(message.created_at)
            let hours = date.getHours()
            let minutes = date.getMinutes()
            const amPm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12 ? hours % 12 : 12
            minutes = minutes < 10 ? `0${minutes}` : minutes

            result.push(
                <div
                    className="user-message-container"
                    onMouseOver={() => setReact(true)}
                    onMouseLeave={() => setReact(false)}>
                    <div className="message-body-header-container">
                        <div className="message-owner-date-container">
                            <span className="message-owner">{user.first_name}</span>
                            <span className="message-post-time">{ hours }:{ minutes } { amPm }</span>
                        </div>
                        <p className="message-body" key={message.id}>{message.body}</p>
                    </div>
                    <img className='message-profile-pic' src={message.image_url}/>

                    <div className={react ? '' : 'hidden'}>
                        <OpenModalButton
                            buttonText={'react'}
                            modalComponent={<EmojiPicker />}
                    />
                    </div>
                </div>
            )
        }
        return result
    }

    function handleSubmit(e){
        e.preventDefault()
    }

    // Scroll to bottom of the page on initial load
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    }, [])

    return (
        <>
            <h1>hi from channel {channelId}</h1>
            <input
                type='text'
                value = {test}
                onChange={e => setTest(e.target.value)}
            />

            <div>
                {generate_message_layout()}
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder={`Message #${channel?.name}`}
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                    />

                <button>send</button>
            </form>
        </>
        )
}

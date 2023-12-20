import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './ChannelPage.css'
import MessageTile from "./MessageTile";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ChannelPopupModal from "../ChannelPopupModal/ChannelPopupModal";

export default function ChannelPage() {
    const { channelId } = useParams()
    const store = useSelector(state => state.server)
    const channel = store?.channels?.[+channelId]
    const messages = store?.channels?.[+channelId]?.messages
    const users = store?.users

    const [message, setMessage] = useState();

    function generate_message_layout() {
        // func to iterate over all messages for a channel
        // and create a tile component

        const sortedMessages = messages && Object.values(messages).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        const result = []

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const dateSuffix = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd' }

        // iterate over messages and grab the key as index
        if (sortedMessages) {
            for (let i = 0; i < sortedMessages.length; i++) {
                const message = sortedMessages[i]
                const user = users[message.user_id]

                const prev_date = new Date(sortedMessages[i - 1]?.created_at)
                const curr_date = new Date(sortedMessages[i].created_at)

                // add a seperator for a messages posted on different days
                if (prev_date.getDate() !== curr_date.getDate()) {
                    result.push(
                        <div key={message.id}>
                            <p className='message-date-seperator'>{days[curr_date.getDay()]}, {months[curr_date.getMonth()]} {curr_date.getDate()}{dateSuffix[curr_date.getDate()] || 'th'}</p>
                            <MessageTile message={message} user={user} />
                        </div>
                    )
                    continue
                }

                result.push(<div key={message.id}><MessageTile message={message} user={user} /></div>)
            }
        }
        return result
    }

    function handleSubmit(e) {
        e.preventDefault()
    }

    // Scroll to bottom of the page on initial load
    window.scrollTo(0, document.body.scrollHeight)

    return (
        <>
            <h1>hi from channel {channelId}</h1>
            <OpenModalButton
                    buttonText={channel?.name}
                    modalComponent={<ChannelPopupModal activeProp={1} />}
                />

            {users && <OpenModalButton
                    buttonText={`${Object.keys(users).length} Members`}
                    modalComponent={<ChannelPopupModal activeProp={2} />}
                />}

            <div className="all-messages-container">
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

            <OpenModalButton
                    buttonText={channel?.name}
                    modalComponent={<ChannelPopupModal activeProp={1} />}
                />

            {users && <OpenModalButton
                    buttonText={`${Object.keys(users).length} Members`}
                    modalComponent={<ChannelPopupModal activeProp={2} />}
                />}
        </>
    )
}

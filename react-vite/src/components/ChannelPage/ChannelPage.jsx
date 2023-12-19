import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './ChannelPage.css'
import MessageTile from "./MessageTile";

export default function ChannelPage() {
    const { channelId } = useParams()
    const store = useSelector(state => state.server)
    const channel = store?.channels?.[+channelId]
    const messages = store?.channels?.[+channelId]?.messages
    const users = store?.users

    const [message, setMessage] = useState();

    function generate_message_layout(){
        // func to iterate over all messages for a channel
        // and create a tile component

        const sortedMessages = messages && Object.values(messages).sort((a, b) => new Date(a.created_at) - new Date (b.created_at))
        const result = []
        // iterate over messages and grab the key as index
        if (sortedMessages){
            for (let message of sortedMessages){
                const user = users[message.user_id]

                result.push(<MessageTile key={message.id} message={message} user={user}/>)
            }
        }
        return result
    }

    function handleSubmit(e){
        e.preventDefault()
    }

    // Scroll to bottom of the page on initial load
    useEffect(() => {
        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 1)
    }, [channelId])

    return (
        <>
            <h1>hi from channel {channelId}</h1>

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
        </>
        )
}

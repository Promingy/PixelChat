import { useParams } from "react-router-dom"
import EmojiPicker from 'emoji-picker-react';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ChannelPage() {
    const { channelId } = useParams()
    const [ test, setTest ] = useState()
    const store = useSelector(state => state.server)
    const messages = store?.channels?.[+channelId]?.messages

    function generate_message_layout(){
        const result = []
        for (let message in messages){
            console.log(messages[message])
            result.push(
            <>
            <p key={message}>{messages[message].body}</p>
            </>)
        }
        return result
    }

    console.log(messages)
    return (
        <>
            <h1>hi from channel {channelId}</h1>
            <input
                type='text'
                value = {test}
                onChange={e => setTest(e.target.value)}
            />
            <OpenModalButton
                buttonText={'Emoji'}
                modalComponent={<EmojiPicker onEmojiClick={(e) => setTest(e.emoji)}/>}
                />
            {generate_message_layout()}
        </>
        )
}

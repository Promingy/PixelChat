import { useParams } from "react-router-dom"
import EmojiPicker from 'emoji-picker-react';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useState } from "react";

export default function ChannelPage() {
    const { channelId } = useParams()
    const [ test, setTest ] = useState()

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
        </>
        )
}

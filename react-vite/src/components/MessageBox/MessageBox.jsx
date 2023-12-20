import TextareaAutoSize from 'react-textarea-autosize'
import './MessageBox.css'
import { useState } from 'react'
import { initializeMessage } from '../../redux/server'
import { useDispatch } from 'react-redux'

export default function MessageBox({ socket, channelName, channelId}) {
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const sendSocket = () => {
        socket.emit("chat", { message: "Chat message!" })
    }

    function handleSubmit(e){
        e.preventDefault()

        const newMessage = {
            body: message,
            pinned: false
        }
        setMessage('')

        dispatch(initializeMessage(channelId, newMessage))

    }

    return(
        <form className='send-message-form'>
            <TextareaAutoSize
                className="message-box"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Message #${channelName}`}/>
            <button onClick={handleSubmit} className='fa-regular fa-paper-plane fa-lg send-message' />
        </form>
    )
}

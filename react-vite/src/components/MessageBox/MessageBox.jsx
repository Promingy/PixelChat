import TextareaAutoSize from 'react-textarea-autosize'
import './MessageBox.css'
import { useState } from 'react'
import { initializeMessage } from '../../redux/server'
import { useDispatch } from 'react-redux'

export default function MessageBox({ socket, channelName, channelId, serverId}) {
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')

    const sendSocket = (message) => {
        socket.emit("server", message)
    }

    function handleSubmit(e){
        e.preventDefault()

        const newMessage = {
            body: message,
            pinned: false
        }
        setMessage('')

        dispatch(initializeMessage(channelId, newMessage))
        .then(res => {
            const messageToEmit = {
                userId: res.user_id,
                type: 'message',
                method: "POST",
                room: +serverId,
                channelId,
                message: res
            }

            sendSocket(messageToEmit)
        })


    }

    return(
        <form className='send-message-form'>
            <TextareaAutoSize
                className="message-box"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Message #${channelName}`}
                onKeyUp={(e) => {
                    if (e.key === 'Enter'){
                        return handleSubmit(e)
                    }
                }}/>
            <button onClick={handleSubmit} className='fa-regular fa-paper-plane fa-lg send-message' />
        </form>
    )
}

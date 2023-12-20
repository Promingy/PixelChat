import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ServerCreationForm.css'
import { initializeServer } from '../../redux/server'

export default function ServerCreationForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
<<<<<<< Updated upstream
    const [image_url, setImage_url] = useState('')
=======
    const [image_url] = useState('')
    const [channelName, setChannelName] = useState('')
    const [channelDescription, setChannelDescription] = useState('')
>>>>>>> Stashed changes
    const [errors, setErrors] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        // TODO: assign AWS url to image_url
        const form = {
            name,
            description,
            image_url
            // TODO: add owner_id from user state slice
        }

        if (!channelName) {
            setErrors({ channel: "Channel name is required" })
            return
        }

        const handleServerCreation = async (server) => {
            const serverData = await dispatch(initializeServer(server))
            if (!serverData.errors) {
                navigate(`/main/servers/${serverData.id}`)
            } else {
                setErrors(serverData.errors)
            }
        }

        handleServerCreation(form)
    }

    return (
        <form className="server-creation-form" onSubmit={onSubmit}>
            <h1 className="server-creation-header">{`What's the name of your server?`}</h1>
            <h2 className="server-creation-subheader">This will be the name of your PixelChat server - choose something that your team will recognize</h2>
            <span>{errors.name}</span>
            <input type='text' value={name} onChange={e => setName(e.target.value)} className="server-creation-input" placeholder="Ex: Acme Marketing or Acme Co " />
            <h1 className="server-creation-header">Describe your server</h1>
            <h2 className="server-creation-subheader">Provide a short description of your server (optional)</h2>
            <span>{errors.description}</span>
            <input type='text' value={description} onChange={e => setDescription(e.target.value)} className="server-creation-input" placeholder="Ex: Official PixelChat server for the Acme marketing team " />
            <h1 className="server-creation-header">Upload an icon for your server</h1>
            <h2 className="server-creation-subheader">Choose an image to represent your server (optional)</h2>
            <span>{errors.image_url}</span>
            --Placeholder for file upload--
            <h1 className="server-creation-header">Create a channel for your new server</h1>
            <h2 className="server-creation-subheader">Name a channel so users have a place to communicate</h2>
            <span>{errors.channel}</span>
            <input type='text' value={channelName} onChange={e => setChannelName(e.target.value)} className="server-creation-input" placeholder="Ex: General Questions" />
            <h1 className="server-creation-header">Add a description for your new channel</h1>
            <h2 className="server-creation-subheader">Provide a helpful channel description (optional)</h2>
            <input type='text' value={channelDescription} onChange={e => setChannelDescription(e.target.value)} className="server-creation-input" placeholder="Ex: All general questions go here" />
            <input type='submit' className="submit-server" value="Create New Server" />
        </form>
    )
}
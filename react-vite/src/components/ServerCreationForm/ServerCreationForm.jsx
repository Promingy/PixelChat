import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ServerCreationForm.css'
import { initializeServer } from '../../redux/server'

export default function ServerCreationForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const sessionUser = useSelector(state => state.session.user)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image_url] = useState('')
    const [errors, setErrors] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        // TODO: assign AWS url to image_url
        const form = {
            name,
            description,
            image_url,
            owner_id: sessionUser.id
        }

        const handleServerCreation = async (server) => {
            const serverData = await dispatch(initializeServer(server))
            if (!serverData.errors) {
                navigateToServer(serverData.id)
            } else {
                setErrors(serverData.errors)
            }
        }

        handleServerCreation(form)
    }

    const navigateToServer = async (serverId) => {
        const preloadServer = async (servId) => {
            const serv = await dispatch(loadServer(servId))
            return serv
        }
        const server = await preloadServer(serverId)
        const channelId = Object.values(server.channels)[0].id
        return navigate(`/main/servers/${server.id}/channels/${channelId}`)
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
            <input type='submit' className="submit-server" value="Create New Server" />
        </form>
    )
}

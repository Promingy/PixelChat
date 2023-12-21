import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ServerCreationForm.css'
import { initializeServer, initializeChannel, uploadImage } from '../../redux/server'

export default function ServerCreationForm() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const sessionUser = useSelector(state => state.session.user)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [channelName, setChannelName] = useState('')
    const [channelDescription, setChannelDescription] = useState('')
    const [errors, setErrors] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        // TODO: assign AWS url to image_url

        const formData = new FormData();
        formData.append("image", image);
        // aws uploads can be a bit slow—displaying
        // some sort of loading message is a good idea
        const returnImage = await dispatch(uploadImage(formData))

        const form = {
            name,
            description,
            image_url: returnImage.url,
            owner_id: sessionUser.id
        }

        if (!channelName) {
            setErrors({ channel: "Channel name is required" })
            return

        }

        const handleServerCreation = async (server) => {
            const serverData = await dispatch(initializeServer(server))
            if (!serverData.errors) {
                const channelForm = {
                    name: channelName,
                    description: channelDescription,
                    owner_id: sessionUser.id
                }
                const channelData = await dispatch(initializeChannel(serverData.id, channelForm))
                return navigate(`/main/servers/${serverData.id}/channels/${channelData.id}`)
            } else {
                setErrors(serverData.errors)
            }
        }

        handleServerCreation(form)
    }

    return (
        <form className="server-creation-form" onSubmit={onSubmit} encType="multipart/form-data">
            <img className="home-logo" src='https://svgshare.com/i/10wP.svg' />
            <div>
                <h1 className="server-creation-header">{`What's the name of your server?`}</h1>
                <h2 className="server-creation-subheader">This will be the name of your PixelChat server - choose something that your team will recognize</h2>
                <span>{errors.name}</span>
                <input type='text' value={name} onChange={e => setName(e.target.value)} className="server-creation-input" placeholder="Ex: Acme Marketing or Acme Co " />
            </div>
            <div>
                <h1 className="server-creation-header">Describe your server</h1>
                <h2 className="server-creation-subheader">Provide a short description of your server (optional)</h2>
                <span>{errors.description}</span>
                <input type='text' value={description} onChange={e => setDescription(e.target.value)} className="server-creation-input" placeholder="Ex: Official PixelChat server for the Acme marketing team " />
            </div>
            <div>
                <h1 className="server-creation-header">Upload an icon for your server</h1>
                <h2 className="server-creation-subheader">Choose an image to represent your server (optional)</h2>
                <span>{errors.image}</span>
                <input type="file" className='server-creation-file-upload' accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div>
                <h1 className="server-creation-header">Create a channel for your new server</h1>
                <h2 className="server-creation-subheader">Name a channel so users have a place to communicate</h2>
                <span>{errors.channel}</span>
                <input type='text' value={channelName} onChange={e => setChannelName(e.target.value)} className="server-creation-input" placeholder="Ex: General Questions" />
            </div>
            <div>
                <h1 className="server-creation-header">Add a description for your new channel</h1>
                <h2 className="server-creation-subheader">Provide a helpful channel description (optional)</h2>
                <input type='text' value={channelDescription} onChange={e => setChannelDescription(e.target.value)} className="server-creation-input" placeholder="Ex: All general questions go here" />
            </div>
            <input type='submit' className="submit-server large-purple-button" value="Create New Server" />
        </form>
    )
}

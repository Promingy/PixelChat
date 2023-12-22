import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ServerCreationForm.css'
import { initializeServer, initializeChannel, uploadImage } from '../../redux/server'
import { Link } from "react-router-dom"
import { thunkAddUserServer } from '../../redux/session'


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
                await dispatch(thunkAddUserServer(serverData, sessionUser))
                return navigate(`/main/servers/${serverData.id}/channels/${channelData.id}`)
            } else {
                setErrors(serverData.errors)
            }
        }

        handleServerCreation(form)
    }

    return (
        <form className="server-creation-form" onSubmit={onSubmit} encType="multipart/form-data">
            <Link to="/landing" className="back-to-landing"><i className="fa-solid fa-chevron-left"></i><p>To landing page</p></Link>
            <img className="home-logo" src='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMSJHMEUCIQDPdS%2BefXZdp9FbxUNHyICmyFP9y1NNZI9befAVOFfAnwIgQFjgaE2rn07B1DdxctJ8S8%2BhuB91Cd64JK7y%2FuXwsJwq5AIIMRAAGgwwNTU4Njg2NTI4NTQiDGV9jbQG6qizrU3ZxSrBAvsaXviSSClP8Iz2XE9Ygb3cTuC3M0hI7%2BcUJBNusK38sWRCDTury0Ft2kKucoJXVbBPRZXISXxj0zHd0EB2%2FFk7Iwr27%2FHmIM1E1YuMmPgFi%2BT5wjyLKEc%2Bw2pUcs6v%2BZrj%2BAKgn5GFCJI4BkhtR6d0W%2Bx8ldeXnR8bDjwz72UdZF9aoUFN7r4PT3wrzztinQ6obV%2BLzCYDuCoyz%2FsbRe9aW3kI92%2BMxX2KftVK9KT3X4BuUd9VfdapA%2BTt0CopaEaD2ibHboJFtOwX8nLaFu0o7xw2Qz%2BSfa0fQ7i2Wj2j4EIcjTjirsKj5Fnh0cryc3go1N9efodOCeOZdrGyjU8EVcrgro3%2BJCbXDfXoGSJdPEjobYWxlK7hgGtwQYb%2FbfF%2Bk2FRk68tpcEwVHbvOJDk%2FX8L6V1fBgOCrT6a7ZahvzDo5ZasBjqzAk3J6mEXXJkZ46XR70Mt%2BjlD%2FjPJPUqUEU%2BcvqWDVFLdWD%2BcfAT00m%2BMwsPZYIl4yVnLD0obq%2BeS7eHxse1Hloua0iJx3AWuoK%2BwLn%2FM2lPZuS2%2Fx2g7ab8E6JLJQSKTwxDfeewJnr6cyDzDaFVht6bp5DmC8GoHvfjasRjTwEsqtMKZ53LkXd54V4JS2VSv4eprh9OPr3ttm%2BXyoVPBhr5Rr8eefCWkE73hwRXC5zJyku5fB%2F5LQWGA5HOUS2Csn1YJRjHW1VoY8318VviOpJwmgru63EftWigEqkGmBamo04z81laAd8HniHlLL9ONoMl4obgWLs4vzRUc%2B8wXXQo55DHV0ikzBWV%2FcZ%2Bt9PkfbVzRMRuZR4By1hrcVbwbGOWdYHhvvork9xPyV0yq7EG4crA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231222T192635Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ2AQH7U3EIWHM4OZ%2F20231222%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=8f076a980e1f6e1c7a5af5aa99854b5c41432138c97973d1ed4770290e5361f7' />
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

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { editServer, uploadImage, editChannel } from "../../redux/server"
import "./PutPopupFormModal.css"
import TextareaAutoSize from 'react-textarea-autosize'
import { useParams } from "react-router-dom"

export default function PutPopupFormModal({ inputType, target, socket }) {
    const server = useSelector(state => state.server)
    const sessionUser = useSelector(state => state.session.user)
    const { channelId } = useParams()
    const [content, setContent] = useState(target === "server" ? server[inputType] : server.channels[channelId][inputType])
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()
    const dispatch = useDispatch()

    console.log("~~~~~~~~~~~~~~", inputType, target)
    useEffect(() => {
        document.getElementById('mainInput').focus()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        if (target === "server") {
            let returnImage
            if (inputType === "image") {
                const formData = new FormData()
                formData.append("image", content)
                returnImage = await dispatch(uploadImage(formData))
            }

            const form = {
                name: (inputType === "name" ? content : server.name),
                description: (inputType === "description" ? content : server.description),
                image_url: (inputType === "image" ? returnImage.url : server.image_url)
            }

            const handleSubmission = async (serv, servId) => {
                const data = await dispatch(editServer(serv, servId))
                if (!data.errors) {
                    closeModal()
                    return
                } else {
                    setErrors(data.errors())
                    return
                }
            }

            handleSubmission(form, server.id)
        } else if (target === "channel") {

            const form = {
                name: server.channels[+channelId].name,
                topic: (inputType === "topic" ? content : server.channels[+channelId].topic),
                description: (inputType === "description" ? content : server.channels[+channelId].description),
            }
            const data = await dispatch(editChannel(form, +channelId))
            if (!data.errors) {
                socket.emit("server", {
                    userId: sessionUser.id,
                    type: "channel",
                    method: "PUT",
                    room: server.id,
                    channel: data
                })
                closeModal()
            }
            else {
                setErrors(data.errors)
                return
            }
        }

    }
    return (
        <div className="server-popup-form-wrapper">
            <h1>Edit {target} {inputType}</h1>
            <form onSubmit={handleSubmit} className="server-popup-form">
                {(inputType === "name" && target === "server") &&
                    <div className="server-modal-form-input-wrapper">
                        <input
                            id="mainInput"
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Add text here"
                            maxLength={30}
                            required
                        />
                        <div className="character-count">{content.length}/30</div>
                    </div>

                }

                {(inputType === "description" && target === "server") &&
                    <div className="server-modal-form-input-wrapper">
                        <TextareaAutoSize
                            id="mainInput"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Add text here"
                            maxLength={200}
                            required
                        />
                        <div className="character-count">{content.length}/200</div>
                    </div>
                }

                {(inputType === "image" && target === "server") && <input
                    id="mainInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setContent(e.target.files[0])}
                    required
                />}

                {(inputType === "topic" && target === "channel") &&
                    <div className="server-modal-form-input-wrapper">
                        <input
                            id="mainInput"
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Add a topic"
                            maxLength={50}
                            required
                        />
                        <div className="character-count">{content.length}/50</div>
                    </div>

                }

                {(inputType === "description" && target === "channel") &&
                    <div className="server-modal-form-input-wrapper">
                        <TextareaAutoSize
                            id="mainInput"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Add a description"
                            maxLength={200}
                            required
                        />
                        <div className="character-count">{content.length}/200</div>
                    </div>
                }

                {errors[inputType] && <span>{errors[inputType]}</span>}
                <div className="server-popup-form-button-wrapper">
                    <button onClick={() => closeModal()} className="server-popup-form-button server-popup-form-cancel">Cancel</button>
                    <input type="submit" className="server-popup-form-button server-popup-form-submit" value="Save" />
                </div>
            </form>
        </div>
    )
}

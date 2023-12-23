import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { editServer, uploadImage } from "../../redux/server"
import "./ServerPopupFormModal.css"
import TextareaAutoSize from 'react-textarea-autosize'

export default function ServerPopupFormModal({ type }) {
    const server = useSelector(state => state.server)
    const [content, setContent] = useState(server[type] || "")
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()
    const dispatch = useDispatch()

    useEffect(() => {
        document.getElementById('mainInput').focus()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        let returnImage
        if (type === "image") {
            const formData = new FormData()
            formData.append("image", content)
            returnImage = await dispatch(uploadImage(formData))
        }

        const form = {
            name: (type === "name" ? content : server.name),
            description: (type === "description" ? content : server.description),
            image_url: (type === "image" ? returnImage.url : server.image_url)
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
    }
    return (
        <div className="server-popup-form-wrapper">
            <h1>Edit server {type}</h1>
            <form onSubmit={handleSubmit} className="server-popup-form">
                {(type === "name") && <input
                    id="mainInput"
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add text here"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter'){
                            return handleSubmit(e)
                        }
                    }}
                    required
                />}

                {(type === "description") && <TextareaAutoSize
                    id="mainInput"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add text here"
                    onKeyUp={(e) => {
                        if (e.key ==='Enter') {
                            return handleSubmit(e)
                        }
                    }}
                    required
                />}

                {(type === "image") && <input
                    id="mainInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setContent(e.target.files[0])}
                    required
                />}

                {errors[type] && <span>{errors[type]}</span>}
                <div className="server-popup-form-button-wrapper">
                    <button onClick={() => closeModal()} className="server-popup-form-button server-popup-form-cancel">Cancel</button>
                    <input type="submit" className="server-popup-form-button server-popup-form-submit" value="Save" />
                </div>
            </form>
        </div>
    )
}

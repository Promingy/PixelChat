import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { removeServer } from "../../redux/server"
import { useState } from "react"
import "./ServerDeletionModal.css"
import { useNavigate } from "react-router-dom"

export default function ServerDeletionModal({ server }) {
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()

        const handleServerDelete = async (serverId) => {
            const res = await dispatch(removeServer(serverId))
            console.log(res)
            if (res.ok) {
                closeModal()
                navigate('/landing')
            }
        }

        handleServerDelete(server.id)
    }
    return (
        <div className="server-popup-delete-wrapper">
            <h1>Confirm server delete</h1>
            <h2>Are you sure you want to delete {server.name}?</h2>
            <form onSubmit={handleSubmit} className="server-popup-delete">

                {errors.server && <span>{errors.server}</span>}
                <div className="server-popup-delete-button-wrapper">
                    <button onClick={() => closeModal()} className="server-popup-modal-delete-button server-popup-modal-delete-cancel">Cancel</button>
                    <input type="submit" className="server-popup-modal-delete-button server-popup-modal-delete-submit" value="Confirm Delete" />
                </div>
            </form>
        </div>
    )
} 
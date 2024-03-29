import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { removeServer } from "../../redux/server"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./ServerDeletionModal.css"

export default function ServerDeletionModal({ server, socket }) {
    const [errors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const sessionUser = useSelector(state => state.session.user)


    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = {
            type: "server",
            method: "DELETE",
            room: +server.id,
            serverId: server.id,
            userId: sessionUser.id
        }

        const handleServerDelete = async (serverId) => {
            const res = await dispatch(removeServer(serverId))
            if (res.ok) {
                closeModal()
                navigate('/landing')
            }
        }

        handleServerDelete(server.id)
        socket.emit("server", payload)
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

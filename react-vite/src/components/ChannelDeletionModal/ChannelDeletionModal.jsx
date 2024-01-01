import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { removeChannel } from '../../redux/server'
import { useState } from "react"
import "./ChannelDeletion.css"
import { useNavigate, useParams } from "react-router-dom"

export default function ChannelDeletionModal({ socket, channel }) {
    const { channelId } = useParams()
    const server = useSelector(state => state.server)
    const session = useSelector(state => state.session)
    const sessionUser = session?.user
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const channels = server && Object.values(server.channels)

    const { closeModal } = useModal()

    const handleSubmit = (e) => {
        e.preventDefault()

        let newChannel;

        for (let chnl of channels) {
            if (chnl.id !== +channelId){
                newChannel = chnl
            }
        }

        dispatch(removeChannel(channelId)).then(() => {
            socket.emit("server", {
                userId: sessionUser.id,
                type: "channel",
                method: "DELETE",
                room: server.id,
                channelId,
                newChannel: `/main/servers/${server.id}/channels/${newChannel.id}`
            })
        }).then(navigate(`/main/servers/${server.id}/channels/${newChannel.id}`)).then(closeModal())
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
        })


    }
    return (
        <div className="server-popup-delete-wrapper">
            <h1>Confirm channel delete</h1>
            <h2>Are you sure you want to delete {channel?.name}?</h2>
            <form onSubmit={handleSubmit} className="server-popup-delete">

                {errors.channel && <span>{errors.channel}</span>}
                <div className="server-popup-delete-button-wrapper">
                    <button onClick={() => closeModal()} className="server-popup-modal-delete-button server-popup-modal-delete-cancel">Cancel</button>
                    <input type="submit" className="server-popup-modal-delete-button server-popup-modal-delete-submit" value="Confirm Delete" />
                </div>
            </form>
        </div>
    )
}

import { useSelector } from "react-redux"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import ServerPopupFormModal from "../ServerPopupFormModal"
import ServerDeletionModal from "../ServerDeletionModal"
import "./ServerPopupModal.css"

export default function ServerPopupModal() {
    const server = useSelector(state => state.server)
    const sessionUser = useSelector(state => state.session.user)
    return (
        <div className='server-popup'>
            <div className='server-popup-header'>
                <h1>{server.name}</h1>
            </div>
            <div className='server-popup-details-container'>
                <div className='server-modal-wrapper server-popup-name'>
                    <OpenModalButton
                        buttonText={<div className='server-popup-about-div'>
                            <div className='server-popup-about-div-left'>
                                <p>Server name</p>
                                {server.name}
                            </div>
                            <div className='server-popup-about-div-right'>
                                {(sessionUser.id == server.owner_id) && "Edit"}
                            </div>
                        </div>}
                        modalComponent={(sessionUser.id == server.owner_id) && <ServerPopupFormModal type="name" />}
                    />
                </div>
                <div className='server-modal-wrapper server-popup-description'>
                    <OpenModalButton
                        buttonText={<div className='server-popup-about-div'>
                            <div className='server-popup-about-div-left'>
                                <p>Description</p>
                                {server.description || "Add a description"}
                            </div>
                            <div className='server-popup-about-div-right'>
                                {(sessionUser.id == server.owner_id) && "Edit"}
                            </div>
                        </div>}
                        modalComponent={(sessionUser.id == server.owner_id) && <ServerPopupFormModal type="description" />}
                    />
                </div>
                <div className='server-modal-wrapper server-popup-image'>
                    <OpenModalButton
                        buttonText={<div className='server-popup-about-div'>
                            <div className='server-popup-about-div-left'>
                                <p>Server image</p>
                                {server.image_url}
                            </div>
                            <div className='server-popup-about-div-right'>
                                {(sessionUser.id == server.owner_id) && "Edit"}
                            </div>
                        </div>}
                        modalComponent={(sessionUser.id == server.owner_id) && <ServerPopupFormModal type="image" />}
                    />
                </div>
                {(sessionUser.id == server.owner_id) && <div className='server-modal-wrapper server-popup-delete'>
                    <OpenModalButton
                        buttonText={<div className='server-popup-about-div'>
                            <div className='server-popup-about-div-left'>
                                <p>Delete server</p>
                            </div>
                            <div className='server-popup-about-div-right'>
                            </div>
                        </div>}
                        modalComponent={(sessionUser.id == server.owner_id) && <ServerDeletionModal server={server} />}
                    />
                </div>}
            </div>
        </div>
    )
}
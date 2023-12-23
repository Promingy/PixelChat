import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PutPopupFormModal from '../PutPopupFormModal';
import ChannelDeletionModal from '../ChannelDeletionModal';
import { removeChannel } from '../../redux/server'
import { FaRegTrashAlt } from "react-icons/fa";
import { LuHeadphones } from "react-icons/lu";
import { IoIosLink } from "react-icons/io";
import './ChannelPopup.css'

function ChannelPopupModal({ activeProp, socket }) {
    const { channelId } = useParams()
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const server = useSelector(state => state.server)
    const channel = server?.channels?.[+channelId]
    const users = server?.users
    const session = useSelector(state => state.session)
    const sessionUser = session?.user
    const [active, setActive] = useState(activeProp)
    const [errors, setErrors] = useState({});
    // const { closeModal } = useModal();

    return (
        <div className='channel-popup'>
            <div className='channel-popup-header'>
                <h1><i className="fa-solid fa-hashtag"></i> {channel.name}</h1>
                <div className='channel-popup-tab-container'>
                    <h3 className={`channel-popup-tab${active == 1 ? " channel-popup-selected-tab" : ""}`} onClick={() => setActive(1)}>About</h3>
                    <h3 className={`channel-popup-tab${active == 2 ? " channel-popup-selected-tab" : ""}`} onClick={() => setActive(2)}>Members {Object.keys(users).length}</h3>
                    <h3 className={`channel-popup-tab${active == 3 ? " channel-popup-selected-tab" : ""}`} onClick={() => setActive(3)}>Settings</h3>
                </div>
            </div>
            <div className='channel-popup-content-wrapper'>
                {active === 1 ? active === 1 && sessionUser.id === channel.owner_id ? <div className='channel-popup-details-container'>
                    <div className='channel-popup-details-border'>
                        <div className='topic-modal-wrapper'>
                            <OpenModalButton
                                buttonText={<div className='channel-popup-about-div'>
                                    <div className='channel-popup-about-div-left'>
                                        <p>Topic</p>
                                        {channel.topic}
                                    </div>
                                    <div className='channel-popup-about-div-right'>
                                        Edit
                                    </div>
                                </div>}
                                modalComponent={<PutPopupFormModal socket={socket} inputType="topic" target="channel" />}
                            />
                        </div>
                    </div>
                    <div className='channel-popup-details-border'>
                        <div className='topic-modal-wrapper'>
                            <OpenModalButton
                                buttonText={<div className='channel-popup-about-div'>
                                    <div className='channel-popup-about-div-left'>
                                        <p>Description</p>
                                        {channel.description}
                                    </div>
                                    <div className='channel-popup-about-div-right'>
                                        Edit
                                    </div>
                                </div>}
                                modalComponent={<PutPopupFormModal socket={socket} inputType="description" target="channel" />}
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className='channel-popup-details'>Created by</h2>
                        <p className='channel-popup-details'>{users[channel.owner_id].first_name} {users[channel.owner_id].last_name}</p>
                    </div>
                </div> : <div className='channel-popup-details-container'>
                    <div className='channel-popup-details-border'>
                        <div className='topic-modal-wrapper'>
                            <h2 className='channel-popup-details'>Topic</h2>
                            <p className='channel-popup-details'>{channel.topic}</p>
                        </div>
                    </div>
                    <div className='channel-popup-details-border'>
                        <div className='topic-modal-wrapper'>
                            <h2 className='channel-popup-details'>Description</h2>
                            <p className='channel-popup-details'>{channel.description}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className='channel-popup-details'>Created by</h2>
                        <p className='channel-popup-details'>{users[channel.owner_id].first_name} {users[channel.owner_id].last_name}</p>
                    </div>
                </div> : null}
                {active === 2 ?
                    <div className='channel-members-wrapper'>
                        {Object.values(users).map((user) => (
                            <div key={user.id} className='channel-popup-member'>
                                <img className='popup-profile-pic' src={user.image_url} />
                                <p>{user.first_name} {user.last_name}</p>
                            </div>
                        ))}
                    </div>
                    : null}
                {active === 3 ?
                    <div>
                        <div className='channel-popup-details-container'>
                            <div className='channel-popup-details-border'>
                                <h2 className='channel-popup-details'>Huddles</h2>
                                <p className='channel-popup-details'>Members can start and join huddles in this channel. Learn more</p>
                                <div className='channel-popup-huddle-buttons'>
                                    <button onClick={() => (alert(`Feature Coming Soon...`))}><LuHeadphones />
                                        Start huddle</button>
                                    <button onClick={() => (alert(`Feature Coming Soon...`))}><IoIosLink />
                                        Copy huddle Link</button>
                                </div>
                            </div>
                            <div className='channel-popup-details-border'>
                                {(sessionUser.id == server.owner_id) && <div className='server-modal-wrapper server-popup-delete'>
                                    <OpenModalButton
                                        buttonText={<div className='server-popup-about-div'>
                                            <div className='server-popup-about-div-left'>
                                                <p><FaRegTrashAlt />  Delete this channel</p>
                                            </div>
                                            <div className='server-popup-about-div-right'>
                                            </div>
                                        </div>}
                                        modalComponent={(sessionUser.id == server.owner_id) && <ChannelDeletionModal server={server} />}
                                    />
                                </div>}
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default ChannelPopupModal

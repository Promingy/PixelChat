import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import TopicFormModal from '../TopicFormModal';
import DescriptionFormModal from '../DescriptionFormModal';
import { removeChannel } from '../../redux/server'
import { FaRegTrashAlt } from "react-icons/fa";
import './ChannelPopup.css'

function ChannelPopupModal({ activeProp, socket }) {
    const { channelId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector(state => state.server)
    const channel = store?.channels?.[+channelId]
    const users = store?.users
    const session = useSelector(state => state.session)
    const sessionUser = session?.user
    const [active, setActive] = useState(activeProp.activeProp)
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(removeChannel(channelId)).then(() => {
            socket.emit("server", {
                userId: sessionUser.id,
                type: "channel",
                method: "DELETE",
                room: store.id,
                channelId
            })
        }).then(() => {
            navigate(`/landing`)
        }).then(closeModal()).catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors)
            }
        })
    }

    return (
        <div className='channel-popup'>
            <div className='channel-popup-header'>
                <h1># {channel.name}</h1>
                <div className='channel-popup-tab-container'>
                    <h3 className='channel-popup-tab' onClick={() => setActive(1)}>About</h3>
                    <h3 className='channel-popup-tab' onClick={() => setActive(2)}>Members {Object.keys(users).length}</h3>
                    <h3 className='channel-popup-tab' onClick={() => setActive(3)}>Integrations</h3>
                    <h3 className='channel-popup-tab' onClick={() => setActive(4)}>Settings</h3>
                </div>
            </div>
            {active === 1 ?
                <div className='channel-popup-details-container'>
                    <div className='channel-popup-details-border'>
                        <h2 className='channel-popup-details'>Topic</h2>
                        <p className='channel-popup-details'>{channel.topic}</p>
                        <OpenModalButton
                            buttonText={'edit'}
                            modalComponent={<TopicFormModal socket={socket} />}
                        />
                    </div>
                    <div className='channel-popup-details-border'>
                        <h2 className='channel-popup-details'>Description</h2>
                        <p className='channel-popup-details'>{channel.description}</p>
                        <OpenModalButton
                            buttonText={'edit'}
                            modalComponent={<DescriptionFormModal />}
                        />
                    </div>
                    <div>
                        <h2 className='channel-popup-details'>Created by</h2>
                        <p className='channel-popup-details'>{users[channel.owner_id].first_name} {users[channel.owner_id].last_name}</p>
                    </div>
                </div> : null}
            {active === 2 ? Object.values(users).map((user) => (
                <div key={user.id} className='channel-popup-members-container'>
                    <img className='popup-profile-pic' src={user.image_url} />
                    <p>{user.first_name} {user.last_name}</p>
                </div>
            )) : null}
            {active === 3 ?
                <div>
                    <div className='channel-popup-details-container'>
                        <h2 className='channel-popup-details'>Supercharge your channel PRO</h2>
                        <p className='channel-popup-details'>There&apos;s a few automations that will make your life easier. Set them up in a flash.</p>
                        <button onClick={() => (alert(`Feature Coming Soon...`))}>See Upgrade Options</button>
                    </div>
                    <div className='channel-popup-details-container'>
                        <h2 className='channel-popup-details'>Apps</h2>
                        <p className='channel-popup-details'>Bring the tools you need into this channel to pull reports, start calls, file tickets and more.</p>
                        <button onClick={() => (alert(`Feature Coming Soon...`))}>Add an App</button>
                    </div>
                    <div className='channel-popup-details-container'>
                        <h2 className='channel-popup-details'>Send emails to this channel PRO</h2>
                        <p className='channel-popup-details'>Get an email address that posts incoming emails in this channel.</p>
                        <button onClick={() => (alert(`Feature Coming Soon...`))}>See Upgrade Options</button>
                    </div>
                </div> : null}
            {active === 4 ?
                <div>
                    <div className='channel-popup-details-container'>
                        <h2 className='channel-popup-details'>Posting Permissions</h2>
                        <ul>
                            <li>Everyone except guests can post</li>
                            <li>No one can reply to messages</li>
                            <li>Only Server Owners can use @everyone mentions</li>
                        </ul>
                        <p className='channel-popup-details'>Learn more</p>
                    </div>
                    <div className='channel-popup-details-container'>
                        <h2 className='channel-popup-details'>Huddles</h2>
                        <p className='channel-popup-details'>Members can start and join huddles in this channel. Learn more</p>
                        <button onClick={() => (alert(`Feature Coming Soon...`))}>Start huddle</button>
                        <button onClick={() => (alert(`Feature Coming Soon...`))}>Copy huddle Link</button>
                    </div>
                </div> : null}
            {active === 4 && sessionUser.id === channel.owner_id ?
                <div className='channel-popup-delete-button'>
                    <button onClick={handleDelete}><FaRegTrashAlt />Delete this channel</button>
                    {errors.message && <p>{errors.message}</p>}
                </div> : null}
        </div>
    )
}

export default ChannelPopupModal

import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import TopicFormModal from '../TopicFormModal';
import DescriptionFormModal from '../DescriptionFormModal';
import { removeChannel } from '../../redux/server'
import './ChannelPopup.css'

function ChannelPopupModal(activeProp) {
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
            <h1>{channel.name}</h1>
            <div className='channel-popup-tab-container'>
                <h3 className='channel-popup-tab' onClick={() => setActive(1)}>About</h3>
                <h3 className='channel-popup-tab' onClick={() => setActive(2)}>Members {Object.keys(users).length}</h3>
                <h3 className='channel-popup-tab' onClick={() => setActive(3)}>Integrations</h3>
                <h3 className='channel-popup-tab' onClick={() => setActive(4)}>Settings</h3>
            </div>
            {active === 1 ?
                <div>
                    <h2>Topic</h2>
                    <p>{channel.topic}</p>
                    <OpenModalButton
                    buttonText={'edit'}
                    modalComponent={<TopicFormModal />}
                />
                    <h2>Description</h2>
                    <p>{channel.description}</p>
                    <OpenModalButton
                    buttonText={'edit'}
                    modalComponent={<DescriptionFormModal />}
                />
                    <h2>Created by</h2>
                    <p>{users[channel.owner_id].first_name} {users[channel.owner_id].last_name}</p>
                </div> : null}
            {active === 2 ? Object.values(users).map((user) => (
                <div key={user.id}>
                    <img className='popup-profile-pic' src={user.image_url} />
                    <p>{user.first_name} {user.last_name}</p>
                </div>
            )) : null}
            {active === 3 ?
            <div>
                <div>
                    <h2>Supercharge your channel PRO</h2>
                    <p>There&apos;s a few automations that will make your life easier. Set them up in a flash.</p>
                    <button onClick={() => (alert(`Feature Coming Soon...`))}>See Upgrade Options</button>
                </div>
                <div>
                    <h2>Apps</h2>
                    <p>Bring the tools you need into this channel to pull reports, start calls, file tickets and more.</p>
                    <button onClick={() => (alert(`Feature Coming Soon...`))}>Add an App</button>
                </div>
                <div>
                    <h2>Send emails to this channel PRO</h2>
                    <p>Get an email address that posts incoming emails in this channel.</p>
                    <button onClick={() => (alert(`Feature Coming Soon...`))}>See Upgrade Options</button>
                </div>
            </div> : null}
            {active === 4 ?
            <div>
                <h2>Posting Permissions</h2>
                <ul>
                    <li>Everyone except guests can post</li>
                    <li>No one can reply to messages</li>
                    <li>Only Server Owners can use @everyone mentions</li>
                </ul>
                <p>Learn more</p>
                <h2>Huddles</h2>
                <p>Members can start and join huddles in this channel. Learn more</p>
                <button onClick={() => (alert(`Feature Coming Soon...`))}>Start huddle</button>
                <button onClick={() => (alert(`Feature Coming Soon...`))}>Copy huddle Link</button>
            </div> : null}
            {active === 4 && sessionUser.id === channel.owner_id ?
            <div className='channel-popup-delete-button'>
                <button onClick={handleDelete}>Delete this channel</button>
                {errors.message && <p>{errors.message}</p>}
            </div> : null}
        </div>
    )
}

export default ChannelPopupModal

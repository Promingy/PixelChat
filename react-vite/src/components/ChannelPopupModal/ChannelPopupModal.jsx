import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useModal } from "../../context/Modal";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import TopicFormModal from '../TopicFormModal';
import DescriptionFormModal from '../DescriptionFormModal';

function ChannelPopupModal() {
    const { channelId } = useParams()
    const dispatch = useDispatch();
    const store = useSelector(state => state.server)
    const channel = store?.channels?.[+channelId]
    const users = store?.users
    const [active, setActive] = useState(1)
    const { closeModal } = useModal();

    return (
        <>
            <h1>{channel.name}</h1>
            <div>
                <h3 onClick={() => setActive(1)}>About</h3>
                <h3 onClick={() => setActive(2)}>Members {Object.keys(users).length}</h3>
                <h3 onClick={() => setActive(3)}>Integrations</h3>
                <h3 onClick={() => setActive(4)}>Settings</h3>
            </div>
            {active === 1 ?
                <div>
                    {/* Own component? */}
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
        </>
    )
}

export default ChannelPopupModal

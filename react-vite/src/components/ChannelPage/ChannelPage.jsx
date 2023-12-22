import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './ChannelPage.css'
import MessageTile from "./MessageTile";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ChannelPopupModal from "../ChannelPopupModal/ChannelPopupModal";
import MessageBox from '../MessageBox'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getMessages } from "../../redux/server";


export default function ChannelPage({ socket }) {
    const dispatch = useDispatch()
    const { channelId } = useParams()
    const server = useSelector(state => state.server)
    const channel = server?.channels?.[+channelId]
    const messages = server?.channels?.[+channelId]?.messages
    const users = server?.users
    const [ offset, setOffset ] = useState(15)
    const [theme, setTheme] = useState("light");

    useEffect(() => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }, []);

    document.documentElement.className = `theme-${theme}`;

    function generate_message_layout() {
        // func to iterate over all messages for a channel
        // and create a tile component

        const sortedMessages = messages && Object.values(messages).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const result = []

        // set params for the days, month, and dateSuffixes for proper formatting
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const dateSuffix = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd' }

        // iterate over messages and grab the key as index
        if (sortedMessages) {
            for (let i = 0; i < sortedMessages.length; i++) {
                const message = sortedMessages[i]
                const user = users[message.user_id]

                // ordered backwards. So i + 1 should be an older date
                const prev_date = new Date(sortedMessages[i + 1]?.created_at)
                const curr_date = new Date(sortedMessages[i].created_at)

                // add a seperator for a messages posted on different days
                if ((prev_date.getDate() !== curr_date.getDate())) {
                    result.push(
                        <div key={message.id}>
                                <p className='message-date-seperator'>{days[curr_date.getDay()]}, {months[curr_date.getMonth()]} {curr_date.getDate()}{dateSuffix[curr_date.getDate()] || 'th'}</p>
                                {/* <div className="date-seperator-bar"/> */}
                            <MessageTile
                                message={message}
                                user={user}
                                channelId={channelId}
                                socket={socket}
                                server={server}
                                bottom={i < 2}
                                center={i === 2}
                                />
                        </div>
                    )
                    continue
                } else {
                    result.push(
                    <div key={message.id}>
                        <MessageTile
                            message={message}
                            user={user}
                            channelId={channelId}
                            socket={socket}
                            server={server}
                            bottom={i < 2}
                            center={i === 2}
                            />
                    </div>
                    )
                }

            }
        }
        return result
    }


    // Scroll to bottom of the page on initial load
    useEffect(() => {
        const element = document.querySelector('.all-messages-container')
        element.scrollTo(0, element.scrollHeight)
    }, [messages, channelId])

    // reset offset on channelId switch, for infinite scroll!
    useEffect(() => {
        setOffset(15)
    }, [channelId])


    return (
        <>
            <div className="channel-page-wrapper">
                <OpenModalButton
                    buttonText={channel?.name}
                    modalComponent={<ChannelPopupModal activeProp={1} socket={socket} />}
                />
                {users && <OpenModalButton
                    buttonText={`${Object.keys(users).length} Members`}
                    modalComponent={<ChannelPopupModal activeProp={2} socket={socket} />}
                />}
            <div className="all-messages-container" id='all-messages-container'>
                {generate_message_layout()}

                {messages && <InfiniteScroll
                    dataLength={Object.values(messages).length}
                    hasMore={!(Object.values(messages).length % 15)}
                    next={() => {
                        dispatch(getMessages(channelId, `offset=${offset}`))
                        setOffset(prevOffset => prevOffset += 15)
                    }}
                    inverse={true}
                    scrollableTarget='all-messages-container'
                    endMessage={<h3 style={{textAlign: 'center'}}>No more messages.</h3>}
                    />}
                </div>
                <MessageBox socket={socket} serverId={server.id} channelName={channel?.name} channelId={channelId} />
            </div>
        </>
    )
}

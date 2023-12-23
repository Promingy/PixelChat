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
    const [offset, setOffset] = useState(15)
    const [theme, setTheme] = useState("light");
    // const [emojiBox, setEmojiBox] = useState(false)
    // const [emojiBoxHeight, setEmojiBoxHeight] = useState(0)

    // const messagesContainer = document.getElementsByClassName('all-messages-container')[[0]]


    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    // function handleEmojiBox(e) {
    //     e.preventDefault()
    //     console.log("~~~~~", e.clientY)
    //     let emojiHeight = e.clientY - 30
    //     if (window.innerHeight - emojiHeight < 500) {
    //         emojiHeight = window.innerHeight - 500
    //     }
    //     setEmojiBoxHeight(emojiHeight)
    //     setTimeout(() => {
    //         setEmojiBox(false)
    //         window.removeEventListener('mousedown', handleEmojiBox)
    //         messagesContainer.removeEventListener('scroll', handleEmojiBox)
    //     }, 1 * 58)
    // }


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
                if ((prev_date.getDate() !== curr_date.getDate()) ||
                    (prev_date.getFullYear() !== curr_date.getFullYear()) ||
                    (prev_date.getMonth() !== curr_date.getMonth())) {

                    result.push(
                        <div key={message.id}>
                            <div className="date-wrapper">
                                <p className='message-date-separator'>{days[curr_date.getDay()]}, {months[curr_date.getMonth()]} {curr_date.getDate()}{dateSuffix[curr_date.getDate()] || 'th'}</p>
                                <div className="date-divider" />
                            </div>
                            {/* <div className="date-separator-bar"/> */}
                            <MessageTile
                                message={message}
                                user={user}
                                channelId={channelId}
                                socket={socket}
                                // emojiBox={emojiBox}
                                // setEmojiBox={setEmojiBox}
                                // handleEmojiBox={handleEmojiBox}
                                // messagesContainer={messagesContainer}
                                // emojiBoxHeight={emojiBoxHeight}
                                // setEmojiBoxHeight={setEmojiBoxHeight}
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
                                // emojiBox={emojiBox}
                                // setEmojiBox={setEmojiBox}
                                // handleEmojiBox={handleEmojiBox}
                                // messagesContainer={messagesContainer}
                                // emojiBoxHeight={emojiBoxHeight}
                                // setEmojiBoxHeight={setEmojiBoxHeight}
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
            {/* {emojiBox &&
                <div className={'emoji-box'} onMouseLeave={() => setEmojiBox(!emojiBox)} style={{ 'top': `${emojiBoxHeight}px` }}>
                    <EmojiPicker

                        //if an emoji is selected through the picker, add it to the database!
                        onEmojiClick={(e) => {
                            //remove the reaction if user has already used it
                            setEmojiBox(!emojiBox)
                            for (let reaction of Object.values(message.reactions)) {
                                if (reaction.user_id == sessionUser.id && reaction.emoji == e.emoji) {
                                    return dispatch(removeReaction(channelId, message.id, reaction.id)).then(() => {
                                        const payload = {
                                            type: 'reaction',
                                            method: 'DELETE',
                                            room: +server?.id,
                                            channelId,
                                            messageId: message.id,
                                            reactionId: reaction.id
                                        }

                                        socket.emit("server", payload)
                                    })
                                }
                            }
                            // if user hasn't used this reaction already, add reaction
                            return dispatch(initializeReaction(channelId, message.id, { emoji: e.emoji })).then(res => {
                                const payload = {
                                    type: 'reaction',
                                    method: 'POST',
                                    room: +server?.id,
                                    channelId,
                                    reaction: res
                                }
                                socket.emit("server", payload)
                            })
                        }} />
                </div>} */}

            <div className="channel-page-wrapper">
                <div className="channel-page-button-container">
                    <OpenModalButton
                        buttonText={<div className="channel-page-first-button">
                            <i className="fa-solid fa-hashtag"></i>
                            {channel?.name}
                            <i className="fa-solid fa-angle-down channel-page-button-arrow"></i>
                        </div>}
                        modalComponent={<ChannelPopupModal activeProp={1} socket={socket} />}
                    />
                    {users && <OpenModalButton
                        buttonText={`${Object.keys(users).length} Members`}
                        modalComponent={<ChannelPopupModal activeProp={2} socket={socket} />}
                    />}
                </div>
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
                        endMessage={<h3 style={{ textAlign: 'center' }}>No more messages.</h3>}
                    />}
                </div>
                <MessageBox socket={socket} serverId={server.id} channelName={channel?.name} channelId={channelId} />
            </div>
        </>
    )
}

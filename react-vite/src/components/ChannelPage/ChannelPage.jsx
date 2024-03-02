import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './ChannelPage.css'
import MessageTile from "./MessageTile";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ChannelPopupModal from "../ChannelPopupModal/ChannelPopupModal";
import MessageBox from '../MessageBox'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getMessages, getDirectMessages } from "../../redux/server";
import { loadServer } from "../../redux/server";



export default function ChannelPage({ socket, serverId, setShowNavBar, showNavBar, type }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { channelId } = useParams()
    const sessionUser = useSelector((state) => state.session.user);
    const server = useSelector(state => state.server)
    const channel = server?.channels?.[+channelId]
    const messages = server?.channels?.[+channelId]?.messages
    const room = server?.direct_rooms?.[+channelId]
    const directMessages = server?.direct_rooms?.[+channelId]?.messages
    const users = server?.users
    const [offset, setOffset] = useState(15)
    console.log(server?.channels)

    useEffect(() => {
        dispatch(loadServer(serverId))
            .then(server => {
                const channels = {}
                const direct_rooms = {}
                if (server.channels) {
                    for (let channel of Object.values(server.channels)) {
                        channels[channel.id] = channel
                    }
                }
                if (server.direct_rooms) {
                    for (let direct_room of Object.values(server.direct_rooms)) {
                        direct_rooms[direct_room.id] = direct_room
                    }
                }
                // add direct rooms

                if (!server || type === "channel" && !channels[channelId] || type === "message" && !direct_rooms[channelId]) {
                    return navigate('/redirect')
                }
            })
    }, [dispatch, channelId, navigate, serverId])

    function generate_message_layout() {
        // func to iterate over all messages for a channel
        // and create a tile component

        const sortedMessages = (type === "channel" && messages && Object.values(messages).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))) || (type === "message" && directMessages && Object.values(directMessages).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
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
                            <div className='date-wrapper'>
                                <p className='message-date-separator'>{days[curr_date.getDay()]}, {months[curr_date.getMonth()]} {curr_date.getDate()}{dateSuffix[curr_date.getDate()] || 'th'}</p>
                                <div className='date-divider' />
                            </div>
                            {/* <div className="date-separator-bar"/> */}
                            <MessageTile
                                message={message}
                                user={user}
                                channelId={channelId}
                                socket={socket}
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

    // create direct rooms version of above


    // Scroll to bottom of the page on initial load
    useEffect(() => {
      if (type === "channel") {
        const element = document.querySelector('.all-messages-container')
        element.scrollTo(0, element.scrollHeight)
      }
    }, [messages, channelId])

    // reset offset on channelId switch, for infinite scroll!
    useEffect(() => {
        setOffset(15)
    }, [channelId])

    // create direct rooms version of above???


    if (type === "channel") return (
      <>
        <button className={`open-nav-bar${showNavBar ? ' do-not-show' : ''}`} onClick={()=>{setShowNavBar(true)}}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
        <div className={`close-nav-bar${showNavBar ? ' do-show' : ''}`} onClick={()=>{setShowNavBar(false)}}></div>
        <div className="channel-page-wrapper">
          <div
            className='channel-page-button-container'
          >
            <OpenModalButton
              buttonText={
                <div className="channel-page-first-button">
                  <i className="fa-solid fa-hashtag"></i>
                  {channel?.name}
                  <i className="fa-solid fa-angle-down channel-page-button-arrow"></i>
                </div>
              }
              modalComponent={
                <ChannelPopupModal activeProp={1} socket={socket} />
              }
            />
            {users && (
              <OpenModalButton
                buttonText={
                  <div className="channel-members-button-wrapper">
                    {Object.values(server.users)
                      .slice(0, 3)
                      .map((user) => (
                        <div
                          className="member-button-image-wrapper"
                          key={user.id}
                        >
                          <img src={user.image_url} />
                        </div>
                      ))}

                    {`${Object.keys(users).length}`}
                  </div>
                }
                modalComponent={
                  <ChannelPopupModal activeProp={2} socket={socket} />
                }
              />
            )}
          </div>
          <div className="all-messages-container" id="all-messages-container">
            {generate_message_layout()}

            {messages && (
              <InfiniteScroll
                dataLength={Object.values(messages).length}
                hasMore={!(Object.values(messages).length % 15)}
                next={() => {
                  dispatch(getMessages(channelId, `offset=${offset}`));
                  setOffset((prevOffset) => (prevOffset += 15));
                }}
                inverse={true}
                scrollableTarget="all-messages-container"
                endMessage={
                  <h3 style={{ textAlign: "center" }}>No more messages.</h3>
                }
              />
            )}
          </div>
          <MessageBox
            socket={socket}
            serverId={server.id}
            channelName={channel?.name}
            channelId={channelId}
          />
        </div>
      </>
    );

    if (type === "message") return (
      <>
        <button className={`open-nav-bar${showNavBar ? ' do-not-show' : ''}`} onClick={()=>{setShowNavBar(true)}}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
        <div className={`close-nav-bar${showNavBar ? ' do-show' : ''}`} onClick={()=>{setShowNavBar(false)}}></div>
        <div className="channel-page-wrapper">
          <div
            className='channel-page-button-container'
          >
            <OpenModalButton
              buttonText={
                <div className="channel-page-first-button">
                  {room ? sessionUser.id === room.owner_1_id ? <p>{users[room.owner_2_id].first_name} {users[room.owner_2_id].last_name}</p> : <p>{users[room.owner_1_id].first_name} {users[room.owner_1_id].last_name}</p> : <p>No Room</p>}
                  <i className="fa-solid fa-angle-down channel-page-button-arrow"></i>
                </div>
              }
              // modalComponent={
              //   <ChannelPopupModal activeProp={1} socket={socket} />
              // }
            />
          </div>
          <div className="all-messages-container" id="all-messages-container">
            {generate_message_layout()}

            {directMessages && (
              <InfiniteScroll
                dataLength={Object.values(directMessages).length}
                hasMore={!(Object.values(directMessages).length % 15)}
                next={() => {
                  dispatch(getDirectMessages(channelId, `offset=${offset}`));
                  setOffset((prevOffset) => (prevOffset += 15));
                }}
                inverse={true}
                scrollableTarget="all-messages-container"
                endMessage={
                  <h3 style={{ textAlign: "center" }}>No more messages.</h3>
                }
              />
            )}
          </div>
          <MessageBox
            socket={socket}
            serverId={server.id}
            channelName={channel?.name}
            channelId={channelId}
          />
        </div>
      </>
    );

    else return (<h1>Hi from Messages</h1>)
}

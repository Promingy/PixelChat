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
import ReactSearchBox from 'react-search-box'
import { initializeDirectRoom } from '../../redux/server';

export default function ChannelPage({ socket, serverId, setShowNavBar, showNavBar, type, openUserModal }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { channelId } = useParams()
    const sessionUser = useSelector((state) => state.session.user);
    const server = useSelector(state => state.server)
    const channel = server?.channels?.[+channelId]
    const messages = server?.channels?.[+channelId]?.messages
    const room = server?.direct_rooms?.[+channelId]
    const directMessages = server?.direct_rooms?.[+channelId]?.messages
    const direct_rooms = useSelector((state) => state.server.direct_rooms)

    const users = server?.users
    const [offset, setOffset] = useState(15)
    const [searchData, setSearchData] = useState({});

    useEffect(() => {
        if (server.id && !server?.direct_rooms && !server?.channels) {
            return navigate('/redirect')
        }
    }, [server, navigate])

    useEffect(() => {
        const newMessageToWrapper = document.getElementsByClassName('new-message-to-wrapper')
        if (type == 'new') {
            newMessageToWrapper[0].children[0].children[0].children[0].children[0].focus()
        }
    }, [type])

    useEffect(() => {
        let data = []
        if (server.users) {
            for (let user of Object.values(server.users)) {
                if (user.id == sessionUser.id) continue
                data.push({
                    key: `${user.first_name} ${user.last_name}`,
                    value: `${user.first_name} ${user.last_name}`,
                    type: 'user',
                    id: user.id
                })
            }
        }
        setSearchData(data)
    }, [server, sessionUser])

    const handleDirectMessageSearchSelect = (target) => {
        const otherUserId = target.item.id
        if (direct_rooms[otherUserId]) return navigate(`/main/servers/${serverId}/direct-messages/${otherUserId}`)

        const form = {
            owner_2_id: otherUserId
        }

        const handleDirectRoomCreation = async (room) => {

            const roomData = await dispatch(initializeDirectRoom(serverId, room, otherUserId))
            if (!roomData.errors) {
                const joinPayload = {
                    room: `user-${otherUserId}`,
                    user: sessionUser,
                    serverId: serverId
                }

                socket.emit("join", { room: `user-${otherUserId}`, user: joinPayload })

                const messagePayload = {
                    type: 'room',
                    method: 'POST',
                    userId: sessionUser.id,
                    room: `user-${otherUserId}`,
                    data: roomData
                }

                socket.emit("server", messagePayload)

                socket.emit("leave", { room: `user-${otherUserId}` })
                return navigate(`/main/servers/${serverId}/direct-messages/${otherUserId}`)
            } else {
                console.error(roomData.errors)
            }
        }
        handleDirectRoomCreation(form)

    }

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
                            <MessageTile
                                message={message}
                                user={user}
                                channelId={channelId}
                                socket={socket}
                                bottom={i < 2}
                                center={i === 2}
                                type={type}
                                otherUserId={sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id}
                                openUserModal={openUserModal}
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
                                type={type}
                                otherUserId={sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id}
                                openUserModal={openUserModal}
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
    // useEffect(() => {
    //   const element = document.querySelector('.all-messages-container')
    //   element.scrollTo(0, element.scrollHeight)
    // }, [messages, channelId])

    // reset offset on channelId switch, for infinite scroll!
    useEffect(() => {
        setOffset(15)
    }, [channelId])

    // create direct rooms version of above???


    if (type === "channel" && channel) return (
      <>
        <button
          className={`open-nav-bar${showNavBar ? " do-not-show" : ""}`}
          onClick={() => {
            setShowNavBar(true);
          }}
        >
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
        <div
          className={`close-nav-bar${showNavBar ? " do-show" : ""}`}
          onClick={() => {
            setShowNavBar(false);
          }}
        ></div>
        <div className="channel-page-wrapper">
          <div className="channel-page-button-container">
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
            <div className="intro-profile-container">
              <p style={{fontSize:"28px", fontWeight:"900", marginBottom:"0"}}>
              <i className="fa-solid fa-hashtag"></i> {" "}
              {channel?.name} channel</p>
              <p style={{marginTop:"5px"}}>
               {channel?.description? channel?.description:`This is the very beginning of # ${channel?.name}`}
              </p>
            </div>
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
              />
            )}
          </div>
          <MessageBox
            socket={socket}
            serverId={server.id}
            channelName={channel?.name}
            channelId={channelId}
            type={type}
          />
        </div>
      </>
    );

    if (type === "message" && room) return (
        <>
            <button
                className={`open-nav-bar${showNavBar ? " do-not-show" : ""}`}
                onClick={() => {
                    setShowNavBar(true);
                }}
            >
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
            <div
                className={`close-nav-bar${showNavBar ? " do-show" : ""}`}
                onClick={() => {
                    setShowNavBar(false);
                }}
            ></div>
            <div className="channel-page-wrapper">
                <div className="channel-page-button-container">
                    <button onClick={() => {
                                    openUserModal(sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id);
                                }}>
                        <div className="channel-page-first-button">
                            {room ? (
                                sessionUser.id === room.owner_1_id ? (
                                    <div className="first-button-wrapper">
                                        <img
                                            className="top-profile-pic"
                                            src={users[room.owner_2_id].image_url}
                                            alt="User Icon"
                                        ></img>
                                        <p>
                                            {users[room.owner_2_id].first_name}{" "}
                                            {users[room.owner_2_id].last_name}
                                        </p>
                                    </div>
                                    ) : (
                                        <div className="first-button-wrapper">
                                            <img
                                                className="top-profile-pic"
                                                src={users[room.owner_1_id].image_url}
                                                alt="User Icon"
                                            ></img>
                                            <p>
                                                {users[room.owner_1_id].first_name}{" "}
                                                {users[room.owner_1_id].last_name}
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <p>No Room</p>
                                )}
                            <i className="fa-solid fa-angle-down channel-page-button-arrow"></i>
                        </div>
                    </button>
                </div>
                <div className="all-messages-container" id="all-messages-container">
                    {generate_message_layout()}
                    <div className="intro-profile-container">
                        <div className="intro-profile-wrapper">
                            <img
                                className="intro-profile-pic"
                                src={sessionUser.id === room.owner_1_id ? (users[room.owner_2_id].image_url) : (users[room.owner_1_id].image_url)}
                                alt="User Icon"
                                onClick={() => {
                                    openUserModal(sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id);
                                }}
                            ></img>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                                {sessionUser.id === room.owner_1_id ? users[room.owner_2_id].first_name + " " + users[room.owner_2_id].last_name :
                                    users[room.owner_1_id].first_name + " " + users[room.owner_1_id].last_name}
                            </div>
                        </div>
                        <p>
                            This conversation is just between{" "}
                            <button
                                className="hyper-link-button"
                                onClick={() => {
                                    openUserModal(sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id);
                                }}
                            >
                                @{sessionUser.id === room.owner_1_id ? users[room.owner_2_id].first_name + " " + users[room.owner_2_id].last_name :
                                    users[room.owner_1_id].first_name + " " + users[room.owner_1_id].last_name}
                            </button>{" "}
                            and you. Check out their profile to learn more about them.
                        </p>
                        <button
                            className="view-profile-button"
                            onClick={() => {
                                openUserModal(sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id);
                            }}
                        >
                            View Profile
                        </button>
                    </div>
                    {directMessages && (
                        <InfiniteScroll
                            dataLength={Object.values(directMessages).length}
                            hasMore={!(Object.values(directMessages).length % 15)}
                            next={() => {
                                dispatch(
                                    getDirectMessages(room.id, `offset=${offset}`, channelId)
                                );
                                setOffset((prevOffset) => (prevOffset += 15));
                            }}
                            inverse={true}
                            scrollableTarget="all-messages-container"
                        />
                    )}
                </div>
                <MessageBox
                    socket={socket}
                    serverId={server.id}
                    channelName={
                        room
                            ? room?.owner_1_id === sessionUser?.id
                                ? `${users[room?.owner_2_id]?.first_name} ${users[room?.owner_2_id]?.last_name
                                }`
                                : `${users[room?.owner_1_id]?.first_name} ${users[room?.owner_1_id]?.last_name
                                }`
                            : "Undefined"
                    }
                    channelId={channelId}
                    type={type}
                    otherUserId={
                        sessionUser?.id === room?.owner_1_id
                            ? room?.owner_2_id
                            : room?.owner_1_id
                    }
                />
            </div>
        </>
    );

    if (type === "new") return (
        <>
            <button className={`open-nav-bar${showNavBar ? ' do-not-show' : ''}`} onClick={() => { setShowNavBar(true) }}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
            <div className={`close-nav-bar${showNavBar ? ' do-show' : ''}`} onClick={() => { setShowNavBar(false) }}></div>
            <div className="channel-page-wrapper">
                <div
                    className='channel-page-button-container'
                >
                    <button>New message</button>
                </div>
                <div
                    className='channel-page-button-container'>
                    <div className="new-message-to-wrapper">
                        To:
                        <ReactSearchBox
                            id='searchBox'
                            data={searchData}
                            placeholder="@somebody"
                            onSelect={(record) => handleDirectMessageSearchSelect(record)}
                            clearOnSelect={true}
                        />
                    </div>
                </div>
                <div className="all-messages-container" id="all-messages-container">
                    {generate_message_layout()}

                    {directMessages && (
                        <InfiniteScroll
                            dataLength={Object.values(directMessages).length}
                            hasMore={!(Object.values(directMessages).length % 15)}
                            next={() => {
                                dispatch(getDirectMessages(channelId, `offset=${offset}`, channelId));
                                setOffset((prevOffset) => (prevOffset += 15));
                            }}
                            inverse={true}
                            scrollableTarget="all-messages-container"
                            // endMessage={
                            //     <h3 style={{ textAlign: "center" }}>No more messages.</h3>
                            // }
                        />
                    )}
                </div>
                <MessageBox
                    socket={socket}
                    serverId={server.id}
                    channelName={room ? room?.owner_1_id === sessionUser?.id ? `${users[room?.owner_2_id]?.first_name} ${users[room?.owner_2_id]?.last_name}` : `${users[room?.owner_1_id]?.first_name} ${users[room?.owner_1_id]?.last_name}` : "Undefined"}
                    channelId={channelId}
                    type={type}
                    otherUserId={sessionUser?.id === room?.owner_1_id ? room?.owner_2_id : room?.owner_1_id}
                />
            </div>
        </>
    );

    else return (null)
}

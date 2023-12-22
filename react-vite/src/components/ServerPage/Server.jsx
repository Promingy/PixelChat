import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { loadAllServers } from "../../redux/all_servers"
import { io } from 'socket.io-client';
import { loadServer, deleteChannel, createChannel, updateChannel, deleteMessage, createMessage, deleteReaction, createReaction, boldChannel } from "../../redux/server"
import ChannelPage from "../ChannelPage"
import InnerNavbar from "../InnerNavbar/InnerNavbar"
import OuterNavbar from "../OuterNavbar"
import "./Server.css"

let socket

function checkChannelIfSelected(channelId) {
    const fullId = `channel${channelId}`
    let channelToBold = document.getElementById(fullId)
    if (channelToBold.classList.contains("not-selected-channel")) {
        return false
    }
    return true
}

export default function ServerPage() {
    const dispatch = useDispatch()
    const { serverId } = useParams()
    // const [boldObj, setBoldObj] = useState({})


    const server = useSelector(state => state.server)
    const sessionUser = useSelector(state => state.session.user)


    // Eager load all data for the server
    useEffect(() => {
        dispatch(loadServer(serverId))
        dispatch(loadAllServers())
    }, [dispatch, serverId])


    useEffect(() => {
        if (import.meta.env.MODE !== "production") {
            socket = io("localhost:8000")
        } else {
            socket = io('https://slack-deploy.onrender.com')
        }

        socket.on("server", obj => {
            console.log(obj)
            if (obj.userId == sessionUser.id) {
                return
            }
            switch (obj.type) {
                case "message": {
                    switch (obj.method) {
                        case "POST": {
                            // Handle message post
                            dispatch(createMessage(obj.message))
                            if (!checkChannelIfSelected(obj.message.channel_id)) {
                                dispatch(boldChannel(obj.message.channel_id))
                                const storedBoldValues = localStorage.getItem("boldValues")
                                const storedBoldValuesObj = JSON.parse(storedBoldValues)
                                if (storedBoldValuesObj[obj.message.channel_id]) {
                                    storedBoldValuesObj[obj.message.channel_id]++
                                } else {
                                    storedBoldValuesObj[obj.message.channel_id] = 1
                                }
                                const storedBoldValuesJSON = JSON.stringify(storedBoldValuesObj)
                                localStorage.setItem("boldValues", storedBoldValuesJSON)
                            }
                            break
                        }
                        case "DELETE": {
                            // Handle message delete
                            dispatch(deleteMessage(obj.channelId, obj.messageId))
                            break
                        }
                    }
                    break
                }
                case "reaction": {
                    switch (obj.method) {
                        case "POST": {
                            // Handle reaction post
                            dispatch(createReaction(obj.channelId, obj.reaction))
                            break
                        }
                        case "DELETE": {
                            // Handle reaction delete
                            dispatch(deleteReaction(obj.channelId, obj.messageId, obj.reactionId))
                            break
                        }
                    }
                    break
                }
                case "channel": {
                    switch (obj.method) {
                        case "POST": {
                            // Handle channel post
                            dispatch(createChannel(obj.channel))
                            break
                        }
                        case "DELETE": {
                            // Handle channel delete
                            dispatch(deleteChannel(obj.channelId))
                            break
                        }
                        case "PUT": {
                            //Handle channel create
                            dispatch(updateChannel(obj.channel))
                            break
                        }
                    }
                    break
                }
            }

        })

        socket.emit("join", { room: server.id })

        return (() => {
            socket.emit("leave", { room: server.id })
            socket.disconnect()
        })
    }, [server?.id, dispatch, sessionUser.id])

    return (
        <div className="main-page-wrapper">
            <OuterNavbar socket={socket} />
            <InnerNavbar socket={socket} />
            <ChannelPage socket={socket} />
        </div>
    )
}

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { loadServer } from "../../redux/server"
import { loadAllServers } from "../../redux/all_servers"
import { io } from 'socket.io-client';
import { deleteChannel, createChannel, updateChannel, deleteMessage, createMessage, deleteReaction, createReaction } from "../../redux/server"
import ChannelPage from "../ChannelPage"

let socket

export default function ServerPage() {
    const dispatch = useDispatch()
    const { serverId } = useParams()

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

        // sampleEmit = socket.emit("server", {
        //     userId: sessionUser.id,
        //     type: "Message",
        //     method: "DELETE",
        //     room: server.id,
        //     channelId,
        //     messageId
        // })

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
                            return
                        }
                        case "DELETE": {
                            // Handle message delete
                            dispatch(deleteMessage(obj.channelId, obj.messageId))
                            return
                        }
                    }
                }
                case "reaction": {
                    switch (obj.method) {
                        case "POST": {
                            // Handle reaction post
                            dispatch(createReaction(obj.channelId, obj.reaction))
                            return
                        }
                        case "DELETE": {
                            // Handle reaction delete
                            dispatch(deleteReaction(obj.channelId, obj.messageId, obj.reactionId))
                            return
                        }
                    }
                }
                case "channel": {
                    switch (obj.method) {
                        case "POST": {
                            // Handle channel post
                            dispatch(createChannel(obj.channel))
                            return
                        }
                        case "DELETE": {
                            // Handle channel delete
                            dispatch(deleteChannel(obj.channelId))
                            return
                        }
                        case "UPDATE": {
                            //Handle channel create
                            dispatch(updateChannel(obj.channel))
                            return
                        }
                    }
                }
            }

        })

        socket.emit("join", { room: server.id })


        return (() => {
            socket.emit("leave", { room: server.id })
            socket.disconnect()
        })
    }, [server.id])

    return (
        <>
            <ChannelPage socket={socket} />
            <h1>Hi from {serverId}</h1>
        </>
    )
}

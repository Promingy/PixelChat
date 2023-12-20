import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { loadServer } from "../../redux/server"
import { loadAllServers } from "../../redux/all_servers"
import { io } from 'socket.io-client';
import ChannelPage from "../ChannelPage"

let socket

export default function ServerPage() {
    const dispatch = useDispatch()
    const { serverId } = useParams()

    const server = useSelector(state => state.server)

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

        socket.on(server.id, (chat) => {
            console.log(chat)
        })

        return (() => {
            socket.disconnect()
        })
    }, [server.id])

    return (
        <>
            <ChannelPage socket={socket} />
        </>
    )
}

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { loadServer } from "../../redux/server"
import { loadAllServers } from "../../redux/all_servers"

export default function ServerPage() {
    const dispatch = useDispatch()
    const { serverId } = useParams()

    const server = useSelector(state => state.server)

    // Eager load all data for the server
    useEffect(() => {
        dispatch(loadServer(serverId))
        dispatch(loadAllServers())
    }, [dispatch, serverId])

    return (
        <>
            <Outlet />
            <h1>Hi from {serverId}</h1>
        </>
    )
}

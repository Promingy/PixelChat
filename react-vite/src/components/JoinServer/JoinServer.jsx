import { useDispatch, useSelector } from "react-redux"
import { thunkAddUserServer } from "../../redux/session"
import { useEffect, useState } from "react"
import { loadAllServers } from "../../redux/all_servers"
import { Link } from "react-router-dom"
import "./JoinServer.css"

export default function JoinServer() {
    const dispatch = useDispatch()
    const allServers = useSelector(state => state.allServers)
    const sessionUser = useSelector(state => state.session.user)

    const [availableServers, setAvailableServers] = useState([])

    useEffect(() => {
        dispatch(loadAllServers())
    }, [dispatch])


    useEffect(() => {
        const unjoinedServers = []
        for (let id of Object.keys(allServers.servers)) {
            if (!sessionUser.servers[id]) {
                unjoinedServers.push(allServers.servers[id])
            }
        }
        setAvailableServers(unjoinedServers)
    }, [allServers, sessionUser.servers])

    const addServer = async (server) => {
        const data = await dispatch(thunkAddUserServer(server, sessionUser))
        if (!data.errors) {
            const unjoinedServers = []
            for (let id of Object.keys(allServers.servers)) {
                if (!sessionUser.servers[id]) {
                    unjoinedServers.push(allServers.servers[id])
                }
            }
            setAvailableServers(unjoinedServers)
        }
    }

    return (
        <div className="join-server-page-wrapper">
            <Link to="/landing" className="back-to-landing"><i className="fa-solid fa-chevron-left"></i><p>To landing page</p></Link>
            <img className="home-logo" src='https://svgshare.com/i/10wP.svg' />
            <h1>Join a Server</h1>
            <div className="servers-to-join-wrapper">
                <div className="server-to-join-header">Available servers for <b>{sessionUser.email}</b></div>
                {availableServers.map((server) => (
                    <div className='server-to-join' key={server.id}>
                        <div className="server-to-join-image"><img src={server.image_url} /></div>
                        <div className="server-to-join-name">{server.name}</div>
                        <button className="add-server-button" onClick={() => addServer(server)} title={`join ${server.name}`}><i className="fa-solid fa-plus"></i></button>
                    </div>
                )
                )}

            </div>
        </div>
    )
}
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
            <img className="home-logo" src='https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Slack-Clone-Logo.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMSJHMEUCIQDPdS%2BefXZdp9FbxUNHyICmyFP9y1NNZI9befAVOFfAnwIgQFjgaE2rn07B1DdxctJ8S8%2BhuB91Cd64JK7y%2FuXwsJwq5AIIMRAAGgwwNTU4Njg2NTI4NTQiDGV9jbQG6qizrU3ZxSrBAvsaXviSSClP8Iz2XE9Ygb3cTuC3M0hI7%2BcUJBNusK38sWRCDTury0Ft2kKucoJXVbBPRZXISXxj0zHd0EB2%2FFk7Iwr27%2FHmIM1E1YuMmPgFi%2BT5wjyLKEc%2Bw2pUcs6v%2BZrj%2BAKgn5GFCJI4BkhtR6d0W%2Bx8ldeXnR8bDjwz72UdZF9aoUFN7r4PT3wrzztinQ6obV%2BLzCYDuCoyz%2FsbRe9aW3kI92%2BMxX2KftVK9KT3X4BuUd9VfdapA%2BTt0CopaEaD2ibHboJFtOwX8nLaFu0o7xw2Qz%2BSfa0fQ7i2Wj2j4EIcjTjirsKj5Fnh0cryc3go1N9efodOCeOZdrGyjU8EVcrgro3%2BJCbXDfXoGSJdPEjobYWxlK7hgGtwQYb%2FbfF%2Bk2FRk68tpcEwVHbvOJDk%2FX8L6V1fBgOCrT6a7ZahvzDo5ZasBjqzAk3J6mEXXJkZ46XR70Mt%2BjlD%2FjPJPUqUEU%2BcvqWDVFLdWD%2BcfAT00m%2BMwsPZYIl4yVnLD0obq%2BeS7eHxse1Hloua0iJx3AWuoK%2BwLn%2FM2lPZuS2%2Fx2g7ab8E6JLJQSKTwxDfeewJnr6cyDzDaFVht6bp5DmC8GoHvfjasRjTwEsqtMKZ53LkXd54V4JS2VSv4eprh9OPr3ttm%2BXyoVPBhr5Rr8eefCWkE73hwRXC5zJyku5fB%2F5LQWGA5HOUS2Csn1YJRjHW1VoY8318VviOpJwmgru63EftWigEqkGmBamo04z81laAd8HniHlLL9ONoMl4obgWLs4vzRUc%2B8wXXQo55DHV0ikzBWV%2FcZ%2Bt9PkfbVzRMRuZR4By1hrcVbwbGOWdYHhvvork9xPyV0yq7EG4crA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231222T192635Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ2AQH7U3EIWHM4OZ%2F20231222%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=8f076a980e1f6e1c7a5af5aa99854b5c41432138c97973d1ed4770290e5361f7' />
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
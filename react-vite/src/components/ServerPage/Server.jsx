import { Outlet, useParams } from "react-router-dom"

export default function ServerPage() {
    const { serverId } = useParams()

    return (
        <>
            <Outlet />
            <h1>Hi from server {serverId}</h1>
        </>
    )
}

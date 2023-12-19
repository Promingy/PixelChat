import { useSelector } from "react-redux/es/hooks/useSelector"

export default function OtherUserModal({ userId }) {

    const server = useSelector((state) => (state.server))
    const users = server.users
    const user = users[userId]

    const copyNameToClipboard = () => {
        navigator.clipboard.writeText(`${user.first_name} ${user.last_name}`)
    }
    return (
        <div className="other-user-wrapper">
            <div className="other-user-img-wrapper"><img href={user.image_url} /></div>
            <div className="other-user-name">{`${user.first_name} ${user.last_name}`}</div>
            <button className="copy-other-user" onClick={copyNameToClipboard}>Copy member name</button>
        </div>
    )
}
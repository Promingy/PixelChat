import { useParams } from "react-router-dom"

export default function ChannelPage() {
    const { channelId } = useParams()
    return <h1>hi from channel {channelId}</h1>
}

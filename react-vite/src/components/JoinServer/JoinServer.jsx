import { useSelector } from "react-redux"

export default function JoinServer() {
    const allServers = useSelector(state => state.allServers)
    console.log(allServers)
    return null
}
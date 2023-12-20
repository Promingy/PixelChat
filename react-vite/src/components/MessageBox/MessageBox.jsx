
export default function MessageBox({ socket }) {
    const sendSocket = () => {
        socket.emit("chat", { message: "Chat message!" })
    }
    return <button onClick={sendSocket}>Chat test button</button>
}
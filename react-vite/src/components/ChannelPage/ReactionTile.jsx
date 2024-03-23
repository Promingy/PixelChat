import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction, initializeDirectReaction, removeDirectReaction } from '../../redux/server'
import './ChannelPage.css'

export default function ReactionTile({ allReactions, reaction, count, messageId, channelId, socket, type }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const server = useSelector(state => state.server)
    const userReactions = {}

    for (let key in allReactions) {
        if (allReactions[key].user_id === sessionUser.id) {
            userReactions[allReactions[key].emoji] = allReactions[key]
        }
    }

    async function addReactToDB(e) {
        e.preventDefault()

        const newReaction = {
            emoji: reaction
        }

        if (type === 'channel') {
            // check if the user has already used this reaction, if so, remove it!
            if (userReactions[newReaction.emoji]) {
                const reaction = userReactions[newReaction.emoji]
                const data = await dispatch(removeReaction(channelId, messageId, reaction.id))
                if (data.ok) {
                    socket.emit("server", {
                        userId: sessionUser.id,
                        type: "reaction",
                        method: "DELETE",
                        room: server.id,
                        channelId,
                        messageId,
                        reactionId: reaction.id
                    })
                    return
                }
            }

            // if user hasn't used this reaction already, add reaction
            const data = await dispatch(initializeReaction(channelId, messageId, newReaction))
            if (!data.errors) {
                socket.emit("server", {
                    userId: sessionUser.id,
                    type: "reaction",
                    method: "POST",
                    room: server.id,
                    channelId,
                    reaction: data
                })
            }
        } else if (type === 'message') {
            if (userReactions[newReaction.emoji]) {
                const reaction = userReactions[newReaction.emoji]
                const data = await dispatch(removeDirectReaction(server.direct_rooms[channelId].id, messageId, reaction.id, channelId))
                if (data.ok) {
                    const joinPayload = {
                        room: `user-${channelId}`,
                        user: sessionUser,
                        serverId: server.id
                    }

                    socket.emit("join", { room: `user-${channelId}`, user: joinPayload })

                    const messagePayload = {
                        type: 'reaction',
                        method: 'DELETE',
                        room: `user-${channelId}`,
                        user: sessionUser.id,
                        messageId,
                        reactionId: reaction.id
                    }

                    socket.emit("server", messagePayload)

                    socket.emit("leave", { room: `user-${channelId}` })
                    return
                }
            }

            // if user hasn't used this reaction already, add reaction
            const data = await dispatch(initializeDirectReaction(server.direct_rooms[channelId].id, messageId, newReaction, channelId))
            if (!data.errors) {
                const joinPayload = {
                    room: `user-${channelId}`,
                    user: sessionUser,
                    serverId: server.id
                }

                socket.emit("join", { room: `user-${channelId}`, user: joinPayload })

                const messagePayload = {
                    type: 'reaction',
                    method: 'POST',
                    room: `user-${channelId}`,
                    user: sessionUser.id,
                    messageId,
                    reactionId: data
                }

                socket.emit("server", messagePayload)

                socket.emit("leave", { room: `user-${channelId}` })
            }
        }

    }

    return (
        <div className={`message-reaction ${localStorage.getItem('theme') === 'dark' ? 'message-reaction-dark' : ''}`} onClick={addReactToDB}>
            <p>{reaction}</p>
            <p className='reaction-count'>{count}</p>
        </div>
    )
}

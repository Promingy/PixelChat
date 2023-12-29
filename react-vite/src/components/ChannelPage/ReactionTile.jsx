import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction } from '../../redux/server'
import './ChannelPage.css'

export default function ReactionTile({ allReactions, reaction, count, messageId, channelId, socket }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const server = useSelector(state => state.server)

    async function addReactToDB(e) {
        e.preventDefault()

        const newReaction = {
            emoji: reaction
        }
        // check if the user has already used this reaction, if so, remove it!
        for (let reaction of Object.values(allReactions)) {
            if (reaction.user_id == sessionUser.id && reaction.emoji == newReaction.emoji) {
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
            return
        }

    }

    return (
        <div className={`message-reaction ${localStorage.getItem('theme') === 'dark' ? 'message-reaction-dark' : ''}`} onClick={addReactToDB}>
            <p>{reaction}</p>
            <p className='reaction-count'>{count}</p>
        </div>
    )
}

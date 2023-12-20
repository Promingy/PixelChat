import { useDispatch, useSelector } from 'react-redux'
import { initializeReaction, removeReaction } from '../../redux/server'
import './ChannelPage.css'

export default function ReactionTile({ allReactions, reaction, count, messageId, channelId }){
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)

    function addReactToDB(e) {
        e.preventDefault()

        const newReaction = {
            user_id: user.id,
            message_id: messageId,
            emoji: reaction
        }
        // check if the user has already used this reaction, if so, remove it!
        for (let reaction of Object.values(allReactions)){
            if (reaction.user_id == user.id && reaction.emoji == newReaction.emoji) {
                return dispatch(removeReaction(channelId, messageId, reaction.id))
            }
        }

        // if user hasn't used this reaction already, add reaction
        return dispatch(initializeReaction(channelId, newReaction))
    }

    return (
        <div className='message-reaction' onClick={addReactToDB}>
            <span>{reaction}</span>
            <span>{count}</span>
        </div>
    )
}

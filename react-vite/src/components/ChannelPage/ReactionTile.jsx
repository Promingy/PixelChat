import './ChannelPage.css'

export default function ReactionTile({ reaction, count, messasgeId }){
    return (
        <div className='message-reaction' onClick={() => {console.log('hi')}}>
            <span>{reaction}</span>
            <span>{count}</span>
        </div>
    )
}

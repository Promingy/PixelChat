import { addServers, editServers, removeServers } from "./all_servers"
import { removeUserServer, editUserServer } from "./session"

const GET_SERVER = 'server/getServer'
const DELETE_SERVER = 'server/deleteServer'
const UPDATE_SERVER = 'server/updateServer'
const CREATE_SERVER = 'server/createServer'
const DELETE_CHANNEL = 'channel/deleteChannel'
const UPDATE_CHANNEL = 'channel/updateChannel'
const CREATE_CHANNEL = 'channel/createChannel'
const DELETE_MESSAGE = 'message/deleteMessage'
const CREATE_MESSAGE = 'message/createMessage'
const PIN_MESSAGE = 'message/pin/pinMessage'
const DELETE_REACTION = 'reaction/deleteReaction'
const CREATE_REACTION = 'reaction/createReaction'
const BOLD_CHANNEL = 'channel/bold'
const UNBOLD_CHANNEL = 'channel/unbold'
const GET_MESSAGES = 'reaction/getMessages'
const ADD_USER_TO_SERVER = 'session/addUserToServer'
const CREATE_DIRECT_ROOM = 'direct_room/createDirectRoom'
const DELETE_DIRECT_MESSAGE = 'direct_message/deleteDirectMessage'
const CREATE_DIRECT_MESSAGE = 'direct_message/createDirectMessage'
const PIN_DIRECT_MESSAGE = 'direct_message/pin/pinDirectMessage'
const DELETE_DIRECT_REACTION = 'direct_reaction/deleteDirectReaction'
const CREATE_DIRECT_REACTION = 'direct_reaction/createDirectReaction'
const BOLD_DIRECT_ROOM = 'direct_room/bold'
const UNBOLD_DIRECT_ROOM = 'direct_room/unbold'
const GET_DIRECT_MESSAGES = 'direct_reaction/getDirectMessages'

export const addUserToServer = (serverId, user) => {
    return {
        type: ADD_USER_TO_SERVER,
        serverId,
        user
    }
}

const getServer = (server, boldValues = false, currentUserId) => {
    return {
        type: GET_SERVER,
        server,
        boldValues,
        currentUserId
    }
}

export const deleteServer = () => {
    return {
        type: DELETE_SERVER
    }
}

const updateServer = (server) => {
    return {
        type: UPDATE_SERVER,
        server
    }
}

const createServer = (server) => {
    return {
        type: CREATE_SERVER,
        server
    }
}

export const deleteChannel = (channelId) => {
    return {
        type: DELETE_CHANNEL,
        channelId
    }
}

export const updateChannel = (channel) => {
    return {
        type: UPDATE_CHANNEL,
        channel
    }
}

export const createChannel = (channel) => {
    return {
        type: CREATE_CHANNEL,
        channel
    }
}

export const boldChannel = (channelId, boldValue = false) => {
    return {
        type: BOLD_CHANNEL,
        channelId,
        boldValue
    }
}

export const unboldChannel = (channelId) => {
    return {
        type: UNBOLD_CHANNEL,
        channelId
    }
}

export const deleteMessage = (channelId, messageId) => {
    return {
        type: DELETE_MESSAGE,
        channelId,
        messageId
    }
}

export const createMessage = (message) => {
    return {
        type: CREATE_MESSAGE,
        message
    }
}

export const pinMessage = (message) => {
    return {
        type: PIN_MESSAGE,
        message
    }
}

export const deleteReaction = (channelId, messageId, reactionId) => {
    return {
        type: DELETE_REACTION,
        channelId,
        messageId,
        reactionId
    }
}

export const createReaction = (channelId, reaction) => {
    return {
        type: CREATE_REACTION,
        channelId,
        reaction
    }
}

export const getMoreMessages = (messages, channelId) => {
    return {
        type: GET_MESSAGES,
        messages,
        channelId
    }
}

export const createDirectRoom = (direct_room, otherUserId) => {
    return {
        type: CREATE_DIRECT_ROOM,
        direct_room,
        otherUserId
    }
}

export const boldDirectRoom = (roomId, boldValue = false, otherUserId) => {
    return {
        type: BOLD_DIRECT_ROOM,
        roomId,
        boldValue,
        otherUserId
    }
}

export const unboldDirectRoom = (roomId, otherUserId) => {
    return {
        type: UNBOLD_DIRECT_ROOM,
        roomId,
        otherUserId
    }
}

export const deleteDirectMessage = (roomId, messageId, otherUserId) => {
    return {
        type: DELETE_DIRECT_MESSAGE,
        roomId,
        messageId,
        otherUserId
    }
}

export const createDirectMessage = (message, otherUserId) => {
    return {
        type: CREATE_DIRECT_MESSAGE,
        message,
        otherUserId
    }
}

export const pinDirectMessage = (message, otherUserId) => {
    return {
        type: PIN_DIRECT_MESSAGE,
        message,
        otherUserId
    }
}

export const deleteDirectReaction = (roomId, messageId, reactionId, otherUserId) => {
    return {
        type: DELETE_DIRECT_REACTION,
        roomId,
        messageId,
        reactionId,
        otherUserId
    }
}

export const createDirectReaction = (roomId, reaction, otherUserId) => {
    return {
        type: CREATE_DIRECT_REACTION,
        roomId,
        reaction,
        otherUserId
    }
}

export const getMoreDirectMessages = (messages, roomId, otherUserId) => {
    return {
        type: GET_DIRECT_MESSAGES,
        messages,
        roomId,
        otherUserId
    }
}


export const uploadImage = (image) => async () => {
    const res = await fetch(`/api/servers/images`, {
        method: "POST",
        body: image
    })
    const data = await res.json()
    return data
}

export const loadServer = (serverId, userId) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}`)
    const data = await res.json()
    if (res.ok) {
        const storedBoldValues = localStorage.getItem("boldValues")
        const storedBoldValuesObj = JSON.parse(storedBoldValues)
        dispatch(getServer(data, storedBoldValuesObj, userId))
    }
    return data
}

export const removeServer = (serverId) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteServer(serverId))
        dispatch(removeServers(serverId))
        dispatch(removeUserServer(serverId))
    }
    return res
}

export const editServer = (server, serverId) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}`, {
        method: "PUT",
        body: JSON.stringify(server),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(updateServer(data))
        delete data.channels
        dispatch(editServers(data))
        dispatch(editUserServer(data))
    }
    return data
}

export const initializeServer = (server) => async (dispatch) => {
    const res = await fetch(`/api/servers`, {
        method: "POST",
        body: JSON.stringify(server),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createServer(data))
        delete data.channels
        dispatch(addServers(data))
    }
    return data
}

export const removeChannel = (channelId) => async (dispatch) => {
    const res = await fetch(`/api/channels/${channelId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        dispatch(deleteChannel(channelId))
    }
    return res
}

export const editChannel = (channel, channelId) => async (dispatch) => {
    const res = await fetch(`/api/channels/${channelId}`, {
        method: "PUT",
        body: JSON.stringify(channel),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(updateChannel(data))
    }
    return data
}

export const initializeChannel = (serverId, channel) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}/channels`, {
        method: "POST",
        body: JSON.stringify(channel),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createChannel(data))
    }
    return data
}

export const removeMessage = (channelId, messageId) => async (dispatch) => {
    const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteMessage(channelId, messageId))
    }
    return res
}

export const initializeMessage = (channelId, message) => async (dispatch) => {
    const res = await fetch(`/api/channels/${channelId}/messages`, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createMessage(data))
    }
    return data
}

export const thunkPinMessage = (message) => async (dispatch) => {
    const res = await fetch(`/api/messages/${message.id}`, {
        method: "PUT",
        body: JSON.stringify(message),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await res.json()
    if (res.ok) {
        dispatch(pinMessage(data))
    }
    return data
}

export const removeReaction = (channelId, messageId, reactionId) => async (dispatch) => {
    const res = await fetch(`/api/reactions/${reactionId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteReaction(channelId, messageId, reactionId))
    }
    return res
}

export const initializeReaction = (channelId, messageId, reaction) => async (dispatch) => {
    const res = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        body: JSON.stringify(reaction),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createReaction(channelId, data))
    }
    return data
}

export const getMessages = (channelId, query) => async (dispatch) => {
    const res = await fetch(`/api/channels/${channelId}?${query}`)

    if (res.ok) {
        const data = await res.json()
        dispatch(getMoreMessages(data.messages, channelId))
        return data.messages
    }
}

export const initializeDirectRoom = (serverId, direct_room) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}/direct_rooms`, {
        method: "POST",
        body: JSON.stringify(direct_room),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createDirectRoom(data, direct_room.owner_2_id))
    }
    return data
}

export const removeDirectMessage = (roomId, messageId, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_messages/${messageId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteDirectMessage(roomId, messageId, otherUserId))
    }
    return res
}

export const initializeDirectMessage = (roomId, message, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_rooms/${roomId}/messages`, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createDirectMessage(data, otherUserId))
    }
    return data
}

export const thunkPinDirectMessage = (message, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_messages/${message.id}`, {
        method: "PUT",
        body: JSON.stringify(message),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await res.json()
    if (res.ok) {
        dispatch(pinDirectMessage(data, otherUserId))
    }
    return data
}

export const removeDirectReaction = (roomId, messageId, reactionId, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_reactions/${reactionId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteReaction(roomId, messageId, reactionId, otherUserId))
    }
    return res
}

export const initializeDirectReaction = (roomId, messageId, reaction, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_messages/${messageId}/reactions`, {
        method: "POST",
        body: JSON.stringify(reaction),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createDirectReaction(roomId, data, otherUserId))
    }
    return data
}

export const getDirectMessages = (roomId, query, otherUserId) => async (dispatch) => {
    const res = await fetch(`/api/direct_rooms/${roomId}?${query}`)

    if (res.ok) {
        const data = await res.json()
        dispatch(getMoreDirectMessages(data.messages, roomId, otherUserId))
        return data.messages
    }
}

const initialState = {}

const serverReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SERVER: {
            const newState = {}
            const storedBoldValues = localStorage.getItem("boldValues")
            let storedBoldValuesObj
            if (storedBoldValues) {
                storedBoldValuesObj = JSON.parse(storedBoldValues)
            } else {
                storedBoldValuesObj = {}
            }
            newState.description = action.server.description
            newState.id = action.server.id
            newState.image_url = action.server.image_url
            newState.name = action.server.name
            newState.owner_id = action.server.owner_id
            newState.channels = {}
            newState.direct_rooms = {}
            newState.users = {}
            for (let user in action.server.users) {
                const users = action.server.users
                newState.users = { ...newState.users, [users[user].id]: users[user] }
            }
            for (let channel of action.server.channels) {
                newState.channels[channel.id] = { ...channel, messages: {}, bold: (storedBoldValuesObj[channel.id] ? storedBoldValuesObj[channel.id] : 0) }
                for (let message of channel.messages) {
                    newState.channels[channel.id].messages[message.id] = { ...message, reactions: {} }
                    for (let reaction of message.reactions) {
                        newState.channels[channel.id].messages[message.id].reactions[reaction.id] = { ...reaction }
                    }
                }
            }
            for (let direct_room of action.server.direct_rooms) {
                const userId = (action.currentUserId === direct_room.owner_1_id ? direct_room.owner_2_id : direct_room.owner_1_id)
                newState.direct_rooms[userId] = { ...direct_room, messages: {}, bold: (storedBoldValuesObj[userId] ? storedBoldValuesObj[userId] : 0) }
                for (let message of direct_room.messages) {
                    newState.direct_rooms[userId].messages[message.id] = { ...message, reactions: {} }
                    for (let reaction of message.reactions) {
                        newState.direct_rooms[userId].messages[message.id].reactions[reaction.id] = { ...reaction }
                    }
                }
            }

            return newState
        }
        case DELETE_SERVER: {
            return {}
        }
        case UPDATE_SERVER: {
            const newState = { ...state }
            newState.description = action.server.description
            newState.image_url = action.server.image_url
            newState.name = action.server.name
            return newState
        }
        case CREATE_SERVER: {
            const newState = {}
            newState.description = action.server.description
            newState.id = action.server.id
            newState.image_url = action.server.image_url
            newState.name = action.server.name
            newState.owner_id = action.server.owner_id
            newState.channels = {}
            return newState
        }
        case DELETE_CHANNEL: {
            const newState = { ...state }
            delete newState.channels[action.channelId]
            return newState
        }
        case UPDATE_CHANNEL: {
            const newState = { ...state }
            newState.channels[action.channel.id].topic = action.channel.topic
            newState.channels[action.channel.id].name = action.channel.name
            newState.channels[action.channel.id].description = action.channel.description
            return newState
        }
        case CREATE_CHANNEL: {
            const newState = { ...state }
            newState.channels[action.channel.id] = { ...action.channel }
            newState.channels[action.channel.id].messages = {}
            newState.channels[action.channel.id].bold = 0
            return newState
        }
        case DELETE_MESSAGE: {
            const newState = { ...state }
            delete newState.channels[action.channelId].messages[action.messageId]
            return newState
        }
        case CREATE_MESSAGE: {
            const newState = { ...state }
            newState.channels[action.message.channel_id].messages[action.message.id] = { ...action.message }
            newState.channels[action.message.channel_id].messages[action.message.id].reactions = {}
            return newState
        }
        case DELETE_REACTION: {
            const newState = { ...state }
            delete newState.channels[action.channelId].messages[action.messageId].reactions[action.reactionId]
            return newState
        }
        case CREATE_REACTION: {
            const newState = { ...state }
            newState.channels[action.channelId].messages[action.reaction.message_id].reactions[action.reaction.id] = { ...action.reaction }
            return newState
        }
        case BOLD_CHANNEL: {
            const newState = { ...state }
            if (action.boldValue) {
                newState.channels[action.channelId].bold = action.boldValue
            } else {
                newState.channels[action.channelId].bold++
            }
            return newState
        }
        case UNBOLD_CHANNEL: {
            const newState = { ...state }
            newState.channels[action.channelId].bold = 0
            return newState
        }
        case GET_MESSAGES: {
            const newState = { ...state }
            for (let message of action.messages) {
                newState.channels[action.channelId].messages[message.id] = message
            }
            return newState
        }
        case PIN_MESSAGE: {
            const newState = { ...state }
            newState.channels[action.message.channel_id].messages[action.message.id].pinned = action.message.pinned
            return newState
        }
        case CREATE_DIRECT_ROOM: {
            const newState = { ...state }
            newState.direct_rooms[action.otherUserId] = { ...action.direct_room }
            newState.direct_rooms[action.otherUserId].messages = {}
            newState.direct_rooms[action.otherUserId].bold = 0
            return newState
        }
        case DELETE_DIRECT_MESSAGE: {
            const newState = { ...state }
            delete newState.direct_rooms[action.otherUserId].messages[action.messageId]
            return newState
        }
        case CREATE_DIRECT_MESSAGE: {
            const newState = { ...state }
            newState.direct_rooms[action.otherUserId].messages[action.message.id] = { ...action.message }
            newState.direct_rooms[action.otherUserId].messages[action.message.id].reactions = {}
            return newState
        }
        case DELETE_DIRECT_REACTION: {
            const newState = { ...state }
            delete newState.direct_rooms[action.otherUserId].messages[action.messageId].reactions[action.reactionId]
            return newState
        }
        case CREATE_DIRECT_REACTION: {
            const newState = { ...state }
            newState.direct_rooms[action.otherUserId].messages[action.reaction.message_id].reactions[action.reaction.id] = { ...action.reaction }
            return newState
        }
        case BOLD_DIRECT_ROOM: {
            const newState = { ...state }
            if (action.boldValue) {
                newState.direct_rooms[action.otherUserId].bold = action.boldValue
            } else {
                newState.direct_rooms[action.otherUserId].bold++
            }
            return newState
        }
        case UNBOLD_DIRECT_ROOM: {
            const newState = { ...state }
            newState.direct_rooms[action.otherUserId].bold = 0
            return newState
        }
        case GET_DIRECT_MESSAGES: {
            const newState = { ...state }
            for (let message of action.messages) {
                newState.direct_rooms[action.otherUserId].messages[message.id] = message
            }
            return newState
        }
        case PIN_DIRECT_MESSAGE: {
            const newState = { ...state }
            newState.direct_rooms[action.otherUserId].messages[action.message.id].pinned = action.message.pinned
            return newState
        }
        case ADD_USER_TO_SERVER: {
            const newState = { ...state }

            newState.users = { ...newState.users, [action.user.id]: action.user }
            return newState
        }
        default: {
            return state
        }
    }
}

export default serverReducer

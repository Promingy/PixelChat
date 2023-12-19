import { addServers, editServers, removeServers } from "./all_servers"
import { addUserServer, removeUserServer, editUserServer } from "./session"

const GET_SERVER = 'server/getServer'
const DELETE_SERVER = 'server/deleteServer'
const UPDATE_SERVER = 'server/updateServer'
const CREATE_SERVER = 'server/createServer'
const DELETE_CHANNEL = 'channel/deleteChannel'
const UPDATE_CHANNEL = 'channel/updateChannel'
const CREATE_CHANNEL = 'channel/createChannel'
const DELETE_MESSAGE = 'message/deleteMessage'
const CREATE_MESSAGE = 'message/createMessage'
const DELETE_REACTION = 'reaction/deleteReaction'
const CREATE_REACTION = 'reaction/createReaction'

const getServer = (server) => {
    return {
        type: GET_SERVER,
        server
    }
}

const deleteServer = () => {
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

const deleteChannel = (channelId) => {
    return {
        type: DELETE_CHANNEL,
        channelId
    }
}

const updateChannel = (channel) => {
    return {
        type: UPDATE_CHANNEL,
        channel
    }
}

const createChannel = (channel) => {
    return {
        type: CREATE_CHANNEL,
        channel
    }
}

const deleteMessage = (channelId, messageId) => {
    return {
        type: DELETE_MESSAGE,
        channelId,
        messageId
    }
}

const createMessage = (message) => {
    return {
        type: CREATE_MESSAGE,
        message
    }
}

const deleteReaction = (channelId, messageId, reactionId) => {
    return {
        type: DELETE_REACTION,
        channelId,
        messageId,
        reactionId
    }
}

const createReaction = (channelId, reaction) => {
    return {
        type: CREATE_REACTION,
        channelId,
        reaction
    }
}

export const loadServer = (serverId) => async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}`)
    const data = await res.json()
    if (res.ok) {
        dispatch(getServer(data))
    }
    return data
}

export const removeServer = (serverId) => async (dispatch) => {
    const res = await fetch(`api/servers/${serverId}`, {
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
    const res = await fetch(`api/servers/${serverId}`, {
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
    const res = await fetch(`api/servers`, {
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
        dispatch(addUserServer(data))
    }
    return data
}

export const removeChannel = (channelId) => async (dispatch) => {
    const res = await fetch(`api/channels/${channelId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteChannel(channelId))
    }
    return res
}

export const editChannel = (channel, channelId) => async (dispatch) => {
    const res = await fetch(`api/channels/${channelId}`, {
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
    const res = await fetch(`api/servers/${serverId}/channels`, {
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
    const res = await fetch(`api/messages/${messageId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteMessage(channelId, messageId))
    }
    return res
}

export const initializeMessage = (channelId, message) => async (dispatch) => {
    const res = await fetch(`api/channels/${channelId}/messages`, {
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

export const removeReaction = (channelId, messageId, reactionId) => async (dispatch) => {
    const res = await fetch(`api/reactions/${reactionId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteReaction(channelId, messageId, reactionId))
    }
    return res
}

export const initializeReaction = (channelId, messageId, reaction) => async (dispatch) => {
    const res = await fetch(`api/messages/${messageId}/reactions`, {
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

const initialState = {}

const serverReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SERVER: {
            const newState = {}
            newState.description = action.server.description
            newState.id = action.server.id
            newState.image_url = action.server.image_url
            newState.channels = {}
            newState.users = {}
            for (let user in action.server.users) {
                const users = action.server.users
                newState.users = { ...newState.users, [users[user].id]: users[user] }
            }
            for (let channel of action.server.channels) {
                newState.channels[channel.id] = { ...channel, messages: {} }
                for (let message of channel.messages) {
                    newState.channels[channel.id].messages[message.id] = { ...message, reactions: {} }
                    for (let reaction of message.reactions) {
                        newState.channels[channel.id].messages[message.id].reactions[reaction.id] = { ...reaction }
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
            newState.id = action.server.id
            newState.image_url = action.server.image_url
            return newState
        }
        case CREATE_SERVER: {
            const newState = {}
            newState.description = action.server.description
            newState.id = action.server.id
            newState.image_url = action.server.image_url
            newState.channels = {}
            return newState
        }
        case DELETE_CHANNEL: {
            const newState = { ...state }
            delete newState[action.channelId]
            return newState
        }
        case UPDATE_CHANNEL: {
            const newState = { ...state }
            newState.channels[action.channel.id] = { ...action.channel }
            return newState
        }
        case CREATE_CHANNEL: {
            const newState = { ...state }
            newState.channels[action.channel.id] = { ...action.channel }
            newState.channels[action.channel.id].messages = {}
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
        default: {
            return state
        }
    }
}

export default serverReducer

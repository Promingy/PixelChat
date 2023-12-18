const LOAD_SERVER = 'server/loadServer'
const DELETE_SERVER = 'server/deleteServer'
const UPDATE_SERVER = 'server/updateServer'
const CREATE_SERVER = 'server/createServer'
const DELETE_CHANNEL = 'channel/deleteChannel'
const UPDATE_CHANNEL = 'channel/updateChannel'
const CREATE_CHANNEL = 'channel/createChannel'
const CREATE_MESSAGE = 'message/createMessage'
const DELETE_MESSAGE = 'message/deleteMessage'
const CREATE_REACTION = 'reaction/createReaction'
const DELETE_REACTION = 'reaction/deleteReaction'

const loadServer = (serverId) => {
    return {
        type: LOAD_SERVER,
        serverId
    }
}

const deleteServer = (serverId) => {
    return {
        type: DELETE_SERVER,
        serverId
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

const deleteChannel = (serverId, channelId) => {
    return {
        type: DELETE_CHANNEL,
        serverId,
        channelId
    }
}

const updateChannel = (serverId, channel) => {
    return {
        type: UPDATE_CHANNEL,
        serverId,
        channel
    }
}

const createChannel = (channel) => {
    return {
        type: CREATE_CHANNEL,
        channel
    }
}

const deleteMessage = (serverId, channelId, messageId) => {
    return {
        type: DELETE_MESSAGE,
        serverId,
        channelId,
        messageId
    }
}

const createMessage = (serverId, message) => {
    return {
        type: CREATE_MESSAGE,
        serverId,
        message
    }
}

const deleteReaction = (serverId, channelId, messageId, reactionId) => {
    return {
        type: DELETE_REACTION,
        serverId,
        channelId,
        messageId,
        reactionId
    }
}

const createReaction = (serverId, channelId, reaction) => {
    return {
        type: CREATE_REACTION,
        serverId,
        channelId,
        reaction
    }
}

export const getServer = () => async (dispatch) => {
    const res = await fetch('/api/servers')
    const data = await res.json()
    if (res.ok) {
        dispatch(loadServer(data))
    }
    return data
}

export const removeServer = (serverId) => async (dispatch) => {
    const res = await fetch(`api/servers/${serverId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteServer(serverId))
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
    }
    return data
}

export const initializeServer = (server) => async (dispatch) => {
    const res = await fetch(`api/servers/`, {
        method: "POST",
        body: JSON.stringify(server),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if (res.ok) {
        dispatch(createServer(data))
    }
    return data
}

export const removeChannel = (serverId, channelId) => async (dispatch) => {
    const res = await fetch(`api/servers/${serverId}/channels/${channelId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteChannel(serverId, channelId))
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

export const initializeChannel = (channel) => async (dispatch) => {
    const res = await fetch(`api/channels/`, {
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
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

const updateChannel = (channel) => {
    return {
        type: updateChannel,
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

const createMessage = (message) => {
    return {
        type: CREATE_MESSAGE,
        server
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

const createReaction = (reaction) => {
    return {
        type: DELETE_REACTION,
        reaction
    }
}

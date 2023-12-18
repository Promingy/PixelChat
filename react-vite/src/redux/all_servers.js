const GET_ALL_SERVERS = 'server/getAllServers'

const getAllServers = (server) => {
    return {
        type: GET_ALL_SERVERS,
        server
    }
}

export const loadAllServers = () => async (dispatch) => {
    const res = await fetch('/api/servers')
    const data = await res.json()
    console.log(data)
    if (res.ok) {
        dispatch(getAllServers(data))
    }
    return data
    // "shallow data dump" - don't include the nested info like the more detailed server store does
}

// add server
// remove server
// edit server

const initialState = {}

const allServersReducer = (state = initialState, action) => {
    console.log("Hi")
    switch (action.type) {
        case GET_ALL_SERVERS: {
            const newState = {}
            return {...state, servers: [...action.server]}
        }
        default:
            return state
    }
}

export default allServersReducer

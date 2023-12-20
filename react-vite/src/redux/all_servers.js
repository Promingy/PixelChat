const GET_ALL_SERVERS = 'server/getAllServers'
const ADD_SERVER = 'server/addServer'
const EDIT_SERVER = 'server/editServer'
const REMOVE_SERVER = 'server/removeServer'

export const getAllServers = (server) => {
  return {
    type: GET_ALL_SERVERS,
    server
  }
}

export const addServers = (server) => {
  return {
    type: ADD_SERVER,
    server
  }
}


export const editServers = (server) => {
  return {
    type: EDIT_SERVER,
    server
  }
}

export const removeServers = (serverId) => {
  return {
    type: REMOVE_SERVER,
    serverId
  }
}

export const loadAllServers = () => async (dispatch) => {
  const res = await fetch('/api/servers')
  const data = await res.json()
  if (res.ok) {
    dispatch(getAllServers(data))
  }
  return data
}


const initialState = {
  servers: {}, // Default servers to an empty object
};

const allServersReducer = (state = initialState, action) => {

  switch (action.type) {
    case GET_ALL_SERVERS: {
      return { ...state, servers: { ...state.servers, ...action.server } };
    }
    case ADD_SERVER: {
      const newState = { ...state }
      newState.servers[action.server.id] = action.server
      return newState
    }
    case EDIT_SERVER: {
      const newState = { ...state }
      newState.servers[action.server.id] = action.server
      return newState
    }
    case REMOVE_SERVER: {
      delete state.servers[action.serverId]
      return { ...state }
    }
    default:
      return state;
  }
};

export default allServersReducer

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

export const addServer = (server) => {
    return {
        type: ADD_SERVER,
        server
    }
}

export const editServer = (server) => {
    return {
        type: EDIT_SERVER,
        server
    }
}

export const removeServer = (server) => {
    return {
        type: REMOVE_SERVER,
        server
    }
}
// delete server action


export const loadAllServers = () => async (dispatch) => {
    const res = await fetch('/api/servers')
    const data = await res.json()
    console.log(data)
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
        return { ...state, servers: action.server}
      }
      case EDIT_SERVER: {
        return { ...state, servers: action.server }
      }
      case REMOVE_SERVER: {
        delete state[server.id]
        return { ...state}
      }
      default:
        return state;
    }
  };

export default allServersReducer

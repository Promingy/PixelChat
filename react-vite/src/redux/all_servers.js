const GET_ALL_SERVERS = 'server/getAllServers'
const ADD_SERVER = 'server/addServer'

const getAllServers = (server) => {
    return {
        type: GET_ALL_SERVERS,
        server
    }
}

const addServer = (server) => {
    return {
        type: ADD_SERVER,
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
}

// add server
export const thunkAddServer = (server) => async (dispatch) => {
    const { name, description, image_url } = server
    const response = await fetch("/api/servers")
    return
}

// remove server
// edit server

const initialState = {
    servers: {}, // Default servers to an empty object
  };

  const allServersReducer = (state = initialState, action) => {

    switch (action.type) {
      case GET_ALL_SERVERS: {
           return { ...state, servers: { ...state.servers, ...action.server } };
      }
      default:
        return state;
    }
  };

export default allServersReducer

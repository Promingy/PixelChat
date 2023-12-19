const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const ADD_SERVER = 'session/addServer'
const REMOVE_SERVER = 'session/removeServer'
const EDIT_SERVER = 'session/editServer'

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const addUserServer = (server) => ({
  type: ADD_SERVER,
  server
})

export const removeUserServer = (serverId) => ({
  type: REMOVE_SERVER,
  serverId
})

export const editUserServer = (server) => ({
  type: EDIT_SERVER,
  server
})

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case ADD_SERVER: {
      const newState = { ...state }
      newState.user.servers[action.server.id] = action.server
      return newState
    }
    case EDIT_SERVER: {
      const newState = { ...state }
      newState.user.servers[action.server.id] = action.server
      return newState
    }
    case REMOVE_SERVER: {
      const newState = { ...state }
      delete newState.user.servers[action.serverId]
      return newState
    }

    default:
      return state;
  }
}

export default sessionReducer;

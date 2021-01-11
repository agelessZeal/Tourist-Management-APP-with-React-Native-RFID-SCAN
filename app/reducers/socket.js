const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.socket
      }
    default:
      return state;
  }
};

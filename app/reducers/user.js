const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        user: action.user
      }
    case 'SET_LOGOUT':
      return {
        ...state,
        user: action.user
      }
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: action.preferences
      }
    default:
      return state;
  }
};

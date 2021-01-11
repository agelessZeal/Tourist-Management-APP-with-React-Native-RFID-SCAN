const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STORAGE':
      return {
        ...state,
        storage: action.storage
      }
    default:
      return state;
  }
};

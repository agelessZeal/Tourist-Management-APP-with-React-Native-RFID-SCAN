const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ROUTE':
      return {
        ...state,
        route: action.route
      }
    default:
      return state;
  }
};

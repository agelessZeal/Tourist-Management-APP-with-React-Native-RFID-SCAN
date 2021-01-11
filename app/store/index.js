import { applyMiddleware, createStore } from 'redux';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import rootReducer from '../reducers';

const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
);

const store = createStore(
    rootReducer,
    applyMiddleware(middleware),
);

export default store;

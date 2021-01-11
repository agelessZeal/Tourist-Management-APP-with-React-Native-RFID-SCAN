// @flow
import { combineReducers } from 'redux';

import user from './user';
import lang from './lang';
import storage from './storage';
import nav from './navigation';
import apisettings from './apisettings';
import socket from './socket';
import route from './route';

const rootReducer = combineReducers({
  nav,
  user,
  storage,
  apisettings,
  socket,
  route
});

export default rootReducer;

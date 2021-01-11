import io from 'socket.io-client';
import config from '../constants/config';

const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 100000,
    transports: ['websocket'], 
  };

this.socket = io(config.chat_server, connectionConfig);

socket.connect();
export default socket;
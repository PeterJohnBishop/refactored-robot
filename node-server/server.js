import dotenv from 'dotenv';
import connectMongo from './graphql/mongodb.js';
import startGraphQLServer from './graphql/graphql.js';
import startRESTServer from './api/restAPI.js';
import { connectWebSocketWithRetry } from './ws.js';

dotenv.config();

connectWebSocketWithRetry("ws://localhost:8080/ws", (socket) => {
  socket.send(JSON.stringify({
    event: "connect",
    data: "Node server"
  }));

  connectMongo(socket).catch(console.error);
  startGraphQLServer(socket).catch(console.error);
  startRESTServer(socket);
});






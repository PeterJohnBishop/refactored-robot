import dotenv from 'dotenv';
import connectMongo from './graphql/mongodb.js';
import startGraphQLServer from './graphql/graphql.js';
import startRESTServer from './api/rest-api.js';
import { connectWebSocketWithRetry } from './ws.js';

dotenv.config();

const port = process.env.PORT || 8080;

connectWebSocketWithRetry(`ws://go-server:${port}/ws`, (socket) => {
  connectMongo(socket).catch(console.error);
  startGraphQLServer(socket).catch(console.error);
  startRESTServer(socket);
});






import dotenv from 'dotenv';
import connectMongo from './graphql/mongodb.js';
import startGraphQLServer from './graphql/graphql.js';
import startRESTServer from './api/restAPI.js';

dotenv.config();

connectMongo().catch(console.error);
startGraphQLServer().catch(console.error);
startRESTServer()

const socket = new WebSocket("ws://localhost:8080/ws");

socket.onopen = function() {
    socket.send(JSON.stringify({
    event: "connect",
    data: "Node server"
    }));
};

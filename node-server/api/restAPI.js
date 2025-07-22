import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const REST_PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

function startRESTServer(socket) {
  app.listen(REST_PORT, () => {
    socket.send(JSON.stringify({
    event: "connect",
    data: `REST API ready at http://localhost:${REST_PORT}/api`
    }));
  });
}

export default startRESTServer;
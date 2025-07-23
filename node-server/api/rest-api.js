import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes.js';

dotenv.config();

const app = express();

const port = process.env.REST_PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

function startRESTServer(socket) {
  app.listen(port, () => {
    socket.send(JSON.stringify({
    event: "connect",
    data: `REST API ready at http://localhost:${port}/api`
    }));
  });
}

export default startRESTServer;
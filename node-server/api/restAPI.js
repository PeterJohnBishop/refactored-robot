import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const REST_PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

function startRESTServer() {
  app.listen(REST_PORT, () => {
    console.log(`REST API ready at http://localhost:${REST_PORT}/api`);
  });
}

export default startRESTServer;
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const REST_PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

function startRESTServer() {
  app.listen(REST_PORT, () => {
    console.log(`REST API running at http://localhost:${REST_PORT}/api`);
  });
}

export default startRESTServer;
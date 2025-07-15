const express = require('express');
const app = express();
require('dotenv').config()

const PORT = process.env.NODE_PORT || 3001;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
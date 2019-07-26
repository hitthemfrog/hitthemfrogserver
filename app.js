const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res, next) => {
  res.status(200).json('HELLO HIT THEM FROG');
})

app.listen(port, () => {
  console.log(`listening to port`, port);
})
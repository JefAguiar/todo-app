const express = require('express');
const bodyParser = require('body-parser');

require('./db/mongoose');

const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());

todoRoutes(app);
userRoutes(app);

const port =  process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is running on ' + port)
});

module.exports = { app };
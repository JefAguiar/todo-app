const express = require('express');
const bodyParser = require('body-parser');

require('./config/config');
require('./db/mongoose');

const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());

todoRoutes(app);
userRoutes(app);

app.listen(process.env.PORT, () => {
  console.log('Server is running on ' + process.env.PORT)
});

module.exports = { app };
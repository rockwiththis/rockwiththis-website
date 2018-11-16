const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const envConfigPath = process.env.NODE_ENV == 'production' ? '~' : __dirname
require('dotenv').config({ path: envConfigPath + '/.env' });

const routes = require('./routes');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require all routes and namespace by version /v1
app.use('/v1', routes);


// Server initialization
app.listen(process.env.PORT || 9292, () => {
  console.log('Magic is happening on port 9292...');
});

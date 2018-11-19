const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require all routes and namespace by version api
app.use('/api', routes);


// Server initialization
app.listen(process.env.PORT || 9292, () => {
  console.log('Magic is happening on port 9292...');
});

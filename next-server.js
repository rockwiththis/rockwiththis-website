const express = require('express');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/songs/:id', (req, res) =>
    app.render(req, res, '/songs/[id]', req.params)
  );

  server.get('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3001;

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> ready on port ${port}...`)
  })
});

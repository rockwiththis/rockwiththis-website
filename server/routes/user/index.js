const express = require('express');
const router = express.Router();
const database = require('../../db');

router.post('/signin', (req, res) => {
  console.log('signing in');
  res.json({
    error: "not implemented yet"
  });
});

router.post('/', (req, res) => {

  if (!req.sessionId) {
    console.log('Requires sign in');
    res.sendStatus(403);

  } else {
    console.log('Create user');
  }
});

router.delete('/', (req, res) => {

  if (!req.sessionId) {
    console.log('Requires sign in');
    res.sendStatus(403);

  } else {
    console.log('Delete user');
  }
});

module.exports = router;

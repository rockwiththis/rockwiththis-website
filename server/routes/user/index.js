const express = require('express');
const router = express.Router();

const uuid = require('uuid/v4');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const database = require('../../db');
const {
  checkFoundUser,
  InvalidCredentialException
} = require('./util');

router.post('/signin', (req, res) => {
  console.log('signing in');

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      error: "Must provide username and password"
    });
  }

  return database.query({
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username]
  })
  .then(results => (
      results.rows.length = 1 ?
        checkFoundUser(result.rows[0].username, result.rows[0].password)
        Promise.reject(new InvalidCredentialException())
  ))
  .then((username, newSessionId) => (
      database.query({
        text: 'UPDATE users SET active_session_key = $1 where username = $2',
        values: [newSessionId, username]
      })
      .then(() => newSessionId)
  ))
  .then(sessionId => bcrypt.hash(sessionId, SALT_ROUNDS))
  .then(hashedSessionId => (
  .catch(e => (
      e instanceof InvalidCredentialException ?
        res.status(400).json({
          error: "Invalid credentials"
        }) :
        res.status(500).json({
          error: "Unexpected server error"
        });
  ))
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

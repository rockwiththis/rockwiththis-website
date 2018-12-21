const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const database = require('../../db');
const {
  checkSession,
  InvalidCredentialException
} = require('../../auth/util');

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
  .then(result => (
      result.rows.length == 1 ?
        result.rows[0] :
        Promise.reject(new InvalidCredentialException())
  ))
  .then(userRecord => bcrypt.compare(password, userRecord.password))
  .then(doesPasswordMatch => (
      doesPasswordMatch ?
        uuid() :
        Promise.reject(new InvalidCredentialException())
  ))
  .then(newSessionKey => (
      bcrypt.hash(newSessionKey, SALT_ROUNDS)
        .then(hashedKey => (
            database.query({
              text: 'UPDATE users SET active_session_key = $1 where username = $2',
              values: [newSessionKey, username]
            })
        ))
        .then(() => (
            res.json({
              sessionKey: newSessionKey,
              username: username
            })
        ))
  ))
  .catch(e => {
    if (e instanceof InvalidCredentialException) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    } else {
      console.log(e);
      return res.status(500).json({
        error: "Unexpected server error"
      });
    }
  });
});

router.post('/authenticate', (req, res) => {
  const sessionKey = req.body.sessionKey;
  if (!sessionKey) return res.json({ isAuthenticated: false });

  return checkSession(sessionKey)
    .then(() => { isAuthenticated: true })
    .catch(e => {
      console.log(e);
      return res.json({ isAuthenticated: false });
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

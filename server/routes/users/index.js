const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const SALT_ROUNDS = 10;

const database = require('../../db');
const {
  checkSession,
  InvalidCredentialException
} = require('../../auth/util');

const keyHash = key => bcrypt.hash(key, SALT_ROUNDS);

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
  .then(newSessionKey => {
    console.log(newSessionKey);
      return bcrypt.hash(newSessionKey, SALT_ROUNDS)
        .then(hashedSessionKey => {
          console.log(hashedSessionKey);
            return database.query({
              text: 'UPDATE users SET active_session_key = $1 where username = $2',
              values: [hashedSessionKey, username]
            })
        })
        .then(() => (
            res.json({
              sessionKey: newSessionKey,
              username: username
            })
        ))
  })
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

router.post('/authenticate', (req, res) => (
    checkSession(req.body)
      .then(() => res.json({ isAuthenticated: true }))
      .catch(e => {
        console.log(e);
        return res.json({ isAuthenticated: false });
      })
));

router.post('/logout', (req, res) => (
    checkSession(req.body)
      .then(result => (
          database.query({
            text: 'UPDATE users set active_session_key = null where username = $1',
            values: [result.username]
          })
      ))
      .then(() => res.status(200))
      .catch(e => {
        console.log(e);
        return res.status(500)
      })
));

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

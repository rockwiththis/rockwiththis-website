const express = require('express');
const router = express.Router();
const database = require('../../db');

router.post('/signin', (req, res) => {
  console.log('signing in');

  const { username, password } = req.body;
  if (!username || !password) return { error: "Invalid Input" };

  database.query({
    text: 'SELECT * FROM superadmins WHERE username = $1',
    values: [username]
  })
  .then(results => {
    if (results.rows.length = 1) {
      return bcrypt.compare(password, results.rows[0].password)
        .then(doesPasswordMatch => (
            doesPasswordMatch ?
            getNewSessionId(username) :
            credentialsInvalidResponse()
        ))
    } else {
      return credentialsInvalidResponse()
    }
  });
          

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

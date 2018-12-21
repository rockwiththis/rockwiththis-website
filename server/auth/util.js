const database = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Assumes `sessionKey` is defined
const checkSession = requestBody => (
  database.query({
    text: 'SELECT * FROM users WHERE username = $1',
    values: [requestBody.username]
  })
  .then(result => (
      result.rows.length == 1 ?
        result.rows[0] :
        Promise.reject(new InvalidCredentialException())
  ))
  .then(userRecord => (
      bcrypt.compare(requestBody.sessionKey, userRecord.active_session_key)
        .then(doesKeyMatch => (
            doesKeyMatch ?
              Promise.resolve(userRecord) :
              Promise.reject(new InvalidCredentialException())
        ))
  ))
);

function InvalidCredentialException() {
  this.message = "invalid credentials";
  this.stack = (new Error()).stack;
}
InvalidCredentialException.prototype = Object.create(Error.prototype);
InvalidCredentialException.prototype.name = "InvalidCredentialException";
InvalidCredentialException.prototype.constructor = InvalidCredentialException;

module.exports = {
  checkSession,
  InvalidCredentialException
}

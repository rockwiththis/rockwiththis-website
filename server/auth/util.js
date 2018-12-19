const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Assumes `sessionKey` is defined
const isSessionValid = sessionKey => (
  bcrypt.hash(sessionKey, SALT_ROUNDS)
    .then(hashedKey => (
        database.query({
          text: 'SELECT * FROM users WHERE active_session_key = $1',
          values: [hashedSessionKey]
        })
    ))
    .then(result => {
      if (result.rows.length > 1) {
        console.log("Found multiple matching users. Shit is weird. Returning false.")
      }
      return result.rows.length == 1;
    })
);

function InvalidCredentialException() {
  this.message = "invalid credentials";
  this.stack = (new Error()).stack;
}
InvalidCredentialException.prototype = Object.create(Error.prototype);
InvalidCredentialException.prototype.name = "InvalidCredentialException";
InvalidCredentialException.prototype.constructor = InvalidCredentialException;

module.exports = {
  isSessionValid,
  InvalidCredentialException
}

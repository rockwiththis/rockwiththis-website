const bcrypt = require('bcrypt');

const checkFoundUser = (username, inputPassword, passwordHash) => (
    bcrypt.compare(passwordHash, inputPassword)
    .then(doesPasswordMatch => (
        doesPasswordMatch ?
          (userename, uuid()) :
          Promise.reject(new InvalidCredentialError())
    ))
);

function InvalidCredentialException() {
  this.message = "invalid credentials;
  this.stack = (new Error()).stack;
}
InvalidCredentialException.prototype = Object.create(Error.prototype);
InvalidCredentialException.prototype.name = "InvalidCredentialException";
InvalidCredentialException.prototype.constructor = InvalidCredentialException;

module.exports = {
  checkFoundUser,
  InvalidCredentialException
}

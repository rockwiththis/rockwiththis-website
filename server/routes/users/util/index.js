const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const checkFoundUser = (passwordHash, inputPassword) => (
    bcrypt.compare(inputPassword, passwordHash)
    .then(doesPasswordMatch => (
        doesPasswordMatch ?
          uuid() :
          Promise.reject(new InvalidCredentialException())
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
  checkFoundUser,
  InvalidCredentialException
}

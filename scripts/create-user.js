const prompt = require('prompt');
const database = require('../server/db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const authSchema = {
  properties: {
    username: {
      message: 'Your Username',
      required: true,
      warning: 'Must provide a username'
    },
    password: {
      message: 'Your Password',
      hidden: true,
      required: true,
      warning: 'Must provide a username'
    }
  }
};

const createSchema = {
  properties: {
    username: {
      message: 'New Username',
      validator: /^[\w\-]+$/,
      warning: 'Must provide a username with only letters, numbers, underscores or dashes.',
      required: true
    },
    password: {
      message: 'New Password',
      hidden: true,
      required: true,
      warning: 'Must provide a password'
    },
    firstName: {
      message: 'First Name',
      validator: /^[a-zA-Z\-]+$/,
      warning: 'What are you, a robot?',
      required: true
    },
    lastName: {
      message: 'Last Name',
      validator: /^[a-zA-Z\-]+$/,
      warning: 'What are you, a robot?',
      required: true
    },
    isSuperadmin: {
      message: 'Is Superadmin (t/f)?',
      validator: /^[tf]$/,
      warning: "Reply must be 't' or 'f'",
      required: true
    },
    isCurator: {
      message: 'Is Curator (t/f)?',
      validator: /^[tf]$/,
      warning: "Reply must be 't' or 'f'",
      required: true
    }
  }
};

const getPromptAsync = props => (
    new Promise((resolve, reject) => {
      prompt.get(props, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
)

const logErrorAndContinue = msg => {
  console.log(msg);
  return new Promise((resolve, reject) => resolve())
}

const logUnexpectedError = () =>
  console.log("\nUnexpected error. Did not create new superuser.\n");

const queryDoesSuperuserExist = username => (
    database.query({
      text: 'SELECT * FROM users WHERE username = $1 AND is_superadmin = true',
      values: [username]
    })
    .then(results => results.rows.length > 0)
)

const saveNewUser = (username, password, firstName, lastName, isSuperadmin, isCurator) => (
    bcrypt.hash(password, saltRounds)
      .then(hashedPassword => (
          database.query({
            text: 'INSERT INTO users (username, password, first_name, last_name, is_superadmin, is_curator) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [username, hashedPassword, firstName, lastName, isSuperadmin, isCurator]
          })
          .then(() => console.log('\nSuccessfully added new user!\n'))
          .catch(e => console.log(e))
      ))
)

const processNewUser = ({ username, password, firstName, lastName, isSuperadmin, isCurator }) => (
    queryDoesSuperuserExist(username)
      .then(doesSuperuserExist => {
        if (doesSuperuserExist)
          return logErrorAndContinue("\nSorry, That superuser username already exists.\n");
        else
          return saveNewUser(username, password, firstName, lastName, isSuperadmin, isCurator);
      })
)

const processSignIn = ({ username, password }) => (
    database.query({
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    })
    .then(results => {
      if (results.rows.length == 1) {
        return bcrypt.compare(password, results.rows[0].password)
          .then(doesPasswordMatch => {
            if (doesPasswordMatch)
              return getPromptAsync(createSchema).then(processNewUser);
            else
              return logErrorAndContinue("\nYour username and/or password is incorrect\n");
          });
      } else {
        return logErrorAndContinue("\nYour username and/or password is incorrect\n");
      }
    })
)

prompt.start();

// TODO make main method more functional
getPromptAsync(authSchema)
  .then(processSignIn)
  .catch(e => {
    console.log(e)
    logUnexpectedError()
  })
  .then(r => process.exit(0));


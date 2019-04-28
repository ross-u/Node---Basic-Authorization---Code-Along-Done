const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const zxcvbn = require('zxcvbn');

// Require `bcrypt` to hash passwords and specify number for salt rounds
const bcrypt = require('bcrypt');
const saltRounds = 10;

// POST   '/signup'
router.post("/", (req, res, next) => {
  // Deconstruct the `username` and `password` from request body
  const { username, password } = req.body;

  // Check if `username` and `password` are empty and display error message
  if (username === '' || password === '') {
    res.render('auth/signup',
      { errorMessage: 'Indicate a username and a password to sign up' }
    );
    return;
  }

  if (zxcvbn(password).score < 3) {
    res.render('auth/signup',
      { errorMessage: 'Password too weak, try again' }
    );
    return;
  }

  // Query the users collection and to check username and password 
  User.findOne({ username })
    .then((user) => {

      // > if `username` already exists in the DB and display error message
      if (user !== null) {
        res.render('auth/signup', { errorMessage: 'The username already exists' });
        return;
      }

      // > If `username` doesn't exist generate salts and hash the password 
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);


      // > After hashing the password, create new user in DB and redirect to home 
      User.create({ username, password: hashedPassword })
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err));

      // catch errors from User.findOne
    }).catch((err) => next(err));

});

// GET  '/signup'   home page. 
router.get('/', (req, res, next) => res.render('auth/signup'));

module.exports = router;

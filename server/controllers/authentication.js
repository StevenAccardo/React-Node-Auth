//Handles all of the authentication for our application

//imports the model class
const User = require('../models/user');
//imports the JSON Web Token encode and decode module for node.js
const jwt = require('jwt-simple');
//imports our secret code for encoding
const config = require('../config');

//User model as arg
//creates a JWT for the user
function tokenForUser(user) {
  //Creates a timestamp by using the getTime() method.
  const timestamp = new Date().getTime();
  //1st arg is info we want to encode, 2nd arg is secret string to encode
  //as a convention json web tokens (JWTs) have a sub property, sub is short for subject.
  //iat is also a JWT convention and stands for "issued at time"
  //We encode the user.id because the user's email can change over time, but the ID will remain constant
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

//exports exports the signin function as a module
//handles a request coming in from /signin
exports.signin = function(req, res, next) {
  //User has already had their email and password auth'd, now they just need token
  //calls the tokenForUser method to send a token back to the user
  //req.user is available because the middleware passed the user model into the the done() method, which passport then placed that user model onto the req object. You can find this code in services/passport.js directory.
  res.send({ token: tokenForUser(req.user) });
};

//handles a request coming in from /signup
exports.signup = function(req, res, next) {
  //pulls off the email and password properties after they have been parsed by bodyParser
  const email = req.body.email;
  const password = req.body.password;

  //checks to ensure there is a password and e-mail, if not, sends back an error status and message.
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with a given email already exists in the DB
  //existing user will be undefined unless there is already an instance of that e-mail in the database.
  //err will have a value if there was an issue connecting to the database or something similar
  User.findOne({ email: email }, function(err, existingUser) {
    //database error
    if (err) {
      return next(err);
    }

    //If user with email does exist, return an Error
    if (existingUser) {
      //returns an http status code of 422, unprocessable entity.
      return res.status(422).send({ error: 'Email is in use' });
    }

    //If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    //saves newly created user to the DB
    user.save(function(err) {
      //If there is an error, pass that error on.
      if (err) {
        return next(err);
      }
      //Respond to request indicating the user was created, and pass back the JWT for the user to store
      res.json({ token: tokenForUser(user) });
    });
  });
};

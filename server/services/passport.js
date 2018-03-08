const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Setup options for JWT JWTStrategy
//JWTs can sit anywhere in a request, header, body, and etc.
const jwtOptions = {
  //Tells the JwtStrategy where to look for the token on the request, in this case in the header title authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  //gives the JwtStrategy the secret that it will need to decode the payload
  secretOrKey: config.secret
};

//Create JWT Strategy
//1st arg, payload, is the decoded JWT token, it will be the object we created earlier on the initial signup with the sub and iat properties.
//2nd arg, done, is a call back function that we need to call if we successfully authenticate the user
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if the user ID in payload exists in our Database
  //err is only returned with a value if there is an error, otherwise it is null
  //user would be the record that was found during the query
  User.findById(payload.sub, function(err, user) {
    //if error, return error and done is false
    if (err) {
      return done(err, false);
    }
    //If it does, call 'done' with that user object
    //if user record exists, err is null and pass done the record
    if (user) {
      done(null, user);
      //otherwise, call done without a user object
      //if user is not found, err is null because there wasn't error, but done is passed false instead
    } else {
      done(null, false);
    }
  });
});

//Tell passport to use this strategy
passport.use(jwtLogin);

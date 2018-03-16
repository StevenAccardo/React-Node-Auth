//routes the incoming requests to their corresponding controllers

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

//imports passport to assist with authentication.
const passport = require('passport');

//The "session: false" property stops passport from making a cookie based session for the login request, which is default functionality for passport. Since we are using tokens, we don't want that.
//The first arg is the strategey we are using, in this case the JSON Web Token strategy
const requireAuth = passport.authenticate('jwt', { session: false });
//in this case the local strategy, which is used when users login with a username (email in our case) and password
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  //any post request from /signup will be handled by the signup function in the authentication controller file
  //http route handlers can be passed multiple functions which will act as middlewares before the last function is executed
  //In this case whenever a user hits the root route, the request will first be routed through the jwt authentication via requireAuth, and then if it passes, it will be sent on to the final function argument.
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  //requires the request to go through middleware, where the user will have to be authenticated via requireSignin before it is passed to the route handler Authentication.signin
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};

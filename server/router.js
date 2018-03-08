//routes the incoming requests to their corresponding controllers

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//The session: false property stops passport from making a cookie based session for the login request, which is default functionality for passport. Since we are using tokens, we don't want that.
//The first arg is the strategey we are using
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {
  //any post request from /signup will be handled by the signup function in the authentication controller file
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signup', Authentication.signup);
};

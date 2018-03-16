const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//allows us to hash and salt our user's password that is being stored on the database
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  //by using the unique: true property, MongoDB will confirm that it is the only instance of that e-mail within the document before it will save the new input.
  //The lowercase true property is used because mongo is case sensitive when it looks for uniqueness, therefore if a user tries to create an account with a duplicate e-mail, but with all caps, mongo will accept it, which is not what we want. To avoid this, we set everything to lowercase.
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
//The .pre() method, says before saving a model, run this function.
userSchema.pre('save', function(next) {
  //this actually points to the user model
  const user = this;

  //the genSalt() method generates a salt, which is just a random string of characters, in order to help encrypt the user's PW on the DB. The salt gets appended onto the end of the hash password. Salt adds an additonal level of security in case a someone has hash tables.
  //1st arg is number of reounds, 10 by default
  //2nd arg is callback in which the error and salt are passed.
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    //hash(encrypt) our password using the salt
    //1st arg is data to be encrypted, the user pw in this case
    //2nd arg is the salt that was created above
    //3rd arg is optional and is a callback to be used to signal progress during the hash calculation
    //4th is the callback to be fired when the hashing is complete. passing in any errors, or the completed hashed PW
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      //overwrite plain text password with encrypted password
      //The encrypted password contains both a hash and a salt, they are distictevly different.
      user.password = hash;
      next();
    });
  });
});

//Whenever we create a user object, it will have access to any methods we define on this methods property.
//Passes in the newly entered password in order to compare it with the stored password on the user record.
//Callback will be passed in at the time when .comprarePassword() is invoked.
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  //this is a reference to our user model, so this.password accesses the salted + hashed password
  //bcrypt is salting and hashing the candidate pw and then comparing it to the one we have in the record. It is not decoding the pw in the record to match the two string passwords.
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

// Creates the model class, so that we can create new users
//The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural version of your model name. Thus, the model user is for the users collection in the database. The .model() function makes a copy of schema. Make sure that you've added everything you want to schema before calling .model()!
//The 2nd arg is the Schema that we just created above.
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;

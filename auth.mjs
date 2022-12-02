import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model("User");

const startAuthenticatedSession = (req, user, cb) => {
  req.session.regenerate((err) => {
    if(!err) {
      req.session.user = user;
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
  req.session.destroy((err) => {
    cb(err);
  });
};


const register = (name, username, email, password, role, errorCallback, successCallback) => {
    User.findOne({username: username}, (err, result) => {
        if(err) {
        errorCallback({message: "Database Search Error"}); // what's the errObj here??
        } else if(!err && result) { // found existing user with that username
            errorCallback({message: "Username Already Exists"});
        } else { // no error & username hasn't been used yet
            if(role == "") {
                errorCallback({message: "Must Choose A Role"});
            } else { // valid role was chosen
                // create new user
                bcrypt.hash(password, 10, (err, hash) => {
                    if(err) {
                        errorCallback({message: "Hashing Error"});
                    } else { // create new user document and save it to User collection
                        new User({
                            name: name,
                            username: username,
                            email: email,
                            password: hash,
                            role: role,
                            savedPlaces: [],
                            reviews: []
                        }).save((err, userObject) => {
                            if(err) {
                                console.log(err);
                                errorCallback(err);
                                // errorCallback({message: "Document Save Error"});
                            } else {
                                successCallback(userObject);
                            }
                        });
                    }
                });
            }
        }
    });
};

const login = (username, password, errorCallback, successCallback) => {
  User.findOne({username: username}, (err, user) => {
    if(err) {
      errorCallback({message: "DATABASE SEARCH ERROR"});
    } else if(!err && !user) {
      errorCallback({message: "USER NOT FOUND"});
    } else { // no error, username exists
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(err) {
          errorCallback({message: "PASSWORD CHECKING ERROR"});
        } else if(!err && passwordMatch) {
          successCallback(user);
        } else { // no error but password doesn't match
          errorCallback({message: "PASSWORDS DO NOT MATCH"});
        }
      });
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.json({error: "Login Error"}); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};

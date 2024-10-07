const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Adjust the path as necessary

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validatePassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user'); // Adjust the path as necessary

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, role, firstName, lastName, age, address, phone, avatar } = req.body;

    const newUser = new User({ username, email, role: role || 'user' });
    newUser.setPassword(password);

    newUser.profile = {
      firstName,
      lastName,
      age,
      address,
      phone,
      avatar
    };

    await newUser.save();

    req.login(newUser, function(err) {
      if (err) {
        console.log(err);
        return res.redirect('/signup');
      }
      return res.redirect('/Home');
    });
  } catch (err) {
    console.log(err);
    res.redirect('/signup');
  }
});

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const multer = require('multer')
const path = require ('path');
const passport = require ('passport')
const LocalStrategy = require('passport-local');
//const passportLocalMongoose = require('passport-local-mongoose');

const crypto = require('crypto');

const User = mongoose.model('User', schemas.userSchema);
const Item = mongoose.model('Item', schemas.itemSchema);
const Hotel = mongoose.model('Hotel', schemas.hotelSchema);
const Reservation = mongoose.model('Reservation', schemas.reservationSchema);

// Passport session setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//login
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/Home');
});

app.get('/signup', function(req,res){
  res.render('signup');
})

app.get('/Home', function(req, res) {
  if (req.isAuthenticated()){
   res.render("home")
  }else{
   res.redirect('/login');
 }});

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password, email, role, firstName, lastName, age, address, phone, avatar } = req.body;

  try {
    const newUser = new User({
      username,
      email,
      role,
      profile: { firstName, lastName, age, address, phone, avatar }
    });

    User.register(newUser, password, function (err, user) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error signing up');
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/Home');
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error signing up');
  }
});


// Route to logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const hasRole = (role) => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    return next();
  }
  res.status(403).send('Access denied');
};

// Protected route example
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('This is a protected route.');
  } else {
    res.redirect('/login');
  }
});

// Route for adding a new item
app.post('/add', upload.array('images', 7), async (req, res) => {
  try {
    const newItemData = {
      name: req.body.name,
      shortDetail: req.body.shortDetail,
      detail: req.body.detail,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      address: req.body.address,
      hotels: req.body.hotels, // Assuming hotels is an array of Hotel references
      category: req.body.category,
      specialDate: {
        day: parseInt(req.body.specialDay),
        month: parseInt(req.body.specialMonth)
      },
      images: []
    };

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        newItemData.images.push(`/uploads/${file.filename}`); // Store the file path
      });
    }

    const newItem = await Item.create(newItemData);
    res.send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

app.post('/addHotel', async (req, res) => {
  try {
    const newHotelData = {
      name: req.body.name,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      amenities: req.body.amenities,
      rating: req.body.rating,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website
    };

    const newHotel = await Hotel.create(newHotelData);
    res.send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});


app.get('/items', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.json(items); // Send items as JSON response
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});
module.exports = { isAuthenticated, hasRole, router };
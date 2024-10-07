require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const passport = require('passport');
const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { error, log } = require("console");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');

//app declarations
const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));


app.use(session({
  secret:'keyboardoncat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly:true,
    secure: false,
    maxAge:1000 * 60 * 60 * 24, //1 day session
  } // process.env.NODE_ENV === 'production' }
}));

//passport.js
app.use(passport.initialize());
app.use(passport.session());

//mongodb config
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/atnwebDB")
  .then(() => console.log("DB Connected")
)
  .catch(err => console.log(err));

// Define user schema
const userSchema = new mongoose.Schema({
  googleID: { type: String, required: false, unique: true },
  username: { type: String, required: true }, // Ensuring username is unique
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  role: { type: String, default: 'user' },
  googleID_json: { type: JSON },
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    address: String,
    phone: String,
    avatar: String
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }
});
//userSchema.index({ googleID: 1, username: 1 }, { unique: true });
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model('User', userSchema);


// Define hotel schema
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5 },
  amenities: [{ type: String }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  created_at: { type: Date, default: Date.now }
});
const Hotel = mongoose.model('Hotel', hotelSchema);

// Define item schema
const itemSchema = new mongoose.Schema({
  name: { type: String },
  shortDetail: { type: String },
  detail: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
  place_id: { type: String },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  images: [{ type: String }],
  category: { type: String },
  specialDate: {
    day: { type: Number, required: true },
    month: { type: Number, required: true },
  },
  created_at: { type: Date, default: Date.now }
});

const Item = new mongoose.model('Item', itemSchema);

// Define reservation schema
const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  reservationDate: { type: Date, required: true, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  //totalPrice: { type: Number, required: true },
  specialRequests: { type: String, default: '' },
  numberOfPersons: { type: Number }
    // personalOrFamily: {
    //   type: String,
    //   enum: ['personal', 'family'],
    //   default: 'personal'
    // },
    // family: { type: Number, default: 0 },
    // adults: { type: Number, required: true },
    // kids: { type: Number, default: 0 },
    // husband: { type: Number, default: 0 },
    // wife: { type: Number, default: 0 }
  //}
});
const Reservation = new mongoose.model('Reservation', reservationSchema);

const FeedbackSckema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  feedback: { type: String },
});
const Feedback = new mongoose.model('Feedback', FeedbackSckema);

// Passport session setup
//passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  console.log('inside serialize user');
  //console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('inside deserialiser');
  console.log(`Deserializing User ID: ${id}`);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/secrets",
  scope: ["profile", "email"]
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    // Check if we can find a user by Google ID
    //let user = await User.findOne({ googleID: profile.id });

    if (!email) {
      // If email is not available, redirect to an error page or show a form to manually add an email
      return done(null, false, { message: 'No email found in your Google account. Please sign up manually.' });
    }
    let user = await User.findOne({ email });
    if (user) {
      // Step 2: If user exists and googleID is "***", update their Google profile
      if (user.googleID === "***" || !user.googleID) {
        user.googleID = profile.id;
        user.profile.firstName = profile.name.givenName;
        user.profile.lastName = profile.name.familyName;
        user.profile.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : user.profile.avatar;
        user.googleID_json = profile._json;

        // Save updated user data
        await user.save();
      }
      return done(null, user);
    }
      else if (!user) {
       user = new User({
        googleID: profile.id,
        username: email || `user_${profile.id}`,
        email: email,
        googleID_json: profile._json,
        isVerified:true,
        profile: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        }
      });

      await user.save();

    return done(null, user);
  }} catch (err) {
    console.error('Error in Google OAuth:', err);
    return done(err);
  }
}
));

// Route to authenticate with Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Google OAuth callback
app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect to home
    //res.redirect('http://localhost:3000/');
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/');
  });


app.post('/cleanup', async (req, res) => {
  try {
    await User.deleteMany({ email: null });
    res.send('Successfully deleted documents with null email');
  } catch (err) {
    console.error('Error deleting documents with null email:', err);
    res.status(500).send('Error cleaning up database');
  }
});



// Handle the response where email is missing
app.get("/email-form", (req, res) => {
  res.render("emailForm"); // Render a form where the user can provide their email
});

app.post("/submit-email", (req, res) => {
  // Process the email and link it to the user's profile
});


async function fetchUserEmail(token) {
  // Make an API call with the accessToken to fetch more user data
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Google OAuth2 setup
const oauth2Client = new OAuth2(
  process.env.CLIENT_IDGMIL, // Client ID from Google Cloud
  process.env.CLIENT_SECRETGMIL, // Client Secret from Google Cloud
  'https://developers.google.com/oauthplayground' // Redirect URL (or your own)
);
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_IDGMIL, process.env.CLIENT_SECRETGMIL, REDIRECT_URL)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN })

// Create transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER, // Your Gmail address
    clientId: process.env.CLIENT_IDGMIL,
    clientSecret: process.env.CLIENT_SECRETGMIL,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: oauth2Client.getAccessToken() // Get access token from OAuth2 client
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Server is ready to take our messages:', success);
  }
});

// Generate verification token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Route to handle email verification after signup
app.post('/signup', async (req, res) => {
  const { username, password, role, firstName, lastName, age, address, phone, avatar } = req.body;
  
  const googleID = "***";  // Replace this with actual googleID logic, if applicable

  try {

    const existingUser = await User.findOne({ email: username });

    if (existingUser) {
      // Step 2: If the user was registered using Google, inform them to log in using Google
      if (existingUser.googleID) {
        return res.status(400).json({
          message: 'This email is associated with a Google account. Please log in using Google.'
        });
      }
      
      // Optional: Inform if the email is in use by another method
      return res.status(400).json({
        message: 'This email is already in use. Please log in or use a different email.'
      });
    }
    const token = crypto.randomBytes(32).toString('hex');  // Generate token for verification

    // Creating a new user object
    const newUser = new User({
      username,
      googleID,
      email: username,  // Assuming email is the username
      role,
      profile: { firstName, lastName, age, address, phone, avatar },
      verificationToken: token,
      isVerified: false,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    });

    // Register the user (using callback)
    User.register(newUser, password, (err, user) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Error signing up');
      }

      // Prepare and send verification email
      const verificationLink = `http://localhost:4000/verify-email?token=${token}&username=${username}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: username,  // Sending the email to the user's username, assuming it's their email
        subject: 'Email Verification',
        text: `Please verify your email by clicking the link: ${verificationLink}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending verification email:', error);
          return res.status(500).send('Error sending verification email');
        }
        res.status(200).send('Sign up successful. Check your email to verify your account.');
      });
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send('Error during signup');
  }
});

// Route to verify email
app.get('/verify-email', async (req, res) => {
  const { token, username } = req.query;

  try {
    const user = await User.findOne({
      username,
      verificationToken: token,
     // verificationTokenExpires: { $gt: Date.now() }  // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).send('Invalid token or user not found');
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;  // Clear the verification token
   // user.verificationTokenExpires = null;  // Clear the token expiration field
    await user.save();

    res.send(`
      <script>
        alert('Email verified successfully. You can now log in.');
        window.location.href = 'http://localhost:3000/login';  // Redirect to login page
      </script>
    `);
    } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).send('Error verifying email');
  }
});

//
// POST /forgot-password route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the reset token in the user's record or in a password reset table
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the token to user's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset email', error });
  }
});

//// POST /reset-password/:token route
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password; // Hash the password before saving (you can use bcrypt for this)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

// Route to log in user
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send('Invalid username or password');
    if (!user.isVerified) {
      return res.status(401).send('Email not verified');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.send('Logged in successfully');
    });
  })(req, res, next);
});

// Handle the response when email is missing (for Google OAuth)
app.get('/email-form', (req, res) => {
  res.render('emailForm'); // Render a form where the user can provide their email
});

app.post('/submit-email', (req, res) => {
  // Process the email and link it to the user's profile
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});



// Authentication middleware function
const isAuthenticated = (req, res, next) => {
  console.log('Checking authentication...');
  if (req.isAuthenticated()) {
      console.log('User is authenticated:', req.user);
      return next();
  }
  console.log('User is not authenticated. Redirecting to login.');
  res.status(401).json({ message: 'Unauthorized: Please log in first.' });
};

// Middleware to check role
const hasRole = (role) => (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === "officer" || req.user.role===" admin")) {
    return next();
  }
  res.status(403).send('Access denied');
};

// Handle user profile fetch
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Send the authenticated user's profile data
  } else {
    res.status(401).send('Unauthorized');
  }
});
  
app.get('/', isAuthenticated, (req, res) => {
  res.send('Welcome to the homepage');
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

    // Process and store image file paths
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        newItemData.images.push(`/uploads/${file.filename}`); // Store the file path
      });
    }

    // Create a new instance of the Item model
    const newItem = new Item(newItemData);

    // Save the new item to the database
    await newItem.save();

    res.send('New Item data inserted successfully');
  } catch (error) {
    console.error('Error inserting new Item data:', error);
    res.status(500).send('Error inserting new Item data');
  }
});

// Route for adding a new hotel
app.post('/addHotel', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
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
    res.send('New Hotel data inserted  successfully');
  }
  else {
    res.status(500).send('Error inserting new Hotel');

  }} catch (error) {
    console.error('Error inserting new Hotel:', error);
    res.status(500).send('Error inserting new Hotel');
  }
});

// Route for adding a new feedback
app.post('/addFeedback',  async (req, res) => {
  try {
    const newFeedbackData = {
      feedback: req.body.feedback
    };

    const newFeedback = await Feedback.create(newFeedbackData);
    res.send('The Feedback is inserted successfully');
    //res.redirect('/Home');
  } catch (error) {
    console.error('Error on inserting the Feedback', error);
    res.status(500).send('Error on inserting the Feedback');
  }
});

// Route for recording a new request to Reserv
app.post('/addRequest', isAuthenticated, async (req, res) => {
  try {
    const newReservationData = {
       user: req.user._id,
       item: req.item,
       reservationDate: req.body.website,
       startDate: req.body.startDate,
       endDate: req.body.endDate,
       status:  'pending',
       totalPrice: 0,
       specialRequests: req.body.specialRequests,
       numberOfPersons: req.body.numberOfPersons,
       personalOrFamily: 'personal',
       family:  0 ,
       adults: 0,
       kids: 0,
       husband:  0 ,
       wife:0 
    };

    const newReservation = await Reservation.create(newReservationData);
    res.send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// Route to fetch all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.json(items); // Send items as JSON response
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

// Route to fetch selected item
app.get('/viewDetail', async (req, res) => {
  const selectedItem_id = req.query.item_id;
  
  try {
    const item = await Item.findById(selectedItem_id); // Find item by ID
    if (item) {
      res.json(item); // Send the item as JSON response
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).send('Error fetching item');
  }
});

// Route to fetch selected item details
app.get('/viewDetail/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  try {
    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).send('Error fetching item');
  }
});

// Route to update an item
app.put('/updateItem/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  const { name, detail, address } = req.body;
  const images = req.files; // Use a library like multer to handle file uploads

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      item_id,
      { name, detail, address, images }, // Make sure to handle images accordingly
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Error updating item');
  }
});

// recording reservation
app.post('/reservation/:item_id', isAuthenticated, async (req, res) => {
  try {
    // Since we applied isAuthenticated as middleware, we know req.user exists here
    const newReservationData = {
      user: req.user._id,  // req.user._id from authenticated user
      item: req.params.item_id,  // Item ID from URL
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      numberOfPersons: req.body.personNo,
      specialRequests: req.body.specialRequest
    };

    const newReservation = await Reservation.create(newReservationData);


 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER, // Your Gmail address
        clientId: process.env.CLIENT_IDGMIL,
        clientSecret: process.env.CLIENT_SECRETGMIL,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken() // Get access token from OAuth2 client
      }
    });

    const mailOptions = {
      to: req.user.email,
      from: process.env.EMAIL_USER,
      subject: 'Reservation Confirmation',
      text: `Dear ${req.user.username}, your reservation has been confirmed for item ${req.params.item_id}. Your booking dates are from ${req.body.startDate} to ${req.body.endDate}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Server error: Could not send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).json({ message: 'Reservation created and confirmation email sent', reservation: newReservation });
      }
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Server error: Could not create reservation' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

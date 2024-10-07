require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
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
  secret: process.env.SESSION_SECRET || 'keyboard on cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
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
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
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
    let user = await User.findOne({ googleID: profile.id });

    if (!email) {
      // If email is not available, redirect to an error page or show a form to manually add an email
      return done(null, false, { message: 'No email found in your Google account. Please sign up manually.' });
    }

    if (!user||googleID==='***') {
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
    }

    return done(null, user);
  } catch (err) {
    console.error('Error in Google OAuth:', err);
    return done(err);
  }
}));

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

//email varification
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Or 587 if using TLS
  secure: true, // Use true for 465, false for 587
  //service: 'gmail', // or any email service you use
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS // your email password
  }
});
transporter.verify((error,success) => {
if (error){
  console.log(error)
}else{
  console.log("ready for message");
  console.log(success);
}
})

// Generate verification token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Route to handle email verification after signup
app.post('/signup', async (req, res) => {
  const { username, password, role, firstName, lastName, age, address, phone, avatar } = req.body;
  
  const googleID = "***";  // Replace this with actual googleID logic, if applicable

  try {
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

    res.send('Email verified successfully. You can now log in.');
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).send('Error verifying email');
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
// old
//app.post('/login', (req, res, next) => {
//   User.findOne({ username: req.body.username }, (err, user) => {
//     if (err) { return next(err); }
//     if (!user) { return res.status(401).send('No user found'); }
//     if (!user.isVerified) {
//       return res.status(401).send('Email not verified');
//     }
    
//     passport.authenticate('local')(req, res, function () {
//       res.send('Logged in successfully');
//     });
//   });
// });
// Login route
// app.post('/login', passport.authenticate('local'), (req, res) => {
//   res.send('Logged in successfully');
// });


// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


// Handle user profile fetch
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Send the authenticated user's profile data
  } else {
    res.status(401).send('Unauthorized');
  }
});
  
// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
app.get('/', isAuthenticated, (req, res) => {
  res.send('Welcome to the homepage');
});
// Middleware to check role
const hasRole = (role) => (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === "officer" || req.user.role===" admin")) {
    return next();
  }
  res.status(403).send('Access denied');
};

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
app.post('/addHotel', isAuthenticated, async (req, res) => {
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
    res.send('New Hotel data inserted  successfully');
  } catch (error) {
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

// recording reservation
app.post('/reservation/:item_id', async (req, res) => {
  // Ensure you use POST to receive req.body data
  const newReservation = {
      user: req.user._id,  // req.user_id should come from a middleware if available
      item: req.params.item_id,
      startDate: req.body.startDate,  // Ensure this data is passed correctly
      endDate: req.body.endDate,
      numberOfPersons: req.body.personNo,
      specialRequests: req.body.specialRequest
  };

  const newHotel = await Reservation.create(newReservation);
  res.send('Data inserted successfully');
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

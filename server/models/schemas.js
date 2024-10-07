const mongoose = require("mongoose");
const crypto = require('crypto');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
//const uuidv1 = require('uuid/v1');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  //email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user', required: true },
  password: { type: String, required: true },
  profile: {
    firstName: String,
    lastName: String,
    age: Number,
    address: String,
    phone: String,
    avatar: String
  }
});

// //Add the password hashing and validation logic
// userSchema.methods.setPassword = function(password) {
//   this.hashed_password = crypto.createHash('sha256').update(password).digest('hex');
// };

// userSchema.methods.validatePassword = function(password) {
//   const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
//   return this.hashed_password === hashedPassword;
// };
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);

// Define hotel schema
const hotelSchema = new Schema({
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

module.exports = mongoose.model('Hotel', hotelSchema);
// Define image schema
//const imageSchema = new Schema({
  //filename: { type: String  },
  //data: { type: Buffer} // Using Buffer type for binary data
//});

// Define item schema
const itemSchema = new Schema({
  name: { type: String },
  shortDetail: { type: String },
  detail: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String },
  place_id: { type: String },
  hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
  images: [{ type: String }],
  category: { type: String },
  specialDate: {
    day: { type: Number, required: true },
    month: { type: Number, required: true },
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);

// Define reservation schema
const reservationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  reservationDate: { type: Date, required: true, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  specialRequests: { type: String, default: '' },
  numberOfPersons: {
    personalOrFamily: {
      type: String,
      enum: ['personal', 'family'],
      default: 'personal'
    },
    family: { type: Number, default: 0 },
    adults: { type: Number, required: true },
    kids: { type: Number, default: 0 },
    husband: { type: Number, default: 0 },
    wife: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
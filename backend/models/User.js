const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,        // Added phone field
  city: String,         // Added city field
  pincode: String       // Added pincode field
}, {
  timestamps: true      // Optional: adds createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
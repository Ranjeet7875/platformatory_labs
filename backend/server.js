require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const { dbConnect } = require("./Config/db.config");
const User = require("./models/User"); // Added missing User import
require("./Config/passport");

const PORT = 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Temporal API Backend Running");
});

// Trigger Google login
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle Google callback
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  function (req, res) {
    res.redirect("http://localhost:5173/profile");
  }
);

// Success/failure routes
app.get("/auth/success", (req, res) => {
  res.send("Login successful!");
});

app.get("/auth/failure", (req, res) => {
  res.send("Login failed");
});

// Profile route - API endpoint to get user data
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const { firstName, lastName, email, phone, city, pincode } = req.user;
    res.json({ firstName, lastName, email, phone, city, pincode });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Profile update route - FIXED with proper error handling
app.post("/profile/update", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { firstName, lastName, phone, city, pincode } = req.body;
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      {
        firstName,
        lastName,
        phone,
        city,
        pincode
      }, 
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the session user object
    req.user.firstName = firstName;
    req.user.lastName = lastName;
    req.user.phone = phone;
    req.user.city = city;
    req.user.pincode = pincode;

    res.json({ 
      message: "Profile updated successfully", 
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        pincode: updatedUser.pincode
      }
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Logout failed");
    req.session.destroy((err) => {
      if (err) return res.status(500).send("Session destroy failed");
      res.clearCookie('connect.sid');
      res.send("Logged out successfully");
    });
  });
});

// Start server
app.listen(PORT, () => {
  dbConnect();
  console.log(`Server running on port ${PORT}`);
});
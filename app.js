const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Passport config
require('./config/passport', passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads folder
app.set('view engine', 'ejs');

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/', profileRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
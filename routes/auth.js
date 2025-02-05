const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Register Page (GET)
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Register Handle (POST)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/auth/register');
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error registering user');
        res.redirect('/auth/register');
    }
});

// Login Page (GET)
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Login Handle (POST)
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

// Profile Page (GET)
router.get('/profile', (req, res) => {
    if (!req.user) {
        req.flash('error_msg', 'Please log in to view your profile');
        return res.redirect('/auth/login');
    }
    res.render('profile', { user: req.user });
});


module.exports = router;
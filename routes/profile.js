const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer to preserve file extensions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

// Profile Page (GET)
router.get('/profile', (req, res) => {
    if (!req.user) {
        req.flash('error_msg', 'Please log in to view your profile');
        return res.redirect('/auth/login');
    }
    res.render('profile', { user: req.user });
});

// Profile Update (POST)
router.post('/profile/update', upload.single('photo'), async (req, res) => {
    if (!req.user) {
        req.flash('error_msg', 'Please log in to update your profile');
        return res.redirect('/auth/login');
    }

    const user = await User.findById(req.user._id);

    // Delete the old photo if it exists
    if (user.profile.photo && req.file) {
        const oldPhotoPath = path.join(__dirname, '..', user.profile.photo);
        fs.unlink(oldPhotoPath, (err) => {
            if (err) console.error('Error deleting old photo:', err);
        });
    }

    const updates = {
        'profile.name': req.body.name,
        'profile.surname': req.body.surname,
        'profile.patronymic': req.body.patronymic,
        'profile.dateOfBirth': req.body.dateOfBirth,
        'profile.activityType': req.body.activityType,
        'profile.position': req.body.position,
        'profile.iin': req.body.iin,
        'profile.address': req.body.address,
        'profile.phoneNumber': req.body.phoneNumber,
        'profile.role': req.body.role,
    };

    if (req.file) {
        updates['profile.photo'] = `/uploads/${req.file.filename}`;
    }

    try {
        await User.findByIdAndUpdate(req.user._id, updates);
        req.flash('success_msg', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating profile');
        res.redirect('/profile');
    }
});

module.exports = router;
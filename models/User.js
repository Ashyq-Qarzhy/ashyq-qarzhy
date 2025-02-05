const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        photo: { type: String, default: '' }, // URL to the user's photo
        name: { type: String, default: '' },
        surname: { type: String, default: '' },
        patronymic: { type: String, default: '' },
        dateOfBirth: { type: Date, default: null },
        activityType: { type: String, default: '' }, // Job, Businessman, etc.
        position: { type: String, default: '' }, // Position in the activity
        iin: { type: String, default: '', match: /^\d{12}$/ }, // 12-digit IIN
        address: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        role: { type: String, enum: ['citizen', 'government'], default: 'citizen' }, // User role
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
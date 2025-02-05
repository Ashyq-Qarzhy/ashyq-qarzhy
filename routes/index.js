const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.render('index', { user: req.user }); // Pass the user object
});

module.exports = router;
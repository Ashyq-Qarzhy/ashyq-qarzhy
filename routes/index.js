const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

module.exports = router;
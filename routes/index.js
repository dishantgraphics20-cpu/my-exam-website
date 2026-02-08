const express = require('express');
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Aptitude Quest - Online Examination System',
        user: req.session.user 
    });
});

module.exports = router;

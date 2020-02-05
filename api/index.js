const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index.html');
});

router.get('/new', (req, res)=>{
    res.render('new.html');
});

router.get('/append', (req, res)=>{
    res.render('append.html');
});

module.exports = router;

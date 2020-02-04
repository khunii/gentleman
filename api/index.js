const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    //todo
    //페이지 표시 하기
    res.render('index.html');

});

router.get('/new', (req, res)=>{
    //todo
    //페이지 표시 하기
    res.render('new.html');

});

// router.get('/listapi', (req, res)=>{
//     //todo
//     //페이지 표시 하기
//     res.render('myapi.ejs');

// });

router.get('/append', (req, res)=>{
    //todo
    //페이지 표시 하기
    res.render('append.html');

});

module.exports = router;

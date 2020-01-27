const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    //todo
    //페이지 표시 하기
    res.render('index.html');

});
module.exports = router;

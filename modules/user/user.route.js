// route 
const express = require('express');
const router = express.Router();
const userCont = require('./user.cont');


router.post('/login', userCont.login);
router.post('/register', userCont.register);


module.exports = router;

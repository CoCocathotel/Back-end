// route 
const express = require('express');
const router = express.Router();
const homeCont = require('./home.cont');


router.get('/', homeCont.getHome);


module.exports = router;

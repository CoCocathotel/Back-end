// route 
const express = require('express');
const router = express.Router();
const homeCont = require('./home.cont');


router.get('/', homeCont.getHome);
router.post('/createHome', homeCont.createHome);


module.exports = router;

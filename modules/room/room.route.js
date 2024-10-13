// route 
const express = require('express');
const router = express.Router();
const roomCont = require('./room.cont');


router.get('/', roomCont.getRoom);
router.post('/createRoom', roomCont.createRoom);


module.exports = router;

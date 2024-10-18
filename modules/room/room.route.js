// route 
const express = require('express');
const router = express.Router();
const roomCont = require('./room.cont');


router.get('/', roomCont.getRoom);
router.get('/:type', roomCont.getOneRoom); 
router.post('/createRoom', roomCont.createRoom);


module.exports = router;

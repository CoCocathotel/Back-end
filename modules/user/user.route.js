const express = require('express');
const router = express.Router();
const userCont = require('./user.cont');

router.post('/login', userCont.login);
router.post('/register', userCont.register);
router.patch('/updateUser/:id', userCont.updateUser);
router.get('/getUser/:id', userCont.getUser); // New route for getting user details
router.patch('/changePassword/:id', userCont.changePassword);

module.exports = router;

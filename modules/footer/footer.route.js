const express = require('express');
const router = express.Router();
const homeCont = require('./footer.cont');


router.get('/', homeCont.getFooter);
router.post('/createFooter', homeCont.createFooter);
router.patch('/updateFooter/:id', homeCont.updateFooter);


module.exports = router;

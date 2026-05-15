const express = require('express');
const router = express.Router();
const userInfoController = require('../controllers/userInfoController');

router.post('/save', userInfoController.saveClerkUser);
router.get('/:clerkEmail', userInfoController.getUserByEmail);

module.exports = router;

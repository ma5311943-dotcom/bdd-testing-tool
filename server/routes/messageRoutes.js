const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.sendMessage);
router.get('/:userEmail', messageController.getMessages);
router.get('/contacts/list', messageController.getContacts); // Special route to get list of users who messaged
router.put('/:userEmail/read', messageController.markRead);

module.exports = router;

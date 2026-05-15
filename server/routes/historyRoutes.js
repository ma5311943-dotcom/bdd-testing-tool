const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/', historyController.addHistory);
router.get('/:email', historyController.getHistoryByEmail);

module.exports = router;

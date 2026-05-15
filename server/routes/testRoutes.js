const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/', testController.runTest);
router.post('/run-instant', testController.runInstantTestScenario);


module.exports = router;

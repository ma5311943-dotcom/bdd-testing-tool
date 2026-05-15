const express = require('express');
const router = express.router ? express.router : express.Router(); // fallback
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getSystemStats); // New
router.get('/users/:email/history', adminController.getUserHistory);
router.put('/users/:email/reset-tokens', adminController.resetUserTokens);
router.put('/users/:email/make-admin', adminController.makeAdmin); // New
router.delete('/users/:email', adminController.deleteUser);
router.delete('/history', adminController.clearAllHistory);

module.exports = router;

const express = require('express');
const router = express.Router();

const testRoutes = require('./testRoutes');
const userRoutes = require('./userRoutes');
const historyRoutes = require('./historyRoutes');
const adminRoutes = require('./adminRoutes');
const messageRoutes = require('./messageRoutes'); // New

router.use('/test', testRoutes);
router.use('/user', userRoutes);
router.use('/history', historyRoutes);
router.use('/admin', adminRoutes);
router.use('/messages', messageRoutes); // New


module.exports = router;

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true }, // 'admin' for admin
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // who sent it
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

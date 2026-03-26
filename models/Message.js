import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true }, // 'admin' for admin
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // who sent it
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;

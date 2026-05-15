const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { senderEmail, receiverEmail, content, role } = req.body;
        const msg = new Message({ senderEmail, receiverEmail, content, role });
        await msg.save();
        res.status(201).json(msg);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { userEmail } = req.params;
        // Fetch conversation between this user and admin
        const messages = await Message.find({
            $or: [
                { senderEmail: userEmail, receiverEmail: 'admin' },
                { senderEmail: 'admin', receiverEmail: userEmail }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        // Find all unique users who have sent messages to admin
        const senders = await Message.distinct('senderEmail', { receiverEmail: 'admin' });
        res.status(200).json(senders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contacts", error: error.message });
    }
};

exports.markRead = async (req, res) => {
    try {
        const { userEmail } = req.params;
        // Mark all messages FROM user TO admin as read (if admin is viewing)
        // OR messages FROM admin TO user as read (if user is viewing - complex, for now assume admin viewing user chat)
        await Message.updateMany(
            { senderEmail: userEmail, receiverEmail: 'admin', read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking read", error: error.message });
    }
}

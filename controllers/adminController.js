const User = require("../models/userInfo");
const History = require("../models/history");

exports.getAllUsers = async (req, res) => {
    try {
        // Sort by role (admin before user) and then by creation date
        const users = await User.find().sort({ role: 1, createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const { email } = req.params;
        const history = await History.find({ userEmail: email }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.resetUserTokens = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.normalTokens = 3;
        user.specialTokens = 3;
        await user.save();

        res.status(200).json({ message: "Tokens reset successfully", normalTokens: user.normalTokens, specialTokens: user.specialTokens });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.makeAdmin = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: `User ${email} is now an admin` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.params;
        await User.findOneAndDelete({ email });
        await History.deleteMany({ userEmail: email });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.clearAllHistory = async (req, res) => {
    try {
        await History.deleteMany({});
        res.status(200).json({ message: "All history successfully cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const scanCount = await History.countDocuments();

        res.status(200).json({
            users: userCount,
            totalScans: scanCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

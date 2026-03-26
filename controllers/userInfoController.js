// ===== Imports =====
const User = require("../models/userInfo");

// ===== Save Clerk User =====
exports.saveClerkUser = async (req, res) => {
    try {
        const { clerkId, email } = req.body;
        if (!clerkId || !email) return res.status(400).json({ message: "Invalid data" });

        let user = await User.findOne({ clerkId });
        if (!user) user = new User({ clerkId, email });
        else user.email = email;

        await user.save();
        res.status(200).json({ message: "User saved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ===== Get User By Email or ID =====
exports.getUserByEmail = async (req, res) => {
    try {
        const { clerkEmail } = req.params;
        // Try searching by email first, then by clerkId
        let user = await User.findOne({
            $or: [
                { email: clerkEmail },
                { clerkId: clerkEmail }
            ]
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        console.error("GET USER ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

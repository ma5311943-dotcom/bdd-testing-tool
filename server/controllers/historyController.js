const History = require("../models/history");

// ===== Save Test History =====
exports.addHistory = async (req, res) => {
    try {
        const { userEmail, url, result } = req.body;

        const history = new History({
            userEmail,
            url,
            result,
        });

        await history.save();

        res.status(201).json({ message: "History saved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ===== Get User History =====
exports.getHistoryByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const history = await History.find({
            userEmail: email,
        }).sort({ createdAt: -1 });

        res.status(200).json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    url: { type: String, required: true },
    result: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);

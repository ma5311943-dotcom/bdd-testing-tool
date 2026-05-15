require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userInfo");
const fs = require("fs");

async function count() {
    try {
        const mongoUri = process.env.MONGO_URI.replace("localhost", "127.0.0.1");
        await mongoose.connect(mongoUri);
        const total = await User.countDocuments();
        fs.writeFileSync("count_log.txt", `Total users in database: ${total}`);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync("count_log.txt", `Count failed: ${err.message}`);
        process.exit(1);
    }
}

count();

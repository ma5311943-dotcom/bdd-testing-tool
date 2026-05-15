const mongoose = require("mongoose");
const User = require("./models/userInfo");
const fs = require("fs");

async function standardizeEmails() {
    const logFile = "email_update_log.txt";
    fs.writeFileSync(logFile, "Starting email standardization via server...\n");

    try {
        // Assume mongoose is already connected since it's in server.js loop
        const users = await User.find({
            email: { $regex: /@(yahoo\.com|outlook\.com)$/ }
        });

        fs.appendFileSync(logFile, `🔍 Found ${users.length} users to update.\n`);

        let count = 0;
        for (const user of users) {
            const oldEmail = user.email;
            const newEmail = oldEmail.split("@")[0] + "@gmail.com";
            user.email = newEmail;
            await user.save();
            count++;
            if (count % 10 === 0) {
                fs.appendFileSync(logFile, `Progress: ${count}/${users.length}\n`);
            }
        }

        fs.appendFileSync(logFile, `✅ Successfully updated ${count} users to gmail.com\n`);
        return true;
    } catch (err) {
        fs.appendFileSync(logFile, `❌ Email update failed: ${err.message}\n`);
        throw err;
    }
}

module.exports = standardizeEmails;

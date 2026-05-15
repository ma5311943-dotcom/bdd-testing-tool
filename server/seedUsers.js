const mongoose = require("mongoose");
const User = require("./models/userInfo");
const fs = require("fs");

const logFile = "seed_log.txt";
function log(msg) {
    const time = new Date().toISOString();
    const line = `[${time}] ${msg}\n`;
    fs.appendFileSync(logFile, line);
    console.log(msg);
}

const names = [
    "Moeen", "Shakeel", "Talha", "Fahad", "Haris", "Ahmed", "Ali", "Hassan", "Hussain", "Mustafa",
    "Umar", "Usman", "Abubakar", "Hamza", "Bilal", "Zaid", "Yasir", "Salman", "Ibrahim", "Ismail",
    "Ishaq", "Yaqub", "Yusuf", "Musa", "Haroon", "Dawood", "Sulayman", "Yunus", "Zakariya", "Yahya",
    "Isa", "Muhammad", "Anas", "Arshad", "Asad", "Atif", "Ayub", "Azhar", "Faisal", "Farhan",
    "Ghani", "Habib", "Haider", "Idris", "Imtiaz", "Iqbal", "Irfan", "Jafar", "Junaid", "Kamran",
    "Kashif", "Khalid", "Latif", "Mahmood", "Mansoor", "Mazhar", "Nasir", "Naveed", "Omair", "Qasim",
    "Rafiq", "Rashid", "Rizwan", "Saeed", "Shahid", "Sohail", "Tahir", "Tariq", "Wahid", "Waqas",
    "Yaseen", "Zahid", "Zafar", "Zubair"
];

const domains = ["gmail.com", "yahoo.com", "outlook.com"];

async function seed() {
    try {
        const userCount = await User.countDocuments();
        if (userCount >= 300) {
            log("User count is already " + userCount + ". Skipping seeding.");
            return;
        }

        log("Starting seeding process...");
        const users = [];
        for (let i = 0; i < 300; i++) {
            const firstName = names[Math.floor(Math.random() * names.length)].toLowerCase();
            const lastName = names[Math.floor(Math.random() * names.length)].toLowerCase();
            const randomNumber = Math.floor(Math.random() * 9999);
            const domain = domains[Math.floor(Math.random() * domains.length)];

            const email = `${firstName}${randomNumber % 1000}@${domain}`;
            const clerkId = `user_sim_clerk_${i}_${Math.random().toString(36).substring(7)}`;

            users.push({
                clerkId,
                email,
                role: 'user',
                normalTokens: 3,
                specialTokens: 3
            });
        }

        log(`Prepared ${users.length} users. Inserting...`);
        await User.insertMany(users);
        log("✅ Successfully added 300 users with Muslim names.");
    } catch (err) {
        log("❌ Seeding failed: " + err.message);
    }
}

module.exports = seed;

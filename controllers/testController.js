const availabilityService = require('../services/availabilityService');
const securityService = require('../services/securityService');
const lighthouseService = require('../services/lighthouseService');
const axeService = require('../services/axeService');
const crawlerService = require('../services/crawlerService');
const aiService = require('../services/aiService');
const extendedInfoService = require('../services/extendedInfoService');
const User = require('../models/userInfo');
const History = require('../models/history');
const bddService = require('../services/bddService');


// ===== runTest =====
exports.runTest = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const validUrl = url.startsWith('http') ? url : `https://${url}`;

    // ===== STEP 1: Check if URL exists =====
    const availability = await availabilityService.checkAvailability(validUrl);
    if (!availability.up) {
        return res.status(400).json({
            error: 'Website does not exist or is unreachable',
            details: availability.error
        });
    }

    // ===== STEP 1.5: Token Verification =====
    const { email } = req.body;
    if (email) {
        try {
            const user = await User.findOne({ email });
            if (user && user.role !== 'admin') {
                if (user.normalTokens === undefined) user.normalTokens = 3;

                if (user.normalTokens <= 0) {
                    return res.status(403).json({ error: "You have used all your free normal testing tokens. Please contact admin." });
                }

                user.normalTokens -= 1;
                await user.save();
            }
        } catch (err) {
            console.error("Token verification failed:", err);
            // Decide if we block or continue on error. Usually continue or error.
        }
    }

    // ===== STEP 2: Run full tests only if website exists =====
    try {
        const security = await securityService.analyze(validUrl);
        const accessibility = await axeService.analyze(validUrl);
        const lighthouse = await lighthouseService.analyze(validUrl);
        const links = await crawlerService.analyze(validUrl);
        const extended = await extendedInfoService.analyze(validUrl);
        const aiSummary = await aiService.generateSummary({
            availability,
            security,
            accessibility,
            lighthouse,
            links,
            extended
        });

        const results = {
            url: validUrl,
            timestamp: new Date().toISOString(),
            availability,
            security,
            accessibility,
            lighthouse,
            links,
            extended,
            aiSummary
        };

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Test execution failed', details: error.message });
    }
};

// ===== Run Instant Test Scenario =====
exports.runInstantTestScenario = async (req, res) => {
    try {
        const { given, when, then, featureContent, email, url } = req.body;

        // Token check
        if (email) {
            const user = await User.findOne({ email });
            if (user) {
                if (user.role !== 'admin') {
                    if (user.specialTokens === undefined) user.specialTokens = 3;

                    if (user.specialTokens <= 0) {
                        return res.status(403).json({ message: "You have used all your free manual/scenario tokens." });
                    }
                    user.specialTokens -= 1;
                    await user.save();
                }
            }
        }

        if (!featureContent && (!given || !when || !then)) {
            return res.status(400).json({ message: "Either 'featureContent' OR Scenario fields (GIVEN, WHEN, THEN) are required" });
        }

        const result = await bddService.runBDDTest({ given, when, then, featureContent });

        // Save execution to History if email is provided
        if (email && url) {
            try {
                const history = new History({
                    userEmail: email,
                    url: url,
                    result: {
                        success: result.success,
                        output: result.output,
                        scenario: featureContent || `${given} ${when} ${then}`
                    }
                });
                await history.save();
            } catch (hErr) {
                console.error("HISTORY SAVE ERROR (Non-fatal):", hErr.message);
            }
        }

        res.status(200).json({
            message: "Instant test executed",
            success: result.success,
            output: result.output
        });
    } catch (error) {
        console.error("INSTANT RUN ERROR:", error);
        res.status(500).json({ message: "Error running instant test scenario", error: error.message });
    }
};

